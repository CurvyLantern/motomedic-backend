import { updateCustomerByIdOrValue } from "@/store/slices/CustomerSlice";
import {
    Grid,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Tabs,
    TextInput,
    Textarea,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

import { userConfig } from "./config";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import BasicSection from "@/components/sections/BasicSection";
import { SelectedUserInfo } from "../SelectedCustomerInfo";
export const SelectCustomerOrCreate = () => {
    const selectPanel = "selectUser";
    const manualPanel = "createUser";

    const dispatch = useAppDispatch();
    const customers = useAppSelector((state) => state.customer.customers);
    const selectedCustomer = useAppSelector(
        (state) => state.customer.selectedCustomer
    );
    const updateCustomerSelection = (customerFieldValue: unknown) => {
        // dispatch(updateCustomerByIdOrValue(" aksjdklajdkljaksld "));
        dispatch(
            updateCustomerByIdOrValue({
                id: undefined,
                value: customerFieldValue,
            })
        );
    };
    return (
        <Grid>
            <Grid.Col span={7}>
                <BasicSection
                    title={"Select customer from database or enter manually"}
                >
                    <Tabs defaultValue={selectPanel} variant="pills">
                        <Stack>
                            <Tabs.List>
                                <Tabs.Tab
                                    value={selectPanel}
                                    sx={{
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Select User
                                </Tabs.Tab>
                                <Tabs.Tab
                                    value={manualPanel}
                                    sx={{
                                        textTransform: "uppercase",
                                    }}
                                >
                                    Create User
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value={selectPanel}>
                                <Select
                                    onChange={updateCustomerSelection}
                                    label="Select Customer"
                                    data={customers}
                                    value={
                                        selectedCustomer
                                            ? selectedCustomer.value
                                            : null
                                    }
                                />
                            </Tabs.Panel>
                            <Tabs.Panel value={manualPanel}>
                                <SimpleGrid
                                    cols={1}
                                    breakpoints={[
                                        { minWidth: "md", cols: 2 },
                                        { minWidth: "lg", cols: 3 },
                                    ]}
                                >
                                    {/* name */}
                                    <TextInput
                                        placeholder={userConfig.userName.ph}
                                        label={userConfig.userName.label}
                                        withAsterisk={
                                            userConfig.userName.required
                                        }
                                    />
                                    {/* number */}
                                    <NumberInput
                                        placeholder={userConfig.userPhone.ph}
                                        label={userConfig.userPhone.label}
                                        withAsterisk={
                                            userConfig.userPhone.required
                                        }
                                        hideControls
                                    />
                                    {/* email */}
                                    <TextInput
                                        placeholder={userConfig.userEmail.ph}
                                        label={userConfig.userEmail.label}
                                        withAsterisk={
                                            userConfig.userEmail.required
                                        }
                                    />
                                    {/* checkCustomer */}
                                    <Select
                                        placeholder={
                                            userConfig.checkCustomer.ph
                                        }
                                        label={userConfig.checkCustomer.label}
                                        withAsterisk={
                                            userConfig.checkCustomer.required
                                        }
                                        data={userConfig.checkCustomer.options}
                                    />
                                    {/* address */}
                                    <Textarea
                                        placeholder={userConfig.userAddress.ph}
                                        label={userConfig.userAddress.label}
                                        withAsterisk={
                                            userConfig.userAddress.required
                                        }
                                    />
                                    <Stack>
                                        {/* bikeInfo */}
                                        <Textarea
                                            placeholder={userConfig.bikeInfo.ph}
                                            label={userConfig.bikeInfo.label}
                                            withAsterisk={
                                                userConfig.bikeInfo.required
                                            }
                                        />
                                    </Stack>
                                </SimpleGrid>
                            </Tabs.Panel>
                        </Stack>
                    </Tabs>
                </BasicSection>
            </Grid.Col>
            <Grid.Col span={5}>
                <SelectedUserInfo />
            </Grid.Col>
        </Grid>
    );
};
