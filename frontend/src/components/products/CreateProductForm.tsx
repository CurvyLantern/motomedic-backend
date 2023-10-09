import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import {
  Switch,
  Stack,
  Text,
  Button,
  Grid,
  Group,
  SimpleGrid,
  Title,
} from "@mantine/core";
// import ProductFields from "./ProductFields";

import BaseInputs from "@/components/inputs/BaseInputs";
import { productFields } from "@/components/products/fields/fields";
import { useProductForm } from "@/components/products/fields/hooks/useProductForm";
import { TypedObject } from "@/types/defaultTypes";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useState } from "react";
import { fieldTypes } from "./fields/ProductFields";
import { ProductVariationFieldsSimple } from "./fields/ProductVariationFieldsSimple";
import VariantProducts from "./fields/VariantProducts";
import dataToFormData from "@/utils/dataToFormdata";
const url = "products";

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
        acc[k as keyof typeof productFields] = v.map((field, fieldIdx) => {
          const isSelect = field.type === fieldTypes.select;
          if (isSelect) {
            field.data = selectInitialData[field.name] ?? field.data;
          }
          return (
            <BaseInputs
              form={form}
              // @ts-expect-error i dont know why
              field={field}
              key={field.name}
            />
          );
        });
        return acc;
      }, {} as TypedObject<typeof productFields, JSX.Element[]>),
    [form, selectInitialData]
  );

  const onFormSubmit = async (values: typeof form.values) => {
    console.log(values, "from form");
    const formData = dataToFormData({
      data: values,
    });

    for (const [k, v] of formData.entries()) {
      console.log(`${k} => ${v} ${typeof v}`);
    }

    try {
      const data = await axiosClient.v1.api
        .post(url, formData)
        .then((res) => res.data);
      console.log(data, " from product submit server ");
      notifications.show({
        message: "Product Created Successfully",
        color: "green",
      });
      form.reset();
    } catch (error) {
      console.error(error);
    }
  };
  const [previousVariationsArr, setPreviousVariationsArr] = useState<[]>([]);
  useEffect(() => {
    if (!form.values.variation_enabled) {
      setPreviousVariationsArr(form.values.variations as unknown as []);
      form.setFieldValue(
        "variations",
        [] as unknown as typeof form.values.variations
      );
    } else {
      form.setFieldValue(
        "variations",
        previousVariationsArr as unknown as typeof form.values.variations
      );
    }
  }, [form.values.variation_enabled]);

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      {/* <Stack spacing="xl"> */}
      {/* basic and description */}

      <Grid m={0} justify="center" gutter={"sm"} grow>
        <Grid.Col span={12}>
          <BasicSection>
            <Group position="right">
              <Button type="submit" size="md">
                Submit
              </Button>
              <Button
                onClick={() => {
                  // console.log(form.values, "form values");
                  modals.openConfirmModal({
                    title: "Reset everything ??",
                    centered: true,
                    children: (
                      <Text size="sm">
                        Are you sure you want to rest form ?
                      </Text>
                    ),
                    labels: {
                      confirm: "Yes",
                      cancel: "No",
                    },
                    confirmProps: { variant: "danger" },
                    onCancel: () => {},
                    onConfirm: () => {
                      form.reset();
                    },
                  });
                }}
                variant={"danger"}
                type="button"
                size="md"
              >
                Reset
              </Button>
            </Group>
          </BasicSection>
        </Grid.Col>

        <Grid.Col span={12} lg={6}>
          <BasicSection title="Basic Info">
            <ProductFieldSimpleGrid>
              {FieldElements.basicInfo}
              {FieldElements.sellInfo}
            </ProductFieldSimpleGrid>
          </BasicSection>
        </Grid.Col>
        <Grid.Col span={12} md={6} lg={3}>
          <BasicSection title="Formal Fields">
            <SimpleGrid cols={1}>{FieldElements.formals}</SimpleGrid>
          </BasicSection>
        </Grid.Col>
        <Grid.Col span={12} md={6} lg={3}>
          <BasicSection title="Service Infos">
            <SimpleGrid cols={1}>{FieldElements.serviceInfo}</SimpleGrid>
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
          {/* <ProductVariationFields /> */}
          {/* <ProductVariationFieldsSimple /> */}
          <BasicSection title="Product Variation">
            <Stack>
              <Switch
                {...form.getInputProps("variation_enabled", {
                  type: "checkbox",
                })}
                label="Enable Variations"
                labelPosition="left"
              ></Switch>
              {form.values.variation_enabled ? (
                <VariantProducts form={form} />
              ) : null}
            </Stack>
          </BasicSection>
        </Grid.Col>
      </Grid>
      {/* </Stack> */}
    </form>
  );
};

export default CreateProductForm;
