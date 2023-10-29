import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import { invalidateCustomerQuery } from "@/queries/customerQuery";
import {
  Stack,
  SimpleGrid,
  TextInput,
  Textarea,
  Group,
  Button,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";

import { z } from "zod";
import { userConfig } from "./SelectCustomerOrCreate/config";

export const CreateCustomer = () => {
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
      .post("customers", values)
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
          {/* bikeInfo */}
          <TextInput
            {...form.getInputProps("bike_info")}
            placeholder={userConfig.bikeInfo.ph}
            label={userConfig.bikeInfo.label}
            required={userConfig.bikeInfo.required}
          />

          {/* address */}
          <Textarea
            {...form.getInputProps("address")}
            placeholder={userConfig.userAddress.ph}
            label={userConfig.userAddress.label}
            required={userConfig.userAddress.required}
          />
          <Group>
            <Button
              disabled={!form.values.name}
              type="submit"
              variant="gradient"
            >
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
        </SimpleGrid>
        {/* <Group>
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
        </Group> */}
      </Stack>
    </form>
  );
};
