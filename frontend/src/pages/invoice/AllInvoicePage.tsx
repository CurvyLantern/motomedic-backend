import BaseInputs from "@/components/inputs/BaseInputs";
import axiosClient from "@/lib/axios";
import { Button, Table } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import CreateInvoicePage from "./CreateInvoicePage";

const url = "api/v1/invoice";
const AllInvoicePage = () => {
  const { data: invoices } = useQuery({
    queryFn: () => {
      return axiosClient.get(url).then((res) => res.data.data);
    },
    queryKey: ["get/invoice"],
  });

  const isArr = Array.isArray(invoices);
  const tRows = isArr
    ? invoices.map((invoice) => {
        return (
          <tr key={invoice.id}>
            <td>{invoice.invoice_id}</td>
            <td>{invoice.seller_id}</td>
            <td>{invoice.cost}</td>
            <td>{invoice.due}</td>
            <td>Actions</td>
          </tr>
        );
      })
    : [];

  const onCreate = () => {
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <CreateInvoicePage />,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      onCancel: () => console.log("Cancel"),
      onConfirm: () => console.log("Confirmed"),
    });
  };

  return (
    <div>
      <Button onClick={onCreate}>Create</Button>
      <Table>
        <thead>
          <tr>
            <th>Invoice_id</th>
            <th>Seller_id</th>
            <th>Cost</th>
            <th>Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{tRows}</tbody>
      </Table>
    </div>
  );
};
type InvoiceFields = {
  invoice_id: string;
  seller_id: string;
  cost: number;
  due: number;
};
const CreateInvoiceRow = () => {
  const form = useForm<InvoiceFields>({
    initialValues: {
      cost: 0,
      due: 0,
      invoice_id: "",
      seller_id: "",
    },
    validate: zodResolver(
      z.object({
        cost: z.number().positive({ message: "cost can not be negative" }),
        due: z.number().positive({ message: "due can not be negative" }),
        invoice_id: z
          .string()
          .min(1, { message: "invoice id can not be empty" }),
        seller_id: z.string().min(1, { message: "seller id can not be empty" }),
      })
    ),
  });
  const onSubmit = async (values: InvoiceFields) => {
    const data = await axiosClient.post(url, values).then((res) => res.data);
    notifications.show({
      title: "Created Invoice",
      message: "",
      color: "green",
    });
    console.log({ data });
    return data;
  };
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <td>
        <BaseInputs
          field={{ type: "text", label: "Invoice Id", name: "invoice_id" }}
          form={form}
        />
      </td>
      <td>
        <BaseInputs
          field={{ type: "text", label: "Seller Id", name: "seller_id" }}
          form={form}
        />
      </td>
      <td>
        <BaseInputs
          field={{ type: "number", label: "Cost", name: "cost" }}
          form={form}></BaseInputs>
      </td>
      <td>
        <BaseInputs
          field={{ type: "number", label: "Due", name: "due" }}
          form={form}></BaseInputs>
      </td>
      <td>Actions</td>
    </form>
  );
};

export default AllInvoicePage;
