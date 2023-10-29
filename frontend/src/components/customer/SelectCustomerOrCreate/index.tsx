import { Drawer, Grid, Stack, Tabs, rem } from "@mantine/core";
import { CreateCustomer } from "../CreateCustomer";
import { SelectedCustomerInfo } from "../SelectedCustomerInfo";
import { SelectCustomer } from "../SelectCustomer";

export const SelectCustomerOrCreate = () => {
  const selectPanel = "selectCustomer";
  const createPanel = "createCustomer";
  return (
    <Tabs
      defaultValue={selectPanel}
      variant="pills"
      styles={(theme) => ({
        tab: {
          ...theme.fn.focusStyles(),
          backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
          color:
            theme.colorScheme === "dark"
              ? theme.colors.dark[0]
              : theme.colors.gray[9],
          border: `${rem(1)} solid ${
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[4]
          }`,
          padding: `${theme.spacing.xs} ${theme.spacing.md}`,
          cursor: "pointer",
          fontSize: theme.fontSizes.sm,
          display: "flex",
          alignItems: "center",

          "&:disabled": {
            opacity: 0.5,
            cursor: "not-allowed",
          },

          "&:not(:first-of-type)": {
            borderLeft: 0,
          },

          "&:first-of-type": {
            borderTopLeftRadius: theme.radius.md,
            borderBottomLeftRadius: theme.radius.md,
          },

          "&:last-of-type": {
            borderTopRightRadius: theme.radius.md,
            borderBottomRightRadius: theme.radius.md,
          },

          "&[data-active]": {
            backgroundColor: theme.colors.blue[7],
            borderColor: theme.colors.blue[7],
            color: theme.white,
          },
        },

        tabIcon: {
          marginRight: theme.spacing.xs,
          display: "flex",
          alignItems: "center",
        },

        tabsList: {
          display: "flex",
        },
      })}
    >
      <Drawer.Header p={0} mb={"md"} sx={{ gap: 10 }}>
        <Tabs.List grow position="center" sx={{ flex: 1 }}>
          <Tabs.Tab
            value={selectPanel}
            fz={"xs"}
            sx={{
              textTransform: "uppercase",
            }}
          >
            Select Customer
          </Tabs.Tab>
          <Tabs.Tab
            value={createPanel}
            fz={"xs"}
            sx={{
              textTransform: "uppercase",
            }}
          >
            Create Customer
          </Tabs.Tab>
        </Tabs.List>
        <Drawer.CloseButton color="red" variant="filled"></Drawer.CloseButton>
      </Drawer.Header>
      <Stack>
        <Tabs.Panel value={selectPanel}>
          <Grid>
            <Grid.Col span={12} sm={6}>
              <SelectCustomer />
            </Grid.Col>
            <Grid.Col span={12} sm={6}>
              <SelectedCustomerInfo />
            </Grid.Col>
          </Grid>
        </Tabs.Panel>
        <Tabs.Panel value={createPanel}>
          <CreateCustomer />
        </Tabs.Panel>
      </Stack>
    </Tabs>
  );
};
