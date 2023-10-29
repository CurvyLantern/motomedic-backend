/* eslint-disable @typescript-eslint/no-explicit-any */
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import {
  Box,
  Button,
  Grid,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
} from "@mantine/core";
// import ProductFields from "./ProductFields";

import { DescriptionEditor } from "@/components/products/fields/DescriptionEditor";
import VariantProducts from "@/components/products/fields/VariantProducts";
import useCustomForm from "@/hooks/useCustomForm";
import { Product } from "@/types/defaultTypes";
import {
  useBrandSelectData,
  useCategorySelectData,
  useColorSelectData,
} from "@/utils/selectFieldsData";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
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
const EditProductForm = ({
  productData,
  selectBrands,
  selectCategories,
  selectColors,
}: {
  productData: Product;
  selectColors?: any[];
  selectBrands?: any[];
  selectCategories?: any[];
}) => {
  console.log(productData, "productData");
  const navigate = useNavigate();

  const form = useCustomForm({
    initialValues: () => ({
      name: productData?.name,
      category_id: productData?.category_id.toString(),
      brand_id: productData?.brand_id.toString(),
      color_id: productData?.color_id.toString(),
      model: productData?.model,
      weight: productData?.weight,
      status: productData?.status.toString(),
      price: productData?.price,
      barcode: productData?.barcode,
      warranty: productData?.warranty,
      description: productData?.description,
      variations: [],
      variations_old: productData.variations
        ? productData.variations.map((v) => ({
            id: v.id,
            price: v.price,
            deleted: 0,
          }))
        : [],
    }),
  });

  const onFormSubmit = async (values: typeof form.values) => {
    console.log(values, "from form");
    console.log(JSON.stringify(values), "from form");
    try {
      const serverData = await axiosClient.v1.api
        .put(`products/${productData.id}`, values)
        .then((data) => data.data);

      console.log(serverData, "serverData");

      notifications.show({
        message: "updated Product Successfully",
        color: "green",
      });

      // navigate("/product/all");
    } catch (error) {
      notifications.show({
        message: JSON.stringify(error.data.message),
        color: "red",
      });
    }
  };
  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      {/* <Stack spacing="xl"> */}
      {/* basic and description */}

      <Grid m={0} justify="center" gutter={"sm"} grow>
        <Grid.Col span={12}>
          <BasicSection>
            <Group position="right">
              <Button type="submit" size="md">
                Update
              </Button>
              <Button
                onClick={() => {
                  // console.log(form.values, "form values");
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
              <TextInput label="Product Name" {...form.getInputProps("name")} />
              <Select
                label="Category"
                {...form.getInputProps("category_id")}
                data={selectCategories ?? []}
              />
              <Select
                label="Brand"
                {...form.getInputProps("brand_id")}
                data={selectBrands ?? []}
              />
              <Select
                label="Product Color"
                {...form.getInputProps("color_id")}
                data={selectColors ?? []}
              />
              <TextInput label="Model" {...form.getInputProps("model")} />
              <TextInput
                label="Weight in kg"
                {...form.getInputProps("weight")}
              />
              <Select
                label="Status"
                {...form.getInputProps("status")}
                data={[
                  { label: "active", value: "1" },
                  { label: "inactive", value: "0" },
                ]}
              />
              <TextInput label="Price" {...form.getInputProps("price")} />
              <TextInput label="Barcode" {...form.getInputProps("barcode")} />
              <TextInput label="Warranty" {...form.getInputProps("warranty")} />
            </ProductFieldSimpleGrid>
          </BasicSection>
        </Grid.Col>

        <Grid.Col span={12} lg={6}>
          <BasicSection title="Product Description">
            <SimpleGrid cols={1}>
              <DescriptionEditor
                content={form.values["description"]}
                setContent={(v) => {
                  form.setFieldValue("description", v);
                }}
              />
            </SimpleGrid>
          </BasicSection>
        </Grid.Col>

        <Grid.Col span={12} lg={6}>
          <BasicSection title="Product Variation Old">
            <Table>
              <thead>
                <tr>
                  <th>Variant name</th>
                  <th>Color</th>
                  <th>Attributes</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {productData.variations?.map((v, vIdx) => {
                  console.log(v, "v");
                  const isDeleted = Boolean(
                    form.values.variations_old[vIdx].deleted
                  );
                  return (
                    <tr key={v.id}>
                      <td>{v.name}</td>
                      <td>
                        <Group>
                          <Box
                            sx={{
                              borderRadius: "50%",
                              width: 20,
                              height: 20,
                              backgroundColor: v.color.hexcode,
                            }}
                          ></Box>
                          {v.color.name}
                        </Group>
                      </td>
                      <td>
                        {v.attribute_values.map((av) => av.name).join("-")}
                      </td>
                      <td>
                        <NumberInput
                          disabled={isDeleted}
                          {...form.getInputProps(
                            `variations_old.${vIdx}.price`
                          )}
                        />
                      </td>
                      <td>
                        {isDeleted ? (
                          <Button
                            onClick={() => {
                              form.setFieldValue(
                                `variations_old.${vIdx}.deleted`,
                                Number(!isDeleted)
                              );
                            }}
                            variant="outline"
                            color="yellow"
                            compact
                            size="xs"
                          >
                            Undo
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              form.setFieldValue(
                                `variations_old.${vIdx}.deleted`,
                                Number(!isDeleted)
                              );
                            }}
                            variant="danger"
                            compact
                            size="xs"
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
          </BasicSection>
        </Grid.Col>
        <Grid.Col span={12} lg={6}>
          <BasicSection title="Product Variation New">
            <Stack>
              <Group position="apart">
                <Button
                  onClick={() => {
                    form.insertListItem("variations", {
                      name: "",
                      color_id: "",
                      attribute_value_ids: [],
                      price: 100,
                    });
                  }}
                >
                  Add Variations
                </Button>
              </Group>
              <VariantProducts form={form} hidden={false} />
            </Stack>
          </BasicSection>
        </Grid.Col>
      </Grid>
      {/* </Stack> */}
    </form>
  );
};

const DataLoader = () => {
  const { productSku } = useParams();
  const { data: productData, isLoading } = useQuery<Product>({
    queryKey: ["get/products", productSku],
    queryFn: () => {
      return axiosClient.v1.api
        .get(`products/${productSku}`)
        .then((data) => data.data.product);
    },
  });

  const selectCategories = useCategorySelectData();
  const selectBrands = useBrandSelectData();
  const selectColors = useColorSelectData();

  return (
    <>
      {isLoading ? (
        <div>Loading ...</div>
      ) : productData ? (
        <EditProductForm
          selectColors={selectColors}
          selectBrands={selectBrands}
          selectCategories={selectCategories}
          productData={productData}
        />
      ) : (
        "Product Data unavailable"
      )}
    </>
  );
};

export default DataLoader;
