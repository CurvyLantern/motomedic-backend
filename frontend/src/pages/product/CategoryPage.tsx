import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  deleteCategory,
  editCategory,
  invalidateCateogryQuery,
  useCategoryQuery,
} from "@/queries/categoryQuery";
import { CategoryWithSubCateogry } from "@/types/defaultTypes";
import {
  ActionIcon,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Modal,
  SimpleGrid,
  Table,
  Tabs,
  TextInput,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useRef, useState } from "react";
import { TbPlus, TbX } from "react-icons/tb";
import { z } from "zod";
const fields = [
  {
    name: "name",
    type: fieldTypes.text,
  },
  {
    label: "Image",
    name: "image",
    type: fieldTypes.fileInput,
  },
] as const;
export type FormValue = {
  name: string;
  image: File | null;
  sub_categories: Array<Omit<FormValue, "sub_categories">>;
};
const CategoryPage = () => {
  return (
    <BasicSection>
      <Container>
        <Tabs defaultValue="view">
          <Tabs.List grow position="center">
            <Tabs.Tab value="view">View Categories</Tabs.Tab>
            <Tabs.Tab value="create">Create Category</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="view">
            <ViewCategories />
          </Tabs.Panel>
          <Tabs.Panel value="create">
            <CreateCategoryForm />
          </Tabs.Panel>
        </Tabs>
      </Container>
    </BasicSection>
  );
};

