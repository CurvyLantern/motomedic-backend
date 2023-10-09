import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  invalidateMechanicQuery,
  useMechanicQuery,
} from "@/queries/mechanicQuery";
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

const MechanicPage = () => {
  const form = useCustomForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "idle",
    },
    validate: zodResolver(
      z.object({
        name: z.string(),
        phone: z.string(),
        email: z.string(),
        address: z.string(),
        status: z.string(),
      })
    ),
  });
  const [updateMechanicId, setUpdateMechanicId] = useState("");

  const mechanics = useMechanicQuery();
  console.log({ mechanics }, "from mechanics");
  const isArr = mechanics && Array.isArray(mechanics.data);
  const [modalOpened, { close: closeModal, open: openModal }] =
    useDisclosure(false);

  const onFormSubmit = async (values: typeof form.values) => {
    try {
      if (!updateMechanicId) {
        const serverData = await axiosClient.v1.api
          .post("mechanics", values)
          .then((res) => res.data);

        notifications.show({
          message: "Mechanic added successfully",
          color: "green",
        });
      } else {
        const serverData = await axiosClient.v1.api
          .put(`mechanics/${updateMechanicId}`, values)
          .then((res) => res.data);

        notifications.show({
          message: "Mechanic Updated successfully",
          color: "green",
        });
      }
      setUpdateMechanicId("");
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

  console.log(mechanics, "mechanics");

  const tRows = isArr
    ? mechanics.data.map((mechanic) => {
        return (
          <tr key={mechanic.id}>
            <td>{mechanic.id}</td>
            <td>{mechanic.name}</td>
            <td>{mechanic.phone}</td>
            <td>{mechanic.email}</td>
            <td>{mechanic.address}</td>
            <td>{mechanic.status}</td>
            <td>
              <Button
                compact
                size="xs"
                onClick={() => {
                  form.reset();
                  form.setValues({
                    name: mechanic.name,
                    phone: mechanic.phone,
                    email: mechanic.email,
                    address: mechanic.address,
                    status: mechanic.status,
                  });

                  openModal();
                  setUpdateMechanicId(mechanic.id);
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
          title="Add New Mechanic"
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
              <Select
                {...form.getInputProps("status")}
                data={[
                  { label: "Idle", value: "idle" },
                  { label: "Busy", value: "busy" },
                ]}
              />

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
          <Button onClick={openModal}>Add Mechanic</Button>
        </Group>
        <Table withBorder withColumnBorders>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{tRows}</tbody>
        </Table>
      </Stack>
    </Box>
  );
};

export default MechanicPage;
