import BaseInputs from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import { useProductSearchByNameSkuId } from "@/hooks/useProductSearch";
import axiosClient from "@/lib/axios";
import { useSellersQuery } from "@/queries/sellersQuery";
import {
  Box,
  Button,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
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
        <CreateInvoiceForm />
      </BasicSection>
    </div>
  );
};

type CreateInvoiceFormType = unknown;
type FormType = {
  inventory_total_cost: number;
  inventory_total_due: number;
  inventory_seller_id: string;
  type: "buying";
  inventory_products: {
    product_sku: string;
    stock_count: number;
    new_selling_price: number;
    new_buying_price: number;
    new_total_cost: number;
    key: string;
  }[];
};
export const CreateInvoiceForm: React.FC<CreateInvoiceFormType> = () => {
  const form = useCustomForm<FormType>({
    initialValues: {
      inventory_total_cost: 0,
      inventory_total_due: 0,
      inventory_seller_id: "",
      inventory_products: [
        {
          product_sku: "",
          stock_count: 1,
          new_total_cost: 0,
          new_buying_price: 0,
          new_selling_price: 0,
          key: randomId(),
        },
      ],
      type: "buying",
    },
    validate: zodResolver(
      z.object({
        inventory_products: z
          .object({
            product_sku: z.string().min(1, "product id is not valid"),
            stock_count: z.number().nonnegative().min(1).default(1),
            new_selling_price: z
              .number()

              .nonnegative({ message: "Cannot be negative" })
              .default(0),
            new_buying_price: z
              .number()
              .nonnegative({ message: "Cannot be negative" })
              .default(0),
            new_total_cost: z
              .number()
              .nonnegative({ message: "Cannot be negative" })
              .default(0),
          })
          .array(),
        inventory_total_cost: z
          .number()
          .nonnegative({ message: "cost can not be negative" }),

        inventory_total_due: z
          .number()
          .nonnegative({ message: "due can not be negative" }),

        inventory_seller_id: z
          .string()
          .min(1, { message: "seller id can not be empty" }),
      })
    ),
  });
  const [submitting, setSubmitting] = useState(false);
  const sellers = useSellersQuery();
  const sellersFromServer = useMemo(() => {
    return sellers && Array.isArray(sellers.data)
      ? sellers.data.map((s) => ({ label: s.name, value: String(s.id) }))
      : [];
  }, [sellers]);

  const onSubmit = (values: typeof form.values) => {
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
      .catch((error) => console.error(error))
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
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <SimpleGrid cols={4}>
          <Select
            label="Seller Id"
            {...form.getInputProps("inventory_seller_id")}
            data={sellersFromServer}
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
              <th style={{ width: "40%" }}>Product</th>
              <th>New Stock Count</th>
              <th>New Selling Price</th>
              <th>New Buying Price</th>
              <th>New Total Cost</th>
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
  form: UseFormReturnType<FormType>;
};
const SearchAbleTableRow = ({
  updateTotalCost,
  form,
  productIndex,
}: SearchAbleTableRow) => {
  const { products, handleSearchInputChange, searchQuery } =
    useProductSearchByNameSkuId();

  const filteredDataForSelect = useMemo(() => {
    return products
      .filter((item) => {
        for (let i = 0; i < productIndex; i++) {
          const invP = form.values.inventory_products[i];
          if (invP.product_sku === item.sku) {
            return false;
          }
        }
        return true;
      })
      .map((p) => ({ label: p.name, value: p.sku }));
  }, [products, form.values.inventory_products, productIndex]);

  return (
    <tr>
      <td>
        <Select
          {...form.getInputProps(
            `inventory_products.${productIndex}.product_sku`
          )}
          nothingFound="No products"
          placeholder="Type sku,name,or id to search product"
          searchable
          searchValue={searchQuery}
          onSearchChange={handleSearchInputChange}
          data={filteredDataForSelect}
          filter={(searchValue, item) => {
            console.log({ searchValue, item });

            return true;
          }}
        ></Select>
      </td>
      <td>
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
        ></NumberInput>
      </td>
      <td>
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
        ></NumberInput>
      </td>
      <td>
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
        ></NumberInput>
      </td>
      <td>
        <NumberInput
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
        ></NumberInput>
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
