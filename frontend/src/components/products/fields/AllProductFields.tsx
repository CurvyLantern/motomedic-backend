import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { Button, Grid, Group, SimpleGrid, Stack } from "@mantine/core";
// import ProductFields from "./ProductFields";

import { productFields } from "./fields";
import { useProductForm } from "./hooks/useProductForm";
import { useEffect, useMemo } from "react";
import { ProductVariationFields } from "./ProductVariationField";
import BaseInputs from "@/components/inputs/BaseInputs";

const uploadProduct = (data: unknown) => {
  try {
    axiosClient.post("http://localhost:8000/api/product/create", data);
  } catch (error) {
    console.error(error);
  }
};
export const AllProductFields = () => {
  const form = useProductForm();
  useEffect(() => {
    console.log(form);
  }, [form]);

  const FieldElements = useMemo(
    () =>
      Object.entries(productFields).reduce((acc, [k, v]) => {
        acc[k as keyof typeof productFields] = v.map((field, fieldIdx) => (
          <BaseInputs
            form={form}
            // @ts-expect-error i dont know why
            field={field}
            key={fieldIdx}
          />
        ));
        return acc;
      }, {} as TypedObject<typeof productFields, JSX.Element[]>),
    [form]
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
  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Stack spacing="xl">
        {/* basic and description */}
        <Grid>
          <Grid.Col span={12}>
            <BasicSection title="Basic Info">
              <SimpleGrid
                cols={1}
                breakpoints={[
                  { minWidth: "sm", cols: 2 },
                  { minWidth: "md", cols: 3 },
                  { minWidth: "lg", cols: 4 },
                ]}>
                {FieldElements.basicInfo}
              </SimpleGrid>
            </BasicSection>
          </Grid.Col>
          <Grid.Col span={12}>
            <BasicSection title="Product Description">
              <SimpleGrid cols={1}>{FieldElements.desc}</SimpleGrid>
            </BasicSection>
          </Grid.Col>

          <Grid.Col span={12}>
            <BasicSection title="Sell Info">
              <SimpleGrid cols={4}>{FieldElements.sellInfo}</SimpleGrid>
            </BasicSection>
          </Grid.Col>
        </Grid>

        {/* formal fields and extra infos */}
        <Grid>
          <Grid.Col span={7}>
            <BasicSection title="Image of Product">
              <SimpleGrid cols={1}>{FieldElements.img}</SimpleGrid>
            </BasicSection>
          </Grid.Col>
          <Grid.Col span={5}>
            <BasicSection title="Extra Info">
              <Stack>{FieldElements.extraInfos}</Stack>
            </BasicSection>
          </Grid.Col>
        </Grid>

        <Grid>
          <Grid.Col span={5}>
            <BasicSection title="Formal Fields">
              <SimpleGrid cols={1}>{FieldElements.formals}</SimpleGrid>
            </BasicSection>
          </Grid.Col>
          <Grid.Col span={7}>
            <BasicSection title="SEO Tags">
              <SimpleGrid cols={1}>{FieldElements.seoTag}</SimpleGrid>
            </BasicSection>
          </Grid.Col>
        </Grid>

        <ProductVariationFields />

        <BasicSection>
          <Group>
            <Button
              type="submit"
              size="lg">
              Submit
            </Button>
            <Button
              type="button"
              size="lg">
              Cancel
            </Button>
          </Group>
        </BasicSection>
      </Stack>
    </form>
  );
};
