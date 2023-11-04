import ScrollWrapper2 from "@/components/scrollWrapper/ScrollWrapper2";
import { ScrollWrapper } from "@/components/scroller";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import { useProductSearchByNameSkuId } from "@/hooks/useProductSearch";
import axiosClient from "@/lib/axios";
import { useVendorsQuery } from "@/queries/vendorsQuery";
import {
  Box,
  Button,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { UseFormReturnType, zodResolver } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMemo, useState } from "react";
import { z } from "zod";

type InvoiceFields = {
  invoice_id: string;
  seller_id: string;
  cost: number;
  due: number;
};
const url = "inventories";
const CreateInventoryPage = () => {
  return (
    <div>
      <BasicSection title="Add To inventory ">
        <CreateInventoryForm />
      </BasicSection>
    </div>
  );
};

// type FormType = {
//   inventory_total_cost: number;
//   inventory_total_due: number;
//   inventory_vendor_id: string;
//   type: "buying";
//   inventory_products: {
//     product_sku: string;
//     stock_count: number;
//     new_selling_price: number;
//     new_buying_price: number;
//     new_total_cost: number;
//     key: string;
//   }[];
// };
const inventoryFormValidationSchema = z.object({
  inventory_products: z
    .object({
      key: z.string(),
      product_sku: z.string().min(1, "Product is not selected"),
      stock_count: z.number().nonnegative().default(0),
      new_selling_price: z
        .number()
        .nonnegative({ message: "Cannot be negative" })
        .default(0),
      new_buying_price: z
        .number()
        .nonnegative({ message: "Cannot be negative" })
        .default(0),
      // new_total_cost: z
      //   .number()
      //   .nonnegative({ message: "Cannot be negative" })
      //   .default(0),
    })
    .array(),
  type: z.string(),
  inventory_total_cost: z
    .number()
    .nonnegative({ message: "cost can not be negative" }),

  inventory_total_due: z
    .number()
    .nonnegative({ message: "due can not be negative" }),

  inventory_vendor_id: z
    .string()
    .min(1, { message: "vendor id can not be empty" }),
});

