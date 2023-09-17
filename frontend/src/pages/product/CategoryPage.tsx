import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import objToFormdata from "@/utils/objToFormdata";
import {
  Stack,
  Tabs,
  Button,
  Container,
  Group,
  SimpleGrid,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
const fields = [
  {
    data: "",
    label: "Name",
    name: "categoryName",
    type: fieldTypes.text,
  },
  {
    data: "",
    label: "Description",
    name: "description",
    type: fieldTypes.textarea,
  },
  {
    data: null,
    label: "Image",
    name: "img",
    type: fieldTypes.fileInput,
  },
  //   {
  //     data: [{ label: "Cat 1", value: "cat-1" }],
  //     label: "Parent Category",
  //     name: "parentCategoryId",
  //     type: fieldTypes.select,
  //   },
] as const;
type FormValue = {
  categoryName: string;
  description: string;
  img: File | null;
};
const CategoryPage = () => {
  const form = useForm<FormValue>({
    initialValues: fields.reduce((acc, item) => {
      // @ts-expect-error dont want to define type for this
      acc[item.name] = item.data;
      return acc;
    }, {} as FormValue),

    validate: {
      categoryName: () => null,
      description: () => null,
      img: () => null,
      //   parentCategoryId: () => null,
    },
  });
  const onCreate = async (values: {
    categoryName: string;
    description: string;
    img: File | null;
  }) => {
    const url = "v1/category";
    console.log(values);
    const resBody = {
      categoryName: values.categoryName,
      description: values.description,
      img: values.img,
    };

    console.log(resBody, " from file ");
    // //@ts-ignore
    // data.img = [data.img];
    const formData = new FormData();
    objToFormdata(formData, values);
    // if (values.img) {
    //   formData.append("img", values.img);
    // }
    // formData.append("categoryName", values.categoryName);
    // formData.append("description", values.description);
    for (const pair of formData.entries()) {
      console.log(pair[0] + ", " + pair[1]);
    }
    // console.log(JSON.stringify(formData.entries()), "from onCreate");
    try {
      /*
      {
          headers: {
            // "content-type": "multipart/form-data",
          },
        }
      */
      const res = await axiosClient.v1.api
          .post(url, resBody, {
              headers: {
                  "content-type": "multipart/form-data",
              },
          })
          .then((res) => res.data);
      console.log(res, "from on create");
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <Container>
      <Tabs defaultValue="view">
        <Tabs.List>
          <Tabs.Tab value="view">View Categories</Tabs.Tab>
          <Tabs.Tab value="create">Create Category</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="view">
          <BasicSection title="Categories">
            <Table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Image</th>
                  <th>Parent Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Category 1</td>
                  <td>Category 1</td>
                  <td>Category 1</td>
                  <td>Category 1</td>
                  <td>
                    <SimpleGrid cols={2}>
                      <Button
                        compact
                        size="xs">
                        Edit
                      </Button>
                      <Button
                        compact
                        size="xs">
                        Delete
                      </Button>
                    </SimpleGrid>
                  </td>
                </tr>
              </tbody>
            </Table>
          </BasicSection>
        </Tabs.Panel>
        <Tabs.Panel value="create">
          <BasicSection title="Create Category">
            <form
              onSubmit={form.onSubmit((values) => {
                onCreate(values);
              })}>
              <Stack>
                {fields.map((field, fieldIdx) => {
                  return (
                    <BaseInputs
                      key={fieldIdx}
                      field={field}
                      form={form}
                    />
                  );
                })}
                <Button type="submit">Confirm</Button>
              </Stack>
            </form>
          </BasicSection>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default CategoryPage;
