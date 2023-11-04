import CrudOptions from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";

import {
  useVendorsQuery,
  invalidateVendorsQuery,
} from "@/queries/vendorsQuery";
import {
  Box,
  Button,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Textarea,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";

const validation = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string(),
});
type FormValue = z.infer<typeof validation>;
const SellersPage = () => {
  const form = useCustomForm<FormValue>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    validate: zodResolver(validation),
  });
  const [updateVendorId, setUpdateVendorId] = useState("");

  const vendors = useVendorsQuery();
  console.log({ vendors }, "from vendors");
  const isArr = vendors && Array.isArray(vendors.data);
  const [modalOpened, { close: closeModal, open: openModal }] =
    useDisclosure(false);

  const onFormSubmit = async (values: typeof form.values) => {
    try {
      if (!updateVendorId) {
        const serverData = await axiosClient.v1.api
          .post("vendors", values)
          .then((res) => res.data);

        notifications.show({
          message: "Vendor added successfully",
          color: "green",
        });
      } else {
        const serverData = await axiosClient.v1.api
          .put(`vendors/${updateVendorId}`, values)
          .then((res) => res.data);

        notifications.show({
          message: "vendor Updated successfully",
          color: "green",
        });
      }
      setUpdateVendorId("");
      form.reset();
      closeModal();
      invalidateVendorsQuery();
    } catch (error) {
      notifications.show({
        // @ts-expect-error stupid
        message: error.data.message,
        color: "red",
      });
      console.error(error);
    }
  };

  console.log(vendors, "vendors");

  const tRows = isArr
    ? vendors.data.map((vendor) => {
        return (
          <tr key={vendor.id}>
            <td>{vendor.id}</td>
            <td>{vendor.name}</td>
            <td>{vendor.phone}</td>
            <td>{vendor.email}</td>
            <td>{vendor.address}</td>
            <td>
              <CrudOptions
                onView={() => {}}
                onDelete={() => {}}
                onEdit={() => {
                  form.reset();
                  form.setValues({
                    name: vendor.name,
                    phone: vendor.phone,
                    email: vendor.email,
                    address: vendor.address,
                  });

                  openModal();
                  setUpdateVendorId(vendor.id);
                }}
              />
            </td>
          </tr>
        );
      })
    : [];
  return (
    <BasicSection
      headerRightElement={<Button onClick={openModal}>Add Vendor</Button>}
    >
      <Modal
        centered
        opened={modalOpened}
        onClose={closeModal}
        title="Add New Vendor"
      >
        <form onSubmit={form.onSubmit(onFormSubmit)}>
          <Stack>
            <TextInput label="Name" {...form.getInputProps("name")} />
            <TextInput label="Phone" {...form.getInputProps("phone")} />
            <TextInput
              label="Email"
              type="email"
              {...form.getInputProps("email")}
            />
            <Textarea label="Address" {...form.getInputProps("address")} />

            <SimpleGrid cols={2}>
              <Button type="submit">Save</Button>
              <Button
                type="button"
                variant="danger"
                onClick={() => {
                  form.reset();
                  closeModal();
                }}
              >
                Cancel
              </Button>
            </SimpleGrid>
          </Stack>
        </form>
      </Modal>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{tRows}</tbody>
      </Table>
    </BasicSection>
  );
};

export default SellersPage;
