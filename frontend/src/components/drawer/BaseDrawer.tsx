import { CompWithChildren } from "@/types/defaultTypes";
import { Drawer, DrawerProps, MantineSizes, ScrollArea } from "@mantine/core";
import { TbX } from "react-icons/tb";

type BaseDrawerProps = {
  position?: "top" | "bottom" | "left" | "right";
  size?: string;
  children: React.ReactNode;
  headerElement?: React.ReactNode;
  opened: boolean;
  onClose: () => void;
};
const BaseDrawer = ({ children, headerElement, ...props }: BaseDrawerProps) => {
  return (
    <Drawer.Root
      styles={{
        content: {
          display: "flex",
          flexDirection: "column",
        },
        body: {
          flex: 1,
          padding: 0,
        },
      }}
      {...props}
    >
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Header
          p={"xs"}
          sx={(theme) => ({
            boxShadow: theme.shadows.md,
            background: theme.other.colors.primary.background,
          })}
        >
          {headerElement}
          <Drawer.CloseButton
            variant="danger"
            size={"lg"}
            sx={{
              fontSize: 30,
            }}
          >
            <TbX />
          </Drawer.CloseButton>
        </Drawer.Header>
        <Drawer.Body>{children}</Drawer.Body>
      </Drawer.Content>
    </Drawer.Root>
  );
};

export default BaseDrawer;
