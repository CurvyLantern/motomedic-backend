import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  Button,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
} from "@mantine/core";
import { UseFormReturnType, useForm, zodResolver } from "@mantine/form";
import { useDebouncedState, useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useState } from "react";
import { z } from "zod";

type InvoiceFields = {
  invoice_id: string;
  seller_id: string;
  cost: number;
  due: number;
};
const url = "invoices";
const CreateInvoicePage = () => {
  return (
    <div>
      <BasicSection title="Create an invoice ">
        <CreateInvoiceForm />
      </BasicSection>
    </div>
  );
};

type CreateInvoiceFormType = unknown;
type FormType = {
  invoice_total_cost: number;
  invoice_total_due: number;
  invoice_paper_id: string;
  invoice_seller_id: string;
  type: "selling" | "buying";
  invoice_products: {
    product_sku: string;
    stock_count: number;
  }[];
};
export const CreateInvoiceForm: React.FC<CreateInvoiceFormType> = () => {
  const form = useCustomForm<FormType>({
    initialValues: {
      invoice_total_cost: 0,
      invoice_total_due: 0,
      invoice_paper_id: "",
      invoice_seller_id: "",
      invoice_products: [{ product_sku: "", stock_count: 0 }],
      type: "buying",
    },
    validate: zodResolver(
      z.object({
        type: z.enum(["buying", "selling"], {
          invalid_type_error: "Invoice type error",
        }),
        invoice_products: z
          .object({
            product_sku: z.string().min(1, "product id is not valid"),
            stock_count: z.number().default(0),
          })
          .array(),
        invoice_total_cost: z
          .number()
          .nonnegative({ message: "cost can not be negative" }),
        invoice_total_due: z
          .number()
          .nonnegative({ message: "due can not be negative" }),
        invoice_paper_id: z
          .string()
          .min(1, { message: "invoice id can not be empty" }),
        invoice_seller_id: z
          .string()
          .min(1, { message: "vendor id can not be empty" }),
      })
    ),
  });
  const [submitting, setSubmitting] = useState(false);
  const onSubmit = (values: typeof form.values) => {
    console.log(values, " on submit ");
    setSubmitting(true);
    axiosClient.v1.api
      .post(url, values)
      .then((res) => {
        const data = res.data;

        notifications.show({
          title: "Created Invoice",
          message: "",
          color: "green",
        });
        console.log({ data });
        return data;
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setSubmitting(false);
      });

    // return data;
  };

  const addInvoiceProduct = () => {
    form.insertListItem("invoice_products", {
      product_sku: "",
      stock_count: 0,
    });
  };
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <SimpleGrid cols={4}>
          <BaseInputs
            field={{
              type: "text",
              label: "Invoice Id",
              name: "invoice_paper_id",
            }}
            form={form}
          ></BaseInputs>
          <BaseInputs
            field={{
              type: "text",
              label: "Vendor Id",
              name: "invoice_seller_id",
            }}
            form={form}
          ></BaseInputs>
          <BaseInputs
            field={{
              type: "number",
              label: "Cost",
              name: "invoice_total_cost",
            }}
            form={form}
          ></BaseInputs>
          <BaseInputs
            field={{
              type: "number",
              label: "Due",
              name: "invoice_total_due",
            }}
            form={form}
          ></BaseInputs>
        </SimpleGrid>

        <Button type="button" onClick={addInvoiceProduct}>
          Update Invoice Products
        </Button>

        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th style={{ width: "50%" }}>Product</th>
              <th>New Stock Count</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {form.values.invoice_products?.map((product, productIndex) => {
              return (
                <SearchAbleTableRow
                  product={product}
                  key={productIndex}
                  form={form}
                  productIndex={productIndex}
                />
              );
            })}
          </tbody>
        </Table>

        <Button disabled={submitting} type="submit">
          Save
        </Button>
      </Stack>
    </form>
  );
};

type SearchAbleTableRow = {
  product: {
    product_sku: string;
    stock_count: number;
  };
  productIndex: number;
  form: UseFormReturnType<FormType>;
};
const SearchAbleTableRow = ({
  product,
  form,
  productIndex,
}: SearchAbleTableRow) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebouncedState(
    searchQuery,
    500
  );
  const [productData, setProductData] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    setDebouncedSearchQuery(searchQuery);
  }, [searchQuery, setDebouncedSearchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery) {
      const controller = new AbortController();
      axiosClient.v1.api
        .post(
          `products/search`,
          { query: debouncedSearchQuery },
          { signal: controller.signal }
        )
        .then((res) => {
          const data = res.data;

          const dataModifiedForSelectInput = Array.isArray(data)
            ? data.map((d) => ({
                label: d.name,
                value: d.sku,
              }))
            : [];

          setProductData(dataModifiedForSelectInput);

          return data;
        })
        .catch((err) => console.error(err));
      console.log("hello");

      return () => {
        controller.abort();
      };
    } else {
      setProductData([]);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    console.log({ productData, productIndex }, "product Data");
  }, [productData]);
  return (
    <tr>
      <td>
        <Select
          {...form.getInputProps(
            `invoice_products.${productIndex}.product_sku`
          )}
          nothingFound="No products"
          placeholder="Type sku,name,or id to search product"
          searchable
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          data={productData}
          filter={(value, item) => {
            console.log({ value, item });
            return true;
          }}
        ></Select>
      </td>
      <td>
        <NumberInput
          {...form.getInputProps(
            `invoice_products.${productIndex}.stock_count`
          )}
        ></NumberInput>
      </td>
      <td>
        <Button
          onClick={() => {
            form.removeListItem("invoice_products", productIndex);
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

export default CreateInvoicePage;
