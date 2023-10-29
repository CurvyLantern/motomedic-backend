import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import { useCustomerQuery } from "@/queries/customerQuery";
import { closeCustomerDrawer } from "@/store/slices/AppConfigSlice";
import { updateSelectedCustomer } from "@/store/slices/CustomerSlice";
import { Box, Button, Select, Stack, Text } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { useStore } from "react-redux";

export const SelectCustomer = () => {
  const dispatch = useAppDispatch();
  const customers = useCustomerQuery();
  const modifiedCustomersForSelect = useMemo(() => {
    return customers && Array.isArray(customers.data)
      ? customers.data.map((c) => ({
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
    // if (!customerFieldValue) return;

    const desiredCustomer = customers.data.find(
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

  const [searchValue, setSearchValue] = useState("");

  return (
    <Box>
      <Text align="center" sx={{ textTransform: "uppercase", fontWeight: 600 }}>
        Select Customer
      </Text>

      <Stack>
        <Select
          clearable
          searchable
          onSearchChange={(v) => {
            setSearchValue(v ? v : "");
          }}
          searchValue={searchValue}
          nothingFound="No Customer was found"
          dropdownComponent="div"
          dropdownPosition="bottom"
          value={selectedCustomer?.id ? selectedCustomer.id.toString() : ""}
          onChange={updateCustomerSelection}
          data={modifiedCustomersForSelect ?? []}
        />
        <Box>
          <Button
            onClick={() => {
              dispatch(closeCustomerDrawer());
            }}
            variant="success"
          >
            OK
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};
