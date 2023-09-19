import BasicSection from "@/components/sections/BasicSection";
import { useAppSelector } from "@/hooks/storeConnectors";
import {
    Grid,
    MultiSelect,
    NumberInput,
    SimpleGrid,
    Stack,
    Textarea,
    TransferList,
    TransferListData,
} from "@mantine/core";
import { serviceData } from "../fields";
import { useState } from "react";

export const UserServiceActions = () => {
    return <BasicSection title="Actions">asd</BasicSection>;
};

export const UserService = () => {
    const serviceTypes = useAppSelector((state) => state.service.serviceTypes);
    return (
        <BasicSection title="Service Info">
            <SimpleGrid cols={1} breakpoints={[{ minWidth: "md", cols: 2 }]}>
                {/* Service */}
                <MultiSelect
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
                placeholder={serviceData.userProblem.ph}
                label={serviceData.userProblem.label}
                withAsterisk={serviceData.userProblem.required}
            />
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

export const ServiceMechanics = () => {
    return (
        <BasicSection title="Mechanics">{/* <MechanicTable /> */}</BasicSection>
    );
};
export const ServiceFieldWrapper: CompWithChildren = ({ children }) => {
    const totalColSize = 12;
    const leftColSize = 7;
    const rightColSize = totalColSize - 7;
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
                        <UserService />
                        <UserItems />
                    </SimpleGrid>

                    {/* mechanic and actions */}
                    {/* <MechanicTable /> */}
                </Stack>
            </Grid.Col>
        </Grid>
    );
};
