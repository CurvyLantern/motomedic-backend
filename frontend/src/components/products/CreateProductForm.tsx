import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import {
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Text,
  TextInput,
} from "@mantine/core";
// import ProductFields from "./ProductFields";

import useCustomForm from "@/hooks/useCustomForm";
import { useProductSelectData } from "@/selectInputData/SelectInputDatas";
import dataToFormData from "@/utils/dataToFormdata";
import { zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { DescriptionEditor } from "./fields/DescriptionEditor";
import VariantProducts from "./fields/VariantProducts";
import { SelectColorField } from "../fields/color/MultiSelectColorField";
import { TbPlus } from "react-icons/tb";
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
const validStringValidation = (msg = "Field cannot be empty") =>
  z.string().min(1, msg);
const validationSchema = z
  .object({
    name: validStringValidation("Product name cannot be empty"),
    category_id: validStringValidation("Please select a category"),
    brand_id: validStringValidation("Please select a brand"),
    color_id: z.string(),
    model_id: z.string(),
    weight: z.number().nonnegative().default(0),
    status: validStringValidation("Please select product status"),
    barcode: z.string(),
    warranty: z.number().nonnegative().default(0),
    description: z.string(),
    variations: z
      .object({
        // name: z.string(),
        color_id: z.string(),
        model_id: z.string(),
        attribute_value_ids: z.string().array(),
        barcode: z.string(),
      })
      .array(),
    variation_enabled: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (!data.variation_enabled) {
        return data.barcode.trim() !== "" && data.model_id.trim() !== "";
      }
      return data.barcode.trim() === "" && data.barcode.trim() === "";
    },
    (data) => {
      if (data.variation_enabled) {
        return {
          message: "Variation products cannot have own barcode or model",
          path: ["barcode", "model_id"],
        };
      } else {
        return {
          message: "Barcode or model is required for non variant products",
          path: ["barcode", "model_id"],
        };
      }
    }
  );
export type ProductFormValues = z.infer<typeof validationSchema>;
const CreateProductForm = () => {
  const form = useCustomForm<ProductFormValues>({
    initialValues: {
      name: "",
      category_id: "",
      brand_id: "",
      color_id: "",
      model_id: "",
      weight: 0,
      status: "",
      barcode: "",
      warranty: 0,
      description: "Write a brief description about the product",
      variations: [],
      variation_enabled: false,
    },
    validate: zodResolver(validationSchema),
  });
  const onFormSubmit = async (values: typeof form.values) => {
    console.log(values, "Product form");

    const formData = dataToFormData({
      data: values,
    });

    for (const [k, v] of formData.entries()) {
      console.log(`${k} => ${v} ${typeof v}`);
    }
    const state = true;
    if (state) return;

    // const state = true;
    // if (state) {
    //   return;
    // }

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
      notifications.show({
        // @ts-expect-error stupid error
        message: JSON.stringify(error.data.message),
        color: "red",
      });
      console.error(error);
    }
  };
  const [previousVariationsArr, setPreviousVariationsArr] = useState<
    typeof form.values.variations
  >([]);

  useEffect(() => {
    if (!form.values.variation_enabled) {
      setPreviousVariationsArr(form.values.variations);
      form.setFieldValue("variations", []);
    }
  }, [form.values.variation_enabled]);
  useEffect(() => {
    if (form.values.variation_enabled) {
      form.setFieldValue("variations", previousVariationsArr);
    }
  }, [form.values.variation_enabled, previousVariationsArr]);

  const {
    selectBrandsData,
    selectCategoriesData,
    selectColorsData,
    selectsProductModelMap,
  } = useProductSelectData();

  const filteredProductModelData = useMemo(() => {
    if (form.values.brand_id && selectsProductModelMap) {
      return selectsProductModelMap[form.values.brand_id];
    }
    return [];
  }, [form.values.brand_id, selectsProductModelMap]);

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Grid m={0} justify="center" gutter={"sm"} grow>
        <Grid.Col span={12}>
          <BasicSection>
            <Group position="right">
              <Button sx={{ fontSize: 20 }} type="submit" size="md">
                <TbPlus />
              </Button>
              <Button
                onClick={() => {
                  modals.openConfirmModal({
                    title: "Reset everything ??",
                    centered: true,
                    children: (
                      <Text size="sm">
                        Are you sure you want to reset form ?
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
              <TextInput
                tabIndex={0}
                withAsterisk
                label="Product Name"
                placeholder="Enter product name"
                {...form.getInputProps("name")}
              />
              <Select
                dropdownPosition="bottom"
                searchable
                nothingFound="No category found"
                tabIndex={0}
                label="Category"
                placeholder="Select a category"
                {...form.getInputProps("category_id")}
                data={selectCategoriesData ?? []}
              />
              <Select
                dropdownPosition="bottom"
                searchable
                nothingFound="No Brand found"
                tabIndex={0}
                withAsterisk
                label="Brand"
                placeholder="Select a brand"
                {...form.getInputProps("brand_id")}
                data={selectBrandsData}
              />
              <SelectColorField
                dropdownPosition="bottom"
                searchable
                nothingFound="No Color found"
                tabIndex={0}
                colors={selectColorsData}
                label="Product Color"
                placeholder="Select a color"
                {...form.getInputProps("color_id")}
              />
              <Select
                disabled={form.values.variation_enabled}
                dropdownPosition="bottom"
                searchable
                nothingFound="No product model found"
                tabIndex={0}
                withAsterisk
                label="Product Model"
                placeholder="Select a model for product"
                {...form.getInputProps("model_id")}
                data={filteredProductModelData}
              />
              <NumberInput
                min={0}
                tabIndex={0}
                label="Weight in kg"
                {...form.getInputProps("weight")}
              />
              <Select
                tabIndex={0}
                label="Status"
                {...form.getInputProps("status")}
                data={[
                  { label: "active", value: "1" },
                  { label: "inactive", value: "0" },
                ]}
              />
              <TextInput
                disabled={form.values.variation_enabled}
                tabIndex={0}
                label="Barcode"
                placeholder="Enter barcode"
                withAsterisk={!form.values.variation_enabled}
                {...form.getInputProps("barcode")}
              />
              <NumberInput
                tabIndex={0}
                label="Warranty in months"
                placeholder="Demo : 6 months"
                {...form.getInputProps("warranty")}
              />
            </ProductFieldSimpleGrid>
          </BasicSection>
        </Grid.Col>

        <Grid.Col span={12} lg={6}>
          <BasicSection title="Product Description">
            <DescriptionEditor
              defaultContent={form.values.description}
              setContent={(value) => {
                form.setFieldValue("description", value);
              }}
            />
          </BasicSection>
        </Grid.Col>

        <Grid.Col span={12} lg={6}>
          <BasicSection title="Product Variation">
            <Stack>
              <Group position="apart">
                <Switch
                  checked={form.values.variation_enabled}
                  onChange={(event) => {
                    form.setFieldValue(
                      "variation_enabled",
                      event.currentTarget.checked
                    );
                  }}
                  label="Enable Variations"
                  labelPosition="left"
                ></Switch>
                <Button
                  disabled={!form.values.variation_enabled}
                  onClick={() => {
                    form.insertListItem("variations", {
                      name: "",
                      color_id: "",
                      attribute_value_ids: [],
                      barcode: "",
                    });
                  }}
                >
                  Add Variations
                </Button>
              </Group>
              <VariantProducts
                form={form}
                hidden={!form.values.variation_enabled}
                filteredProductModelData={filteredProductModelData}
              />
            </Stack>
          </BasicSection>
        </Grid.Col>
      </Grid>
      {/* </Stack> */}
    </form>
  );
};

export default CreateProductForm;
