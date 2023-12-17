import { CrudDeleteButton } from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import { useProductSearchByNameSkuId } from "@/hooks/useProductSearch";
import axiosClient from "@/lib/axios";
import { useUserQuery } from "@/queries/userQuery";
import { useVendorsQuery } from "@/queries/vendorsQuery";
import notAvailableFormatter from "@/utils/notAvailableFormatter";
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Select,
  SelectItem,
  SimpleGrid,
  Stack,
  Table,
  Text,
  rem,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { UseFormReturnType, zodResolver } from "@mantine/form";
import { randomId } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useState } from "react";
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
    <CreateInventoryForm />
    // <div>
    //   {/* <BasicSection title="Add To inventory "> */}
    //   {/* </BasicSection> */}
    // {/* </div> */}
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
  inventory_vendor_id: z.string().min(1, "Vendor is required"),
  inventory_products: z
    .object({
      key: z.string(),
      inventory_updater_id: z.string(),
      // inventory_vendor_id: z
      //   .string()
      //   .min(1, { message: "vendor id can not be empty" }),
      type: z.enum(["store_in", "store_out"]),
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
});

type InventoryFormType = z.infer<typeof inventoryFormValidationSchema>;
export const CreateInventoryForm = () => {
  const user = useUserQuery();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const form = useCustomForm<InventoryFormType>({
    initialValues: {
      inventory_vendor_id: "",
      inventory_products: [
        // {
        //   inventory_updater_id: user?.id.toString() ?? "",
        //   inventory_vendor_id: "",
        //   product_sku: "",
        //   stock_count: 0,
        //   new_selling_price: 0,
        //   new_buying_price: 0,
        //   key: randomId(),
        //   type: "store_in",
        // },
      ],
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

    const withDate = {
      ...values,
      inventory_date: selectedDate,
    };
    axiosClient.v1.api
      .post(url, withDate)
      .then((res) => {
        const data = res.data;

        notifications.show({
          title: "Added to inventory",
          message: "",
          color: "green",
        });
        form.reset();
        setSelectedDate(null);
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
    form.insertListItem(
      "inventory_products",
      {
        inventory_updater_id: user?.id.toString() ?? "",
        // inventory_vendor_id: "",
        product_sku: "",
        stock_count: 0,
        new_selling_price: 0,
        new_buying_price: 0,
        key: randomId(),
        type: "store_in",
      },
      0
    );
  };

  const totalBuyingAmount = useMemo(() => {
    const p = form.values.inventory_products;
    return p.reduce((acc, item) => {
      acc += Number(item.new_buying_price);
      return acc;
    }, 0);
  }, [form.values.inventory_products]);

  return (
    <BasicSection
      title="Add to inventory"
      headerRightElement={
        <Button
          sx={{ alignSelf: "flex-end" }}
          type="button"
          onClick={addInvoiceProduct}
        >
          Add Item
        </Button>
      }
    >
      <form onSubmit={form.onSubmit(onFormSubmit)}>
        <Group
          align="flex-end"
          sx={{
            position: "sticky",
            top: 0,
            backgroundColor: "white",
            zIndex: 99,
            paddingBottom: rem(20),
            boxShadow: "0px 5px 5px rgb(0,0,0,.04)",
          }}
        >
          <Select
            required
            // withAsterisk
            label="Select Vendor"
            {...form.getInputProps("inventory_vendor_id")}
            data={vendorsSelectData}
          />

          <DatePickerInput
            required
            label="Select Date"
            placeholder="Pick a date"
            value={selectedDate}
            onChange={(date) => {
              setSelectedDate(date);
            }}
            w={200}
          />

          <Text fz={12} fw={500}>
            Total Buying amount : {totalBuyingAmount}৳
          </Text>

          <Button
            sx={{ marginLeft: "auto" }}
            disabled={submitting || form.values.inventory_products.length <= 0}
            type="submit"
          >
            Save
          </Button>
          <Button
            variant={"danger"}
            disabled={submitting || form.values.inventory_products.length <= 0}
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
          {/*
            <NumberInput
              label="Total Cost"
              {...form.getInputProps("inventory_total_cost")}
              min={0}
            />
            <NumberInput
              label="Total Due"
              {...form.getInputProps("inventory_total_due")}
              min={0}
            /> */}
          {/* <Button
              sx={{ alignSelf: "flex-end" }}
              type="button"
              onClick={addInvoiceProduct}
            >
              Add Item
            </Button> */}
        </Group>
        <Table
          sx={{
            // tableLayout: "fixed",
            "thead tr th": {
              textAlign: "center",
              fontSize: rem(10),
              padding: rem(5),
            },
          }}
          withColumnBorders
          withBorder
        >
          <thead>
            <tr>
              <th rowSpan={3} style={{ width: 70 }}>
                SL
              </th>
              <th
                rowSpan={3}
                style={{
                  width: 400,
                }}
              >
                Product
              </th>
              <th colSpan={2} rowSpan={2}>
                Stock
              </th>
              <th colSpan={4}>Price</th>
              <th
                rowSpan={3}
                style={{
                  width: 100,
                }}
              >
                Action
              </th>
            </tr>
            <tr>
              <th colSpan={2}>Buying</th>
              <th colSpan={2}>Selling</th>
            </tr>
            <tr>
              <th style={{}}>Current</th>
              <th style={{}}>New</th>
              <th style={{}}>Current</th>
              <th style={{}}>New</th>
              <th style={{}}>Current</th>
              <th style={{}}>New</th>
            </tr>
          </thead>
          <tbody>
            {form.values.inventory_products.length > 0 ? (
              form.values.inventory_products?.map((product, productIndex) => {
                return (
                  <SearchAbleTableRowV2
                    vendorsSelectData={vendorsSelectData}
                    key={product.key}
                    form={form}
                    productIndex={productIndex}
                  />
                );
              })
            ) : (
              <tr>
                <td align="center" colSpan={9}>
                  Add an Item
                </td>
              </tr>
            )}
          </tbody>
        </Table>
        {/* <Table withColumnBorders withBorder>
            <thead>
              <tr>
                <th
                  style={{ textAlign: "center", width: "20px", maxWidth: "2%" }}
                >
                  SL
                </th>
                <th>Vendor & Product</th>
                <th>Stock</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {form.values.inventory_products.length > 0 ? (
                form.values.inventory_products?.map((product, productIndex) => {
                  return (
                    <SearchAbleTableRow
                      vendorsSelectData={vendorsSelectData}
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
          </Table> */}
      </form>
    </BasicSection>
  );
};

type TSearchAbleTableRow = {
  vendorsSelectData: SelectItem[];
  productIndex: number;
  form: UseFormReturnType<InventoryFormType>;
};

type TSearchAbleTableRowV2 = {
  vendorsSelectData: SelectItem[];
  productIndex: number;
  form: UseFormReturnType<InventoryFormType>;
};
const SearchAbleTableRowV2 = ({
  form,
  productIndex,
  vendorsSelectData,
}: TSearchAbleTableRowV2) => {
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

  const SL = form.values.inventory_products.length - productIndex;
  return (
    <tr>
      <td>{SL}</td>
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
        />
      </td>
      <td>
        <Text>{notAvailableFormatter(selectedProduct?.stock_count)}</Text>
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
          />
        </Box>
      </td>
      <td>
        <Text>
          {notAvailableFormatter(selectedProduct?.price?.buying_price, "৳")}
        </Text>
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
        />
      </td>
      <td>
        <Text>
          {notAvailableFormatter(selectedProduct?.price?.selling_price, "৳")}
        </Text>
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
        />
      </td>

      {/* <td>

        <Box sx={{ textAlign: "center" }}>
          {productFrom.stock_count * productFrom.new_buying_price}
        </Box>
      </td> */}
      {/* disabled={form.values.inventory_products.length <= 1} */}
      <Box component={"td"} align="center">
        <CrudDeleteButton
          onDelete={() => {
            form.removeListItem("inventory_products", productIndex);
          }}
        />
        {/* <Button
          onClick={() => {
            form.removeListItem("inventory_products", productIndex);
          }}
          compact
          size="xs"
          variant="danger"
        >
          Remove
        </Button> */}
      </Box>
    </tr>
  );
};
export default CreateInventoryPage;
