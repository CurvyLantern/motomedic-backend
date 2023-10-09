import BasicSection from "@/components/sections/BasicSection";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";

import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useMechanicQuery } from "@/queries/mechanicQuery";
import { addOrder } from "@/store/slices/OrderSlice";
import { CompWithChildren, IdField } from "@/types/defaultTypes";
import {
  Button,
  Grid,
  Modal,
  NumberInput,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
  Textarea,
  TransferList,
  TransferListData,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
    <BasicSection title="Service Info">
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
const storeValues: TransferListData = [
  [
    { value: "wd40", label: "WD40" },
    { value: "paint-black", label: "Paint Black" },
    { value: "sticker", label: "Monster Sticker" },
    { value: "light", label: "Headlights" },
    { value: "backtire", label: "Backtire" },
    { value: "fronttire", label: "Fronttire" },
    { value: "mobil", label: "Mobil" },
  ],
  [],
];
export const UserItems = () => {
  const [data, setData] = useState(storeValues);
  return (
    <BasicSection title="Item Lists">
      <SimpleGrid cols={1}>
        {/* Service */}
        {/* <Select
                    placeholder={serviceData.userPackage.ph}
                    label={serviceData.userPackage.label}
                    withAsterisk={serviceData.userPackage.required}
                    data={serviceData.userPackage.data ?? []}
                /> */}
        <TransferList
          breakpoint="xs"
          value={data}
          onChange={setData}
          searchPlaceholder="Search..."
          nothingFound="Nothing here"
          titles={["Items", "Customer Items"]}
        />
      </SimpleGrid>
    </BasicSection>
  );
};

const IncompleteServiceTableRow = ({
  service,
  onComplete,
}: {
  onComplete: () => void;
  service: { id: IdField; created_at: number; serviceTypes: string[] };
}) => {
  const [
    serviceDetailsModalOpened,
    { open: openServiceDetailsModal, close: closeServiceDetailsModal },
  ] = useDisclosure(false);
  const [elapsedTime, setElapsedTime] = useState(
    Math.trunc((Date.now() - new Date(service.created_at).getTime()) * 0.001)
  );
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(
        Math.trunc(
          (Date.now() - new Date(service.created_at).getTime()) * 0.001
        )
      );
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [service.created_at]);

  return (
    <tr key={service.id}>
      <td>{service.id}</td>
      <td>{elapsedTime}</td>
      <td>running</td>
      <td>
        <Modal
          centered
          opened={serviceDetailsModalOpened}
          onClose={closeServiceDetailsModal}
          title="Service Details"
        >
          <Table withBorder withColumnBorders>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {/* {service.assignedMechanics.map((mechanic) => {
                return (
                  <tr key={mechanic.id}>
                    <td>{mechanic.id}</td>
                    <td>{mechanic.name}</td>
                  </tr>
                );
              })} */}
            </tbody>
          </Table>
          {/* .join(",") */}
          Service types : {service.serviceTypes}
        </Modal>
        <SimpleGrid cols={2}>
          <Button onClick={openServiceDetailsModal} compact size="xs">
            Details
          </Button>
          <Button onClick={onComplete} compact size="xs">
            Done
          </Button>
        </SimpleGrid>
      </td>
    </tr>
  );
};

