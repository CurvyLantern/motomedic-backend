import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { useCategoryQuery } from "@/queries/categoryQuery";
import dataToFormdata from "@/utils/dataToFormdata";
import {
    Stack,
    Tabs,
    Button,
    Container,
    Group,
    SimpleGrid,
    Table,
    Grid,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { tr } from "date-fns/locale";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";
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
type FormValue = {
    name: string;
    image: File | null;
    sub_categories: Array<Omit<FormValue, "sub_categories">>;
};
const CategoryPage = () => {
    return (
        <Container>
            <Tabs defaultValue="view">
                <Tabs.List>
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
    );
};

const ViewCategories = () => {
    const { categories } = useCategoryQuery();
    console.log(categories, "categories from db ");
    const isArr = Array.isArray(categories);
    const tCategoryRows = isArr
        ? categories.map((category) => {
              return (
                  <tr key={category.id}>
                      <td>{category.name}</td>
                      <td>{category.description}</td>
                      <td>{category.image}</td>
                      <td>{category.parentCategory}</td>
                      <td>
                          <SimpleGrid cols={2}>
                              <Button compact size="xs">
                                  Edit
                              </Button>
                              <Button compact size="xs">
                                  Delete
                              </Button>
                          </SimpleGrid>
                      </td>
                  </tr>
              );
          })
        : null;
    return (
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
                <tbody>{tCategoryRows}</tbody>
            </Table>
        </BasicSection>
    );
};

const CreateCategoryForm = () => {
    const form = useForm<FormValue>({
        initialValues: {
            image: null,
            name: "",
            sub_categories: [{ image: null, name: "" }],
        },

        validate: zodResolver(
            z.object({
                name: z.string().min(1),
                image: z.any().refine((file) => {
                    return file instanceof File || !file;
                }),
                sub_categories: z.array(
                    z.object({
                        name: z.string().min(1, "name cannot be empty"),
                        image: z.any().refine((file) => {
                            return file instanceof File || !file;
                        }),
                    })
                ),
            })
        ),
        //   parentCategoryId: () => null,
    });
    const onCreate = async () => {
        const url = "categories";
        const values = form.getTransformedValues();
        console.log(values);
        const formData = new FormData();
        dataToFormdata(formData, values);
        for (const pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
        try {
            /*
          {
              headers: {
                // "content-type": "multipart/form-data",
              },
            }
          */
            const res = await axiosClient.v1.api
                .post(url, formData, {
                    // headers: {
                    //     "content-type": "multipart/form-data",
                    // },
                })
                .then((res) => res.data);
            console.log(res, "from on create");
        } catch (error) {
            console.error(error);
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
                            onClick={() =>
                                form.removeListItem(
                                    "sub_categories",
                                    subCatIndex
                                )
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
        }
    );
    return (
        <BasicSection title="Create Category">
            <form
                onSubmit={form.onSubmit((values) => {
                    onCreate();
                    // console.log(values, "form value");
                })}
            >
                <Grid>
                    {fields.map((field, fieldIdx) => {
                        return (
                            <Grid.Col key={fieldIdx} span="auto">
                                <BaseInputs
                                    key={fieldIdx}
                                    field={field}
                                    form={form}
                                />
                            </Grid.Col>
                        );
                    })}
                    <Grid.Col span={"content"}>
                        <Button type="button" onClick={onAddSubCateogry}>
                            <TbPlus />
                        </Button>
                    </Grid.Col>
                    <Grid.Col span={"content"}>
                        <Button type="submit">Submit</Button>
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
