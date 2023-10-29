import { SelectCustomerOrCreate } from "@/components/customer/SelectCustomerOrCreate";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
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
    <Box
      ref={setRef}
      sx={(theme) => ({
        position: "relative",
        height: "100%",
      })}
    >
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
          body: { height: "100%" },
          inner: { maxWidth: "800px", position: "absolute" },
        })}
        target={ref ?? undefined}
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
    </Box>
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

export default WithCustomerLayout;
