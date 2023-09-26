import BasicSection from "@/components/sections/BasicSection";
import { useAppSelector } from "@/hooks/storeConnectors";
import { MultiSelect, NumberInput, SimpleGrid, Textarea } from "@mantine/core";
import { serviceData } from "../fields";

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
            <Button></Button>
        </BasicSection>
    );
};
