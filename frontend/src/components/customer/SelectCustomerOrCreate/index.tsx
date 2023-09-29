import { updateSelectedCustomer } from "@/store/slices/CustomerSlice";
import {
  Text,
  Button,
  Center,
  Grid,
  Group,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Tabs,
  TextInput,
  Textarea,
  Badge,
  Box,
} from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";

import { userConfig } from "./config";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import { zodResolver } from "@mantine/form";
import { custom, z } from "zod";
import axiosClient from "@/lib/axios";
import { notifications } from "@mantine/notifications";
import { qc } from "@/providers/QueryProvider";
import {
  invalidateCustomerQuery,
  useCustomerQuery,
} from "@/queries/customerQuery";
import { useMemo } from "react";

const url = "customers";

export const SelectCustomerOrCreate = () => {
  const selectPanel = "selectCustomer";
  const createPanel = "createCustomer";

  const dispatch = useAppDispatch();
  // const customers = useAppSelector((state) => state.customer.customers);
  const customers = useCustomerQuery();
  const modifiedCustomersForSelect = useMemo(() => {
    return customers
      ? customers.map((c) => ({
          ...customers,
          label: c.name,
          value: String(c.id),
        }))
      : [];
  }, [customers]);

  const selectedCustomer = useAppSelector(
    (state) => state.customer.selectedCustomer
  );
  const updateCustomerSelection = (customerFieldValue: unknown) => {
    // dispatch(updateCustomerByIdOrValue(" aksjdklajdkljaksld "));
    const desiredCustomer = customers.find(
      (c) => String(c.id) === customerFieldValue
    );
    dispatch(
      updateSelectedCustomer({
        id: undefined,
        value: undefined,
        selectedCustomer: desiredCustomer,
      })
    );
  };
  return (
    <Grid sx={{ height: "100%" }}>
      <Grid.Col span={7}>
        <BasicSection title={"Select customer from database or enter manually"}>
          <Tabs defaultValue={selectPanel} variant="pills">
            <Stack>
              <Tabs.List>
                <Tabs.Tab
                  value={selectPanel}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  Select Customer
                </Tabs.Tab>
                <Tabs.Tab
                  value={createPanel}
                  sx={{
                    textTransform: "uppercase",
                  }}
                >
                  Create Customer
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value={selectPanel}>
                <Select
                  dropdownComponent="div"
                  dropdownPosition="bottom"
                  onChange={updateCustomerSelection}
                  label="Select Customer"
                  data={modifiedCustomersForSelect ?? []}
                />
              </Tabs.Panel>
              <Tabs.Panel value={createPanel}>
                <CreateCustomer />
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

const SelectedUserInfo = () => {
  const selectedCustomer = useAppSelector(
    (state) => state.customer.selectedCustomer
  );

  console.log({ selectedCustomer });

  return (
    <BasicSection
      sx={(theme) => ({
        color: "white",
        backgroundImage: theme.fn.gradient({
          from: "teal",
          to: "lime",
          deg: 105,
        }),
        height: "100%",
      })}
      title="Customer Profile"
    >
      {selectedCustomer ? (
        <Stack
          sx={{
            textTransform: "uppercase",
            fontSize: "12px",
            fontWeight: 600,
          }}
          spacing={"xs"}
        >
          <Box>
            <Text>
              {/* <Badge
              variant="gradient"
              gradient={{ from: "teal", to: "lime", deg: 105 }}
            > */}
              Name : {selectedCustomer.name}
              {/* </Badge> */}
            </Text>
            <Text>Phone : {selectedCustomer.phone}</Text>
            <Text>Email : {selectedCustomer.email}</Text>
            <Text>Address : {selectedCustomer.address}</Text>
            <Text>Bike Info : {selectedCustomer.bike_info}</Text>
          </Box>
        </Stack>
      ) : (
        <div>No customer selected</div>
      )}
    </BasicSection>
  );
};

const CreateCustomer = () => {
  const form = useCustomForm({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      bike_info: "",
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, "Customer name should not be empty"),
        phone: z.string().min(1, "Customer name should not be empty"),
        email: z.string().nullable(),
        address: z.string().nullable(),
        bike_info: z.string().nullable(),
      })
    ),
  });
  const onSubmit = (values: typeof form.values) => {
    axiosClient.v1.api
      .post(url, values)
      .then((res) => {
        console.log(res.data);
        notifications.show({
          message: "Customer created successfully",
          color: "green",
        });
        form.reset();
        invalidateCustomerQuery();
        return res.data;
      })
      .catch((error) => console.error(error));
  };
  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <SimpleGrid
          cols={1}
          breakpoints={[
            { minWidth: "md", cols: 2 },
            { minWidth: "lg", cols: 3 },
          ]}
        >
          {/* name */}
          <TextInput
            {...form.getInputProps("name")}
            placeholder={userConfig.userName.ph}
            label={userConfig.userName.label}
            required={userConfig.userName.required}
          />
          {/* number */}
          <TextInput
            {...form.getInputProps("phone")}
            placeholder={userConfig.userPhone.ph}
            label={userConfig.userPhone.label}
            required={userConfig.userPhone.required}
          />
          {/* email */}
          <TextInput
            type="email"
            {...form.getInputProps("email")}
            placeholder={userConfig.userEmail.ph}
            label={userConfig.userEmail.label}
            required={userConfig.userEmail.required}
          />
          {/* address */}
          <Textarea
            {...form.getInputProps("address")}
            placeholder={userConfig.userAddress.ph}
            label={userConfig.userAddress.label}
            required={userConfig.userAddress.required}
          />
          {/* bikeInfo */}
          <Textarea
            {...form.getInputProps("bike_info")}
            placeholder={userConfig.bikeInfo.ph}
            label={userConfig.bikeInfo.label}
            required={userConfig.bikeInfo.required}
          />
        </SimpleGrid>
        <Group>
          <Button type="submit" variant="gradient">
            Save
          </Button>
          <Button
            variant="danger"
            type="button"
            onClick={() => {
              form.reset();
            }}
          >
            Reset
          </Button>
        </Group>
      </Stack>
    </form>
  );
};
