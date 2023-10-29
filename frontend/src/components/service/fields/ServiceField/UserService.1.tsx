import BasicSection from "@/components/sections/BasicSection";
import { useAppSelector } from "@/hooks/storeConnectors";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useMechanicQuery } from "@/queries/mechanicQuery";
import {
  Button,
  Modal,
  ScrollArea,
  Select,
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
import { serviceData } from "../fields";

export const UserService = () => {
  const serviceTypes = useAppSelector((state) => state.service.serviceTypes);
  const [myServiceTypes, setMyServiceTypes] = useState([]);
  const [problemDetails, setProblemDetails] = useState("");
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const mechanics = useMechanicQuery();
  const isArr = mechanics && Array.isArray(mechanics.data);
  const [assignedMechanics, setAssignedMechanics] = useState<
    (typeof mechanics)[number][]
  >([]);

  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);
  const form = useCustomForm({
    initialValues: {
      name: "",
      service_type_id: "",
      problem_details: "",
      mechanic_id: "",
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, "Service name required"),
        service_type_id: z.string().min(1, "service type is needed"),
        problem_details: z.string().min(1, "Problem details is needed"),
        mechanic_id: z.string().min(1, "service type is needed"),
      })
    ),
  });
  const confirmService = async (values: typeof form.values) => {
    if (!selectedCustomer) {
      notifications.show({
        message: "Please select a customer",
        color: "red",
      });
      throw new Error("no customer selected");
    }

    const submitData = {
      name: values.name,
      service_type: values.service_type_id,
      customer_id: selectedCustomer.id,
      problem_details: values.problem_details,
      mechanic_id: values.mechanic_id,
      price: 0,
      note: "Note",
      status: "created",
      type: "service",
    };
    console.log(submitData, "submit Data 100");

    const data = await axiosClient.v1.api
      .post("services", submitData)
      .then((res) => res.data);

    console.log(data, "from server");
    notifications.show({
      message: "Service created",
      color: "green",
    });
    form.reset();

    qc.invalidateQueries(["get/services/incomplete"]);

    // setIncompleteServices((p) => {
    //   return [
    //     ...p,
    //     {
    //       id: faker.string.uuid(),
    //       created_at: Date.now(),
    //       serviceTypes: myServiceTypes,
    //       problemDetails,
    //       assignedMechanics,
    //     },
    //   ];
    // });
  };

  const assignedMechanic =
    isArr && mechanics.data.find((m) => m.id == form.values.mechanic_id);

  const tRows = isArr
    ? mechanics.data.map((mechanic) => {
        return (
          <tr key={mechanic.id}>
            <td>{mechanic.id}</td>
            <td>{mechanic.name}</td>
            <td>
              {assignedMechanic?.id == mechanic.id ? (
                <Button
                  compact
                  size="xs"
                  onClick={() => {
                    // setAssignedMechanics((p) => {
                    //   return p.filter((am) => am.id !== mechanic.id);
                    // });
                    form.setFieldValue("mechanic_id", "");
                  }}
                >
                  Unassign
                </Button>
              ) : (
                <Button
                  compact
                  size="xs"
                  onClick={() => {
                    // setAssignedMechanics((p) => {
                    //   return [...p, mechanic];
                    // });
                    form.setFieldValue("mechanic_id", String(mechanic.id));
                  }}
                >
                  Assign
                </Button>
              )}
            </td>
          </tr>
        );
      })
    : [];

  console.log(form.errors);
  return (
    <BasicSection
      title="Service Info"
      headerRightElement={<Button>Create Service Type</Button>}
    >
      <form onSubmit={form.onSubmit(confirmService)}>
        <Stack>
          <SimpleGrid cols={1} breakpoints={[{ minWidth: "md", cols: 2 }]}>
            {/* Service */}
            <Select
              {...form.getInputProps("service_type_id")}
              data={serviceTypes}
              placeholder={serviceData.userService.ph}
              label={serviceData.userService.label}
              withAsterisk={serviceData.userService.required}
            />
            {/* name */}
            <TextInput
              {...form.getInputProps("name")}
              placeholder={"Service name"}
              label={"Service Name"}
              withAsterisk={true}
            />
          </SimpleGrid>
          {/* name */}
          <Textarea
            {...form.getInputProps("problem_details")}
            placeholder={serviceData.userProblem.ph}
            label={serviceData.userProblem.label}
            withAsterisk={serviceData.userProblem.required}
          />

          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {/* {assignedMechanics.map((mechanic) => {
            return (
              <tr key={mechanic.id}>
                <td>{mechanic.id}</td>
                <td>{mechanic.name}</td>
              </tr>
            );
          })} */}
              {assignedMechanic ? (
                <tr>
                  <td>{assignedMechanic.id}</td>
                  <td>{assignedMechanic.name}</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan={2}>No mechanics assigned</td>
                </tr>
              )}
            </tbody>
          </Table>

          <Modal
            centered
            opened={modalOpened}
            onClose={closeModal}
            title="Assign Mechanic Modal"
          >
            <ScrollArea h={"60vh"}>
              <Table withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>{tRows}</tbody>
              </Table>
            </ScrollArea>
          </Modal>
          <SimpleGrid cols={2}>
            <Button type="button" onClick={openModal}>
              Assign Mechanic
            </Button>
            <Button disabled={!assignedMechanic} type="submit">
              Confirm
            </Button>
          </SimpleGrid>
        </Stack>
      </form>
    </BasicSection>
  );
};