type InventoryFormType = z.infer<typeof inventoryFormValidationSchema>;
export const CreateInventoryForm = () => {
  const form = useCustomForm<InventoryFormType>({
    initialValues: {
      inventory_total_cost: 0,
      inventory_total_due: 0,
      inventory_vendor_id: "",
      inventory_products: [
        {
          product_sku: "",
          stock_count: 0,
          new_selling_price: 0,
          new_buying_price: 0,
          key: randomId(),
        },
      ],
      type: "buying",
    },
    validate: zodResolver(inventoryFormValidationSchema),
  });
  const [submitting, setSubmitting] = useState(false);
  const vendors = useVendorsQuery();
  const vendorsSelectData = useMemo(() => {
    return vendors && vendors.data
      ? vendors.data.map((s) => ({ label: s.name, value: String(s.id) }))
      : [];
  }, [vendors]);

  const onFormSubmit = (values: typeof form.values) => {
    console.log(values, " on submit ");
    setSubmitting(true);

    axiosClient.v1.api
      .post(url, values)
      .then((res) => {
        const data = res.data;

        notifications.show({
          title: "Added to inventory",
          message: "",
          color: "green",
        });
        form.reset();
        return data;
      })
      .catch((error) => {
        notifications.show({
          message: error.data.message,
          color: "red",
        });
        console.error(error);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  const addInvoiceProduct = () => {
    form.insertListItem("inventory_products", {
      product_sku: "",
      stock_count: 1,
      new_total_cost: 0,
      new_buying_price: 0,
      new_selling_price: 0,
      key: randomId(),
    });
  };

  const updateTotalCost = ({
    idx,
    buyingPrice,
    count,
    totalCost,
  }: {
    idx: number;
    buyingPrice?: number | string;
    count?: number | string;
    totalCost?: number | string;
  }) => {
    const product = form.values.inventory_products[idx];

    if (totalCost !== undefined) {
      const cost = Number(totalCost);
      form.setFieldValue(
        `inventory_products.${idx}.new_buying_price`,
        cost / product.stock_count
      );

      return;
    }
    if (count !== undefined) {
      const _count = Number(count);
      form.setFieldValue(
        `inventory_products.${idx}.new_total_cost`,
        product.new_buying_price * _count
      );
      return;
    }

    if (buyingPrice !== undefined) {
      const _buyingPrice = Number(buyingPrice);
      form.setFieldValue(
        `inventory_products.${idx}.new_total_cost`,
        product.stock_count * _buyingPrice
      );
      return;
    }
  };

  return (
    <form onSubmit={form.onSubmit(onFormSubmit)}>
      <Stack>
        <SimpleGrid cols={4}>
          <Select
            label="Vendor"
            {...form.getInputProps("inventory_vendor_id")}
            data={vendorsSelectData}
          />
          <NumberInput
            label="Total Cost"
            {...form.getInputProps("inventory_total_cost")}
            min={0}
          />
          <NumberInput
            label="Total Due"
            {...form.getInputProps("inventory_total_due")}
            min={0}
          />

          <Button
            sx={{ alignSelf: "flex-end" }}
            type="button"
            onClick={addInvoiceProduct}
          >
            Add Item
          </Button>
        </SimpleGrid>

        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th style={{ width: "30%" }}>Product</th>
              <th style={{ width: 200, minWidth: 200 }}>Stock</th>
              <th style={{ width: 200, minWidth: 200 }}>Buy Price</th>
              <th style={{ width: 200, minWidth: 200 }}>Sell Price</th>
              <th style={{ width: 200, minWidth: 200 }}>New Total Cost</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {form.values.inventory_products.length > 0 ? (
              form.values.inventory_products?.map((product, productIndex) => {
                return (
                  <SearchAbleTableRow
                    updateTotalCost={updateTotalCost}
                    product={product}
                    key={product.key}
                    form={form}
                    productIndex={productIndex}
                  />
                );
              })
            ) : (
              <tr>
                <td align="center" colSpan={6}>
                  Add an Item
                </td>
              </tr>
            )}
          </tbody>
        </Table>

        <Box maw={"30rem"} mx={"auto"} w={"70%"}>
          <SimpleGrid cols={2}>
            <Button disabled={submitting} type="submit">
              Save
            </Button>
            <Button
              variant={"danger"}
              disabled={submitting}
              type="button"
              onClick={() => {
                const confirmed = window.confirm("Are you sure ?");
                if (confirmed) {
                  form.reset();
                }
              }}
            >
              Reset
            </Button>
          </SimpleGrid>
        </Box>
      </Stack>
    </form>
  );
};

type SearchAbleTableRow = {
  updateTotalCost: ({
    idx,
    buyingPrice,
    count,
    totalCost,
  }: {
    idx: number;
    buyingPrice?: number | string;
    count?: number | string;
    totalCost?: number | string;
  }) => void;
  product: {
    product_sku: string;
    stock_count: number;
  };
  productIndex: number;
  form: UseFormReturnType<InventoryFormType>;
};
const SearchAbleTableRow = ({
  updateTotalCost,
  form,
  productIndex,
}: SearchAbleTableRow) => {
  const { products, handleSearchInputChange, searchQuery } =
    useProductSearchByNameSkuId();

  const selectProductsData = useMemo(() => {
    return products
      ? products.map((p) => ({ label: p.name || "", value: p.sku || "" }))
      : [];
  }, [products]);

  const formSku = form.values.inventory_products[productIndex].product_sku;
  const selectedProduct = useMemo(() => {
    return products.find((product) => product?.sku === formSku);
  }, [products, formSku]);

  const productFrom = form.values.inventory_products[productIndex];
  return (
    <tr>
      <td>
        <Select
          {...form.getInputProps(
            `inventory_products.${productIndex}.product_sku`
          )}
          nothingFound="No products"
          placeholder="Type sku,name,or id to search product"
          searchValue={searchQuery}
          onSearchChange={handleSearchInputChange}
          data={selectProductsData}
        ></Select>
      </td>
      <td>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text>Current :</Text> <Text>{selectedProduct?.stock_count}</Text>
          <Text>New :</Text>{" "}
          <NumberInput
            min={1}
            {...form.getInputProps(
              `inventory_products.${productIndex}.stock_count`
            )}
            onChange={(evt) => {
              form.setFieldValue(
                `inventory_products.${productIndex}.stock_count`,
                evt ? evt : 0
              );
            }}
            onInput={(evt) => {
              updateTotalCost({
                idx: productIndex,
                count: Number(
                  evt.currentTarget.valueAsNumber
                    ? evt.currentTarget.valueAsNumber
                    : 0
                ),
              });
            }}
          />
        </Box>
      </td>
      <td>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text>Current :</Text>{" "}
          <Text>{selectedProduct?.price?.buying_price}৳</Text>
          <Text>New :</Text>{" "}
          <NumberInput
            precision={2}
            step={0.01}
            placeholder="Update if needed"
            min={0}
            {...form.getInputProps(
              `inventory_products.${productIndex}.new_buying_price`
            )}
            onChange={(evt) => {
              form.setFieldValue(
                `inventory_products.${productIndex}.new_buying_price`,
                evt ? evt : 0
              );
            }}
            onInput={(evt) => {
              updateTotalCost({
                idx: productIndex,
                buyingPrice: Number(
                  evt.currentTarget.valueAsNumber
                    ? evt.currentTarget.valueAsNumber
                    : 0
                ),
              });
            }}
          />
        </Box>
      </td>
      <td>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "auto 1fr",
            alignItems: "center",
            gap: 5,
          }}
        >
          <Text>Current :</Text>{" "}
          <Text>{selectedProduct?.price?.selling_price}৳</Text>
          <Text>New :</Text>{" "}
          <NumberInput
            precision={2}
            step={0.01}
            min={0}
            placeholder="Update if needed"
            {...form.getInputProps(
              `inventory_products.${productIndex}.new_selling_price`
            )}
            onChange={(evt) => {
              form.setFieldValue(
                `inventory_products.${productIndex}.new_selling_price`,
                evt ? evt : 0
              );
            }}
          />
        </Box>
      </td>
      <td>
        {/* <NumberInput
          precision={2}
          step={0.01}
          placeholder="Update if needed"
          min={0}
          {...form.getInputProps(
            `inventory_products.${productIndex}.new_total_cost`
          )}
          onChange={(evt) => {
            form.setFieldValue(
              `inventory_products.${productIndex}.new_total_cost`,
              evt ? evt : 0
            );
          }}
          onInput={(evt) => {
            updateTotalCost({
              idx: productIndex,
              totalCost: Number(evt.currentTarget.valueAsNumber),
            });
          }}
        ></NumberInput> */}
        <Box sx={{ textAlign: "center" }}>
          {productFrom.stock_count * productFrom.new_buying_price}
        </Box>
      </td>
      <td>
        <Button
          disabled={form.values.inventory_products.length <= 1}
          onClick={() => {
            form.removeListItem("inventory_products", productIndex);
          }}
          compact
          size="xs"
          variant="danger"
        >
          Remove
        </Button>
      </td>
    </tr>
  );
};

export default CreateInventoryPage;
