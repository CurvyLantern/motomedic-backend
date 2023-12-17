import { SelectCustomerOrCreate } from "@/components/customer/SelectCustomerOrCreate";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import { useCustomerUnpaidOrderQuery } from "@/queries/orderQuery";
import {
  closeCustomerDrawer,
  toggleCustomerDrawer,
} from "@/store/slices/AppConfigSlice";
import { CompWithChildren } from "@/types/defaultTypes";
import { Box, Button, Center, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

const WithCustomerLayout: CompWithChildren = ({ children }) => {
  const customerDrawerOpened = useAppSelector(
    (s) => s.appConfig.customerDrawerOpened
  );
  const dispatch = useAppDispatch();

  const [ref, setRef] = useState<HTMLDivElement | null>(null);
  return (
    <>
      <Drawer
        withCloseButton={false}
        styles={(theme) => ({
          root: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          },
          content: {
            borderRadius: `${theme.other.radius.primary} !important`,
          },
          inner: {
            maxWidth: "800px",
            paddingLeft: theme.spacing.xs,
            paddingRight: theme.spacing.xs,
          },
        })}
        keepMounted
        position="top"
        opened={customerDrawerOpened}
        onClose={() => {
          dispatch(closeCustomerDrawer());
        }}
      >
        <SelectCustomerOrCreate />
      </Drawer>
      {children}
    </>
  );
};

export const SelectCustomerButton = () => {
  const dispatch = useAppDispatch();
  return (
    <Button
      sx={{
        pointerEvents: "initial",
      }}
      onClick={() => {
        dispatch(toggleCustomerDrawer());
      }}
      variant="gradient"
    >
      Customer
    </Button>
  );
};

export const SelectCustomerDetails = () => {
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);
  return (
    <Box p={5} sx={{ border: "1px solid black" }}>
      {selectedCustomer && selectedCustomer?.id
        ? `${selectedCustomer.name} ${selectedCustomer.phone} ${
            selectedCustomer.bike_info ? selectedCustomer.bike_info : ""
          }`
        : "No customer is selected"}
    </Box>
  );
};

export const SelectCustomerPendingOrders = () => {
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);
  const customerUnpaidOrders = useCustomerUnpaidOrderQuery();
  return (
    <>
      {selectedCustomer?.id ? (
        <Box
          sx={(t) => ({
            backgroundColor: t.colors.orange[4],
            textAlign: "center",
          })}
        >
          {selectedCustomer?.name} has{" "}
          {customerUnpaidOrders ? customerUnpaidOrders.data.length : 0} pending
          orders
        </Box>
      ) : null}
    </>
  );
};

export default WithCustomerLayout;