export const ServiceMechanics = () => {
  return (
    <BasicSection title="Mechanics">{/* <MechanicTable /> */}</BasicSection>
  );
};
export const ServiceFieldWrapper: CompWithChildren = ({ children }) => {
  const totalColSize = 12;
  const leftColSize = 7;
  const rightColSize = totalColSize - 7;
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);
  const dispatch = useAppDispatch();

  const onIncompleteServiceFinish = async (
    service: unknown,
    values?: typeof form.values
  ) => {
    try {
      const updatedService = await axiosClient.v1.api
        .put(`services/${service.id}`, { status: "completed" })
        .then((res) => res.data);

      const subTotal = values ? values.total : 0;
      const discountPercent = values ? values.discount : 0;
      const discountPlain = (subTotal * discountPercent) / 100;
      const subTotalMinusDiscount = subTotal - discountPlain;
      const taxPercent = values ? values.tax : 0;
      const taxPlain = (subTotalMinusDiscount * taxPercent) / 100;
      const total = subTotalMinusDiscount - taxPlain;
      const submitData = {
        customer_id: updatedService.customer_id,
        total: total,
        discount: discountPlain,
        tax: taxPlain,
        note: updatedService.note,
        type: "service",
        status: "unpaid",
        items: [
          {
            id: updatedService.id,
            quantity: 1,
            total_price: values ? values.total : 0,
            unit_price: values ? values.total : 0,
          },
        ],
      };

      const serverData = await axiosClient.v1.api
        .post("orders", submitData)
        .then((res) => res.data);

      notifications.show({
        message: "Bike service completed.",
        color: "green",
      });

      qc.invalidateQueries(["get/services/incomplete"]);

      console.log(serverData, "Server response data");
    } catch (error) {
      notifications.show({
        message: error.data.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    // console.log(selectedCustomer, " updated ");
    dispatch(addOrder(selectedCustomer));
  }, [selectedCustomer, dispatch]);

  const { data: incompleteServices } = useQuery({
    queryKey: ["get/services/incomplete"],
    queryFn: () => {
      return axiosClient.v1.api
        .get(`services?status=running`)
        .then((res) => res.data);
    },
  });

  console.log(incompleteServices, "incmplete services");
  const isArr = incompleteServices && Array.isArray(incompleteServices.data);

  const [doneModalOpened, { open: openDoneModal, close: closeDoneModal }] =
    useDisclosure(false);

  const form = useCustomForm({
    initialValues: {
      total: 0,
      discount: 0,
      tax: 0,
    },
    validate: zodResolver(
      z.object({
        total: z.number().nonnegative(),
        discount: z.number().nonnegative(),
        tax: z.number().nonnegative(),
      })
    ),
  });

  const [selectedService, setSelectedService] = useState(null);

  const submitServiceForm = (values: typeof form.values) => {
    onIncompleteServiceFinish(selectedService, values);
    form.reset();
    closeDoneModal();
    setSelectedService(null);
  };

  return (
    <Grid>
      <Modal
        title="Confirm Service"
        opened={doneModalOpened}
        onClose={() => {
          closeDoneModal();
          form.reset();
          setSelectedService(null);
        }}
        size={"lg"}
        centered
      >
        <form onSubmit={form.onSubmit(submitServiceForm)}>
          <Stack>
            <SimpleGrid cols={3}>
              <NumberInput label="Total" {...form.getInputProps("total")} />
              <NumberInput
                label="Discount percentage"
                min={0}
                max={100}
                rightSection={"%"}
                {...form.getInputProps("discount")}
              />
              <NumberInput
                label="Tax percentage"
                min={0}
                max={100}
                rightSection={"%"}
                {...form.getInputProps("tax")}
              />
            </SimpleGrid>

            <SimpleGrid cols={2}>
              <Button type="submit" disabled={!form.values.total}>
                Submit
              </Button>
              <Button
                variant="danger"
                type="button"
                onClick={() => {
                  closeDoneModal();
                  form.reset();
                  setSelectedService(null);
                }}
              >
                Cancel
              </Button>
            </SimpleGrid>
          </Stack>
        </form>
      </Modal>
      <Grid.Col span={leftColSize}>
        <Stack>
          {/* user enter data */}

          {/*  service and items*/}
          <SimpleGrid cols={1} breakpoints={[{ cols: 1, minWidth: "lg" }]}>
            <UserService />
            {/* <UserItems /> */}
          </SimpleGrid>

          {/* mechanic and actions */}
          {/* <MechanicTable /> */}
        </Stack>
      </Grid.Col>
      <Grid.Col span={rightColSize}>
        <BasicSection title="Running Services">
          <Table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Elapsed Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isArr ? (
                incompleteServices.data.map((service) => {
                  return (
                    <IncompleteServiceTableRow
                      onComplete={() => {
                        setSelectedService(service);
                        openDoneModal();
                      }}
                      service={service}
                      key={service.id}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={4}>No services</td>
                </tr>
              )}
            </tbody>
          </Table>
        </BasicSection>
      </Grid.Col>
    </Grid>
  );
};
