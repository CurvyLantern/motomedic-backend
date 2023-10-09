import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  invalidateMechanicQuery,
  useMechanicQuery,
} from "@/queries/mechanicQuery";
import { useSellersQuery } from "@/queries/sellersQuery";
import {
  Box,
  Button,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Textarea,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

const SellersPage = () => {
  const form = useCustomForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
    },
    validate: zodResolver(
      z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        address: z.string(),
      })
    ),
  });
  const [updateSellerId, setUpdateSellerId] = useState("");

  const sellers = useSellersQuery();
  console.log({ sellers }, "from sellers");
  const isArr = sellers && Array.isArray(sellers.data);
  const [modalOpened, { close: closeModal, open: openModal }] =
    useDisclosure(false);

  const onFormSubmit = async (values: typeof form.values) => {
    try {
      if (!updateSellerId) {
        const serverData = await axiosClient.v1.api
          .post("sellers", values)
          .then((res) => res.data);

        notifications.show({
          message: "Seller added successfully",
          color: "green",
        });
      } else {
        const serverData = await axiosClient.v1.api
          .put(`sellers/${updateSellerId}`, values)
          .then((res) => res.data);

        notifications.show({
          message: "seller Updated successfully",
          color: "green",
        });
      }
      setUpdateSellerId("");
      form.reset();
      closeModal();
      invalidateMechanicQuery();
    } catch (error) {
      notifications.show({
        message: error.data.message,
        color: "red",
      });
      console.error(error);
    }
  };

  console.log(sellers, "sellers");

  const tRows = isArr
    ? sellers.data.map((seller) => {
        return (
          <tr key={seller.id}>
            <td>{seller.id}</td>
            <td>{seller.name}</td>
            <td>{seller.phone}</td>
            <td>{seller.email}</td>
            <td>{seller.address}</td>
            <td>
              <Button
                compact
                size="xs"
                onClick={() => {
                  form.reset();
                  form.setValues({
                    name: seller.name,
                    phone: seller.phone,
                    email: seller.email,
                    address: seller.address,
                  });

                  openModal();
                  setUpdateSellerId(seller.id);
                }}
              >
                Update
              </Button>
            </td>
          </tr>
        );
      })
    : [];
  return (
    <Box>
      <Stack>
        <Modal
          centered
          opened={modalOpened}
          onClose={closeModal}
          title="Add New Seller"
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
        <Group position="right">
          <Button onClick={openModal}>Add Seller</Button>
        </Group>
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
      </Stack>
    </Box>
  );
};

export default SellersPage;
