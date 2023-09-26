import BasicSection from "@/components/sections/BasicSection";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";

import { useDisclosure } from "@mantine/hooks";
import {
    ScrollArea,
    Table,
    Button,
    Grid,
    MultiSelect,
    NumberInput,
    SimpleGrid,
    Stack,
    Textarea,
    TransferList,
    TransferListData,
    Modal,
} from "@mantine/core";
import { serviceData } from "../fields";
import { useEffect, useState } from "react";
import { CompWithChildren, IdField } from "@/types/defaultTypes";
import { faker } from "@faker-js/faker";
import { addCustomOrderService } from "@/store/slices/CustomerSlice";
import { addOrder } from "@/store/slices/OrderSlice";

export const UserServiceActions = () => {
    return <BasicSection title="Actions">asd</BasicSection>;
};

const mechanics = Array.from({ length: 100 }, (v, k) => {
    return {
        id: k + 1,
        name: faker.person.firstName(),
    };
});
export const UserService = ({
    setIncompleteServices,
}: {
    setIncompleteServices: (v: unknown) => void;
}) => {
    const serviceTypes = useAppSelector((state) => state.service.serviceTypes);
    const [myServiceTypes, setMyServiceTypes] = useState([]);
    const [problemDetails, setProblemDetails] = useState("");
    const [modalOpened, { open: openModal, close: closeModal }] =
        useDisclosure(false);
    const [assignedMechanics, setAssignedMechanics] = useState<
        (typeof mechanics)[number][]
    >([]);

    const confirmService = () => {
        setIncompleteServices((p) => {
            return [
                ...p,
                {
                    id: faker.string.uuid(),
                    created_at: Date.now(),
                    serviceTypes: myServiceTypes,
                    problemDetails,
                    assignedMechanics,
                },
            ];
        });
    };

    const tRows = mechanics.map((mechanic) => {
        return (
            <tr key={mechanic.id}>
                <td>{mechanic.id}</td>
                <td>{mechanic.name}</td>
                <td>
                    {assignedMechanics.find((am) => am.id === mechanic.id) ? (
                        <Button
                            compact
                            size="xs"
                            onClick={() => {
                                setAssignedMechanics((p) => {
                                    return p.filter(
                                        (am) => am.id !== mechanic.id
                                    );
                                });
                            }}
                        >
                            Unassign
                        </Button>
                    ) : (
                        <Button
                            compact
                            size="xs"
                            onClick={() => {
                                setAssignedMechanics((p) => {
                                    return [...p, mechanic];
                                });
                            }}
                        >
                            Assign
                        </Button>
                    )}
                </td>
            </tr>
        );
    });
    return (
        <BasicSection title="Service Info">
            <Stack>
                <SimpleGrid
                    cols={1}
                    breakpoints={[{ minWidth: "md", cols: 2 }]}
                >
                    {/* Service */}
                    <MultiSelect
                        onChange={setMyServiceTypes}
                        data={serviceTypes}
                        placeholder={serviceData.userService.ph}
                        label={serviceData.userService.label}
                        withAsterisk={serviceData.userService.required}
                    />
                    {/* name */}
                    <NumberInput
                        placeholder={serviceData.userJob.ph}
                        label={serviceData.userJob.label}
                        withAsterisk={serviceData.userJob.required}
                        hideControls
                    />
                </SimpleGrid>
                {/* name */}
                <Textarea
                    onChange={(e) => setProblemDetails(e.currentTarget.value)}
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
                        {assignedMechanics.map((mechanic) => {
                            return (
                                <tr key={mechanic.id}>
                                    <td>{mechanic.id}</td>
                                    <td>{mechanic.name}</td>
                                </tr>
                            );
                        })}
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
                <Button onClick={openModal}>Assign Mechanic</Button>
                <Button
                    disabled={assignedMechanics.length <= 0}
                    onClick={confirmService}
                >
                    Confirm
                </Button>
            </Stack>
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
        Math.trunc((Date.now() - service.created_at) * 0.001)
    );
    useEffect(() => {
        const interval = setInterval(() => {
            setElapsedTime(
                Math.trunc((Date.now() - service.created_at) * 0.001)
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
                            {service.assignedMechanics.map((mechanic) => {
                                return (
                                    <tr key={mechanic.id}>
                                        <td>{mechanic.id}</td>
                                        <td>{mechanic.name}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                    Service types : {service.serviceTypes.join(",")}
                </Modal>
                <Button onClick={openServiceDetailsModal} compact size="xs">
                    Details
                </Button>
                <Button onClick={onComplete} compact size="xs">
                    Done
                </Button>
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
    const [incompleteServices, setIncompleteServices] = useState<unknown>([]);
    const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);
    const dispatch = useAppDispatch();

    const onIncompleteServiceFinish = (service: unknown) => {
        setIncompleteServices((p) => {
            return p.filter((is) => is.id !== service.id);
        });

        const test = () => {
            // console.log(selectedCustomer, " selected customer old");
            dispatch(addCustomOrderService(service));
            // setTimeout(() => {
            //     console.log(selectedCustomer, " selected customer new");
            // }, 100);

            // await dispatch(addOrder(selectedCustomer));
        };
        test();
    };

    useEffect(() => {
        // console.log(selectedCustomer, " updated ");
        dispatch(addOrder(selectedCustomer));
    }, [selectedCustomer, dispatch]);
    return (
        <Grid>
            <Grid.Col span={leftColSize}>
                <Stack>
                    {/* user enter data */}

                    {/*  service and items*/}
                    <SimpleGrid
                        cols={1}
                        breakpoints={[{ cols: 2, minWidth: "lg" }]}
                    >
                        <UserService
                            setIncompleteServices={setIncompleteServices}
                        />
                        <UserItems />
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
                            {incompleteServices.map((service) => {
                                return (
                                    <IncompleteServiceTableRow
                                        onComplete={() =>
                                            onIncompleteServiceFinish(service)
                                        }
                                        service={service}
                                        key={service.id}
                                    />
                                );
                            })}
                        </tbody>
                    </Table>
                </BasicSection>
            </Grid.Col>
        </Grid>
    );
};