const ViewCategories = () => {
  const categories = useCategoryQuery();
  console.log(categories, "categories from db ");

  const [isDeletingId, setIsDeletingId] = useState<string | number>();
  const [selectedCategoryForEdit, setSelectedCategoryForEdit] =
    useState<CategoryWithSubCateogry | null>(null);

  const viewCategory = (category: CategoryWithSubCateogry) => {
    modals.open({
      modalId: "viewCategory",
      centered: true,
      withCloseButton: false,
      children: (
        <BasicSection
          title={`Category data`}
          headerRightElement={
            <ActionIcon
              onClick={() => {
                modals.close("viewCategory");
              }}
            >
              <TbX />
            </ActionIcon>
          }
        >
          <Grid>
            <Grid.Col span={4}>Id :</Grid.Col>

            <Grid.Col span={8}>{category.id}</Grid.Col>
            <Grid.Col span={4}>Name :</Grid.Col>

            <Grid.Col span={8}>{category.name}</Grid.Col>
            <Grid.Col span={12}>
              <Divider my="xs" label="Sub Categories" labelPosition="center" />
            </Grid.Col>
            <Table>
              <thead>
                <tr>
                  <th>Id</th>
                  <th>Name</th>
                </tr>
              </thead>
              <tbody>
                {category.sub_categories.map((subCategory) => (
                  <tr key={subCategory.id}>
                    <td>{subCategory.id}</td>
                    <td>{subCategory.name}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Grid>
        </BasicSection>
      ),
    });
  };
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
    useDisclosure(false);

  const tCategoryRows =
    categories?.data && categories.data.length > 0 ? (
      categories.data.map((category) => {
        const deleting = isDeletingId === category.id;
        return (
          <tr key={category.id}>
            <td>{category.id}</td>
            <td>{category.name}</td>
            <td>{category.image}</td>
            <td>
              <SimpleGrid cols={3}>
                <Button
                  disabled={deleting}
                  onClick={() => {
                    viewCategory(category);
                  }}
                  compact
                  size="xs"
                >
                  View
                </Button>
                <Button
                  disabled={deleting}
                  onClick={() => {
                    setSelectedCategoryForEdit(category);
                    openEditModal();
                  }}
                  compact
                  size="xs"
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  loading={deleting}
                  onClick={() => {
                    setIsDeletingId(category.id);
                    deleteCategory(category).finally(() => {
                      setIsDeletingId(undefined);
                    });
                  }}
                  compact
                  size="xs"
                >
                  Delete
                </Button>
              </SimpleGrid>
            </td>
          </tr>
        );
      })
    ) : (
      <tr>
        <td style={{ textAlign: "center" }} colSpan={3}>
          No categories to show
        </td>
      </tr>
    );
  return (
    <BasicSection title="Categories">
      <Modal
        w={"70%"}
        centered
        opened={editModalOpened}
        onClose={closeEditModal}
      >
        {selectedCategoryForEdit ? (
          <EditCategoryForm
            onFinish={closeEditModal}
            category={selectedCategoryForEdit}
          />
        ) : (
          "No category Selected"
        )}
      </Modal>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{tCategoryRows}</tbody>
      </Table>
    </BasicSection>
  );
};

const EditCategoryForm = ({
  category,
  onFinish,
}: {
  onFinish: () => void;
  category: CategoryWithSubCateogry;
}) => {
  const [loading, setLoading] = useState(false);
  const form = useCustomForm({
    initialValues: {
      image: null,
      name: category.name,
      sub_categories: [{ image: null, name: "" }],
      sub_categories_old: category.sub_categories?.map((sc) => ({
        ...sc,
        deleted: 0,
      })),
    },
  });
  const categoryFormRef = useRef<HTMLFormElement>(null);
  const onEdit = async (values: typeof form.values) => {
    setLoading(true);

    const url = "categories";
    // const formData = dataToFormdata({ data: values });
    // const formData = new FormData(categoryFormRef.current ?? undefined);
    // console.log(values , 'from 34')
    // for (const [k, v] of formData.entries()) {
    //     console.log("1 ", k + ", " + JSON.stringify(v));
    // }

    try {
      const res = await axiosClient.v1.api
        .put(`${url}/${category.id}`, values)
        .then((res) => res.data);
      console.log(res, "from on Edit");
      notifications.show({
        color: "green",
        message: "Category Updated successfully",
      });
      form.reset();
      invalidateCateogryQuery();
      onFinish();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onAddSubCateogry = () => {
    form.insertListItem("sub_categories", { name: "", image: "" });
  };
  return (
    <Box>
      <form ref={categoryFormRef} onSubmit={form.onSubmit(onEdit)}>
        <Grid>
          <Grid.Col span="auto">
            <TextInput {...form.getInputProps("name")} />
          </Grid.Col>
          <Grid.Col span={"content"}>
            <Button disabled={loading} type="button" onClick={onAddSubCateogry}>
              <TbPlus />
            </Button>
          </Grid.Col>
          <Grid.Col span={"content"}>
            <Button loading={loading} type="submit">
              Update
            </Button>
          </Grid.Col>

          <Grid.Col span={12}>
            <Table>
              <caption>Old Subcategories</caption>
              <thead>
                <tr>
                  <th>Old Sub category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {form.values.sub_categories_old.map((scold, scoldIdx) => {
                  const isDeleted = scold.deleted === 1;
                  return (
                    <tr key={scold.id}>
                      <td>
                        <TextInput
                          {...form.getInputProps(
                            `sub_categories_old.${scoldIdx}.name`
                          )}
                        />
                      </td>
                      <td>
                        {isDeleted ? (
                          <Button
                            variant="outline"
                            color="yellow"
                            compact
                            size="xs"
                            onClick={() => {
                              form.setFieldValue(
                                `sub_categories_old.${scoldIdx}.deleted`,
                                0
                              );
                            }}
                          >
                            Undo
                          </Button>
                        ) : (
                          <Button
                            variant="danger"
                            compact
                            size="xs"
                            onClick={() => {
                              form.setFieldValue(
                                `sub_categories_old.${scoldIdx}.deleted`,
                                1
                              );
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <Table withBorder withColumnBorders>
              <caption>New Subcategories</caption>

              <thead>
                <tr>
                  <th>Sub Category Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {form.values.sub_categories.map((subCat, subCatIndex) => {
                  return (
                    <tr key={subCatIndex}>
                      <td>
                        <TextInput
                          {...form.getInputProps(
                            `sub_categories.${subCatIndex}.name`
                          )}
                        />
                      </td>
                      <td>
                        <Button
                          type="button"
                          onClick={() =>
                            form.removeListItem("sub_categories", subCatIndex)
                          }
                          variant="danger"
                          compact
                          size="xs"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Grid.Col>
        </Grid>
      </form>
    </Box>
  );
};

const validationSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  image: z.any().refine((file) => {
    return file instanceof File || !file;
  }),
  sub_categories: z.array(
    z.object({
      name: z.string().min(1, "Name cannot be empty"),
      image: z.any().refine((file) => {
        return file instanceof File || !file;
      }),
    })
  ),
});
type CategoryFormValue = z.infer<typeof validationSchema>;

const CreateCategoryForm = () => {
  const [loading, setLoading] = useState(false);
  const form = useCustomForm<CategoryFormValue>({
    initialValues: {
      image: null,
      name: "",
      sub_categories: [],
    },

    // { image: null, name: "" }
    validate: zodResolver(validationSchema),
    //   parentCategoryId: () => null,
  });
  const categoryFormRef = useRef<HTMLFormElement>(null);
  const onCreate = async () => {
    setLoading(true);

    const url = "categories";
    // const formData = dataToFormdata({ data: values });
    const formData = new FormData(categoryFormRef.current ?? undefined);
    // console.log(values , 'from 34')
    // for (const [k, v] of formData.entries()) {
    //     console.log("1 ", k + ", " + JSON.stringify(v));
    // }

    try {
      const res = await axiosClient.v1.api
        .post(url, formData)
        .then((res) => res.data);
      console.log(res, "from on create");
      notifications.show({
        color: "green",
        message: "Category created successfully",
      });
      form.reset();
      invalidateCateogryQuery();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  const onAddSubCateogry = () => {
    form.insertListItem("sub_categories", { name: "", image: "" });
  };
  const subCategorieRows = form.values.sub_categories.map(
    (subCat, subCatIndex) => {
      return (
        <tr key={subCatIndex}>
          <td>
            <BaseInputs
              form={form}
              field={{
                name: `sub_categories.${subCatIndex}.name`,
                type: fieldTypes.text,
                data: "",
              }}
            ></BaseInputs>
          </td>
          <td>
            <BaseInputs
              form={form}
              field={{
                name: `sub_categories.${subCatIndex}.image`,
                type: fieldTypes.fileButton,
                data: null,
                label: "Pick file",
              }}
            ></BaseInputs>
          </td>
          <td>
            <Button
              type="button"
              onClick={() => form.removeListItem("sub_categories", subCatIndex)}
              variant="danger"
              compact
              size="xs"
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    }
  );
  return (
    <BasicSection title="Create Category">
      <form ref={categoryFormRef} onSubmit={form.onSubmit(onCreate)}>
        <Grid>
          {fields.map((field, fieldIdx) => {
            return (
              <Grid.Col key={fieldIdx} span="auto">
                <BaseInputs key={fieldIdx} field={field} form={form} />
              </Grid.Col>
            );
          })}
          <Grid.Col span={"content"}>
            <Button disabled={loading} type="button" onClick={onAddSubCateogry}>
              <TbPlus />
            </Button>
          </Grid.Col>
          <Grid.Col span={"content"}>
            <Button loading={loading} type="submit">
              Submit
            </Button>
          </Grid.Col>

          <Grid.Col span={12}>
            <Table withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>Sub Category Name</th>
                  <th>Sub Category Image</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>{subCategorieRows}</tbody>
            </Table>
          </Grid.Col>
        </Grid>
      </form>
    </BasicSection>
  );
};

export default CategoryPage;
