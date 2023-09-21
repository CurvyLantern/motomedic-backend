import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { Button, Grid, Group, SimpleGrid } from "@mantine/core";
// import ProductFields from "./ProductFields";

import BaseInputs from "@/components/inputs/BaseInputs";
import { ProductVariationFields } from "@/components/products/fields/ProductVariationField";
import { productFields } from "@/components/products/fields/fields";
import { useProductForm } from "@/components/products/fields/hooks/useProductForm";
import { TypedObject } from "@/types/defaultTypes";
import { notifications } from "@mantine/notifications";
import { useMemo } from "react";
import { fieldTypes } from "./fields/ProductFields";

const url = "products";
const uploadProduct = async (data: unknown) => {
    try {
        await axiosClient.v1.api.post(url, data);
        notifications.show({
            message: "Product Created Successfully",
            color: "green",
        });
    } catch (error) {
        console.error(error);
    }
};
const ProductFieldSimpleGrid: React.FC<{
    sm?: number;
    md?: number;
    lg?: number;
    children?: React.ReactNode;
}> = ({ children, lg, md, sm }) => {
    return (
        <SimpleGrid
            cols={1}
            breakpoints={[
                { minWidth: "sm", cols: sm ?? 2 },
                { minWidth: "md", cols: md ?? 3 },
                { minWidth: "lg", cols: lg ?? 3 },
            ]}
        >
            {children}
        </SimpleGrid>
    );
};
const CreateProductForm = () => {
    const { form, selectInitialData } = useProductForm();

    //   Do not touch
    const FieldElements = useMemo(
        () =>
            Object.entries(productFields).reduce((acc, [k, v]) => {
                acc[k as keyof typeof productFields] = v.map(
                    (field, fieldIdx) => {
                        const isSelect = field.type === fieldTypes.select;
                        if (isSelect) {
                            field.data = selectInitialData[field.name];
                            console.log(field, "field");
                        }
                        return (
                            <BaseInputs
                                form={form}
                                // @ts-expect-error i dont know why
                                field={{ ...field }}
                                key={field.name}
                            />
                        );
                    }
                );
                return acc;
            }, {} as TypedObject<typeof productFields, JSX.Element[]>),
        [form, selectInitialData]
    );

    const onFormSubmit = (values: unknown) => {
        console.log(values, "from form");
        uploadProduct({
            productName: "Vanella",
            categoryId: 2,
            brandId: 2,
            model: "RandomModel",
            color: "RandomColor",
            material: "RandomMaterial",
            size: "RandomSize",
            year: 2022,
            compitibility: "RandomCompitibility",
            condition: "RandomCondition",
            weight: "RandomWeight",
            quantity: 10,
            price: 10,
            discount: 10,
            shortDescriptions: "RandomShortDescriptions",
            availability: 0,
            status: 0,
        });
    };
    console.log(form.values, " form values ");
    return (
        <form onSubmit={form.onSubmit(onFormSubmit)}>
            {/* <Stack spacing="xl"> */}
            {/* basic and description */}
            <Grid m={0} justify="center" gutter={"sm"} grow>
                <Grid.Col span={12} lg={6}>
                    <BasicSection title="Basic Info">
                        <ProductFieldSimpleGrid>
                            {FieldElements.basicInfo}
                            {FieldElements.sellInfo}
                        </ProductFieldSimpleGrid>
                    </BasicSection>
                </Grid.Col>
                <Grid.Col span={12} lg={6}>
                    <BasicSection title="Formal Fields">
                        <SimpleGrid cols={1}>
                            {FieldElements.formals}
                        </SimpleGrid>
                    </BasicSection>
                </Grid.Col>

                <Grid.Col span={12} lg={6}>
                    <BasicSection title="Product Description">
                        <SimpleGrid cols={1}>{FieldElements.desc}</SimpleGrid>
                    </BasicSection>
                </Grid.Col>
                <Grid.Col span={12} lg={6}>
                    <BasicSection title="Image of Product">
                        <SimpleGrid cols={1}>{FieldElements.img}</SimpleGrid>
                    </BasicSection>
                </Grid.Col>

                <Grid.Col span={12} lg={6}>
                    <ProductVariationFields />
                </Grid.Col>

                <Grid.Col span={"auto"}>
                    <BasicSection>
                        <Group>
                            <Button type="submit" size="lg">
                                Submit
                            </Button>
                            <Button type="button" size="lg">
                                Cancel
                            </Button>
                        </Group>
                    </BasicSection>
                </Grid.Col>
            </Grid>
            {/* </Stack> */}
        </form>
    );
};

export default CreateProductForm;
