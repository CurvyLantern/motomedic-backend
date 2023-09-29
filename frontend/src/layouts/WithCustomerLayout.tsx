import { SelectCustomerOrCreate } from "@/components/customer/SelectCustomerOrCreate";
import { CompWithChildren } from "@/types/defaultTypes";
import { Box, Button, Center, Drawer } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { relative } from "path";
import { useRef, useState } from "react";

const WithCustomerLayout: CompWithChildren = ({ children }) => {
  const [opened, { open, close, toggle }] = useDisclosure(false);

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
          content: {
            borderRadius: `${theme.other.radius.primary} !important`,
            // height: "auto !important",
          },
          body: { height: "100%" },
          inner: { position: "absolute" },
        })}
        target={ref ?? undefined}
        keepMounted
        position="top"
        opened={opened}
        onClose={close}
      >
        <SelectCustomerOrCreate />
      </Drawer>
      <Center
        sx={{
          position: "absolute",
          top: 10,
          left: 0,
          height: "auto",
          width: "100%",
          zIndex: 10,
          opacity: 0.7,
        }}
      >
        <Button onClick={toggle} variant="gradient">
          Select User
        </Button>
      </Center>
      {children}
    </Box>
  );
};

export default WithCustomerLayout;
