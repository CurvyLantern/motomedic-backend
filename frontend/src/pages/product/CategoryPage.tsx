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
import dataToFormdata from "@/utils/dataToFormdata";
import {
    Text,
    Stack,
    Tabs,
    Button,
    Container,
    Group,
    SimpleGrid,
    Table,
    Grid,
    Collapse,
    Divider,
    ActionIcon,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { ca, tr } from "date-fns/locale";
import React from "react";
import { useMemo, useRef, useState } from "react";
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

    const [isDeletingId, setIsDeletingId] = useState<string | number>();

    const viewCategory = (category: CategoryWithSubCateogry) => {
        modals.open({
            modalId: "viewCategory",
            centered: true,
            withCloseButton: false,
            children: (
                <BasicSection
                    title={`All Category data of ${category.id}`}
                    headerLeftElement={
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
                            <Divider
                                my="xs"
                                label="Sub Categories"
                                labelPosition="center"
                            />
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
    const tCategoryRows =
        categories && categories.length > 0 ? (
            categories.map((category) => {
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
                                        editCategory(category);
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

const validationSchema = () => {
    const obj = {
        name: z.string().min(1, "Name cannot be empty"),
        image: z.any().refine((file) => {
            return file instanceof File || !file;
        }),
    };
    return zodResolver(
        z.object({
            ...obj,
            sub_categories: z.array(z.object(obj)),
        })
    );
};
const CreateCategoryForm = () => {
    const [loading, setLoading] = useState(false);
    const form = useCustomForm<FormValue>({
        initialValues: {
            image: null,
            name: "",
            sub_categories: [{ image: null, name: "" }],
        },

        validate: validationSchema(),
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
            <form ref={categoryFormRef} onSubmit={form.onSubmit(onCreate)}>
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
                        <Button
                            disabled={loading}
                            type="button"
                            onClick={onAddSubCateogry}
                        >
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
