import CrudOptions, {
  CrudDeleteButton,
  CrudEditButton,
} from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  invalidateMechanicQuery,
  useMechanicQuery,
} from "@/queries/mechanicQuery";
import {
  Box,
  Button,
  Flex,
  Group,
  Modal,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { z } from "zod";

const mechanicFormValidationSchema = z.object({
  name: z.string(),
  phone: z.string(),
  email: z.string(),
  address: z.string().nullable(),
  status: z.string(),
});

type FormType = z.infer<typeof mechanicFormValidationSchema>;
const MechanicPage = () => {
  const form = useCustomForm<FormType>({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      status: "idle",
    },
    validate: zodResolver(mechanicFormValidationSchema),
  });
  const [updateMechanicId, setUpdateMechanicId] = useState("");

  const mechanics = useMechanicQuery();
  console.log({ mechanics }, "from mechanics");
  const mechanicsArr =
    mechanics && Array.isArray(mechanics.data) ? mechanics.data : [];
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
    } catch (error) {
      notifications.show({
        // @ts-expect-error error message
        message: error.data.message,
        color: "red",
      });
      console.error(error);
    } finally {
      invalidateMechanicQuery();
    }
  };

  console.log(mechanics, "mechanics");

  const tRows = mechanicsArr.map((mechanic, mechanicIdx) => {
    return (
      <tr key={mechanic.id}>
        <td>{mechanicIdx + 1}</td>
        <td>{mechanic.name}</td>
        <td>{mechanic.phone}</td>
        <td>{mechanic.email}</td>
        <td>{mechanic.address}</td>
        <td>{mechanic.status}</td>
        <td>
          <CrudOptions
            onView={() => {}}
            onEdit={() => {
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
            onDelete={() => {}}
          />
        </td>
      </tr>
    );
  });
  return (
    <BasicSection
      title="Mechanics"
      headerRightElement={<Button onClick={openModal}>Add Mechanic</Button>}
    >
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
              clearable={false}
              searchable={false}
              allowDeselect={false}
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
      <Text>Total Mechanics {mechanicsArr.length}</Text>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>SL</th>
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
    </BasicSection>
  );
};

export default MechanicPage;
