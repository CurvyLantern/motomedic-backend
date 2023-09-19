import BaseInputs from "@/components/inputs/BaseInputs";
import axiosClient from "@/lib/axios";
import { Button, Table } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";
import CreateInvoicePage, { CreateInvoiceForm } from "./CreateInvoicePage";

const url = "api/v1/invoice";
const AllInvoicePage = () => {
    const { data: invoices } = useQuery({
        queryFn: () => {
            return axiosClient.v1.api.get(url).then((res) => res.data.data);
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
        modals.open({
            styles(theme, params, context) {
                return {
                    title: {
                        fontWeight: 600,
                    },
                };
            },
            title: "Please confirm your action",
            children: <CreateInvoiceForm />,
            //   labels: { confirm: "Confirm", cancel: "Cancel" },
            //   onCancel: () => console.log("Cancel"),
            //   onConfirm: () => console.log("Confirmed"),
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


export default AllInvoicePage;
