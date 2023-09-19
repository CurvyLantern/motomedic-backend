import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { Button, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { z } from "zod";

type InvoiceFields = {
  invoice_id: string;
  seller_id: string;
  cost: number;
  due: number;
};
const url = "api/v1/invoice";
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
export const CreateInvoiceForm: React.FC<CreateInvoiceFormType> = () => {
    const form = useForm<InvoiceFields>({
        initialValues: {
            cost: 0,
            due: 0,
            invoice_id: "",
            seller_id: "",
        },
        validate: zodResolver(
            z.object({
                cost: z
                    .number()
                    .positive({ message: "cost can not be negative" }),
                due: z
                    .number()
                    .positive({ message: "due can not be negative" }),
                invoice_id: z
                    .string()
                    .min(1, { message: "invoice id can not be empty" }),
                seller_id: z
                    .string()
                    .min(1, { message: "seller id can not be empty" }),
            })
        ),
    });
    const onSubmit = async (values: InvoiceFields) => {
        const data = await axiosClient.v1.api
            .post(url, values)
            .then((res) => res.data);
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
            <Stack>
                <BaseInputs
                    field={{
                        type: "text",
                        label: "Invoice Id",
                        name: "invoice_id",
                    }}
                    form={form}
                ></BaseInputs>
                <BaseInputs
                    field={{
                        type: "text",
                        label: "Seller Id",
                        name: "seller_id",
                    }}
                    form={form}
                ></BaseInputs>
                <BaseInputs
                    field={{ type: "number", label: "Cost", name: "cost" }}
                    form={form}
                ></BaseInputs>
                <BaseInputs
                    field={{ type: "number", label: "Due", name: "due" }}
                    form={form}
                ></BaseInputs>

                <Button type="submit">Save</Button>
            </Stack>
        </form>
    );
};

export default CreateInvoicePage;
