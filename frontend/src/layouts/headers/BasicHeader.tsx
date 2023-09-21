import BrandLogo from "@/assets/logo/motomedic-logo.png";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import { toggleNavState } from "@/store/slices/AppConfigSlice";
import {
  Anchor,
  Avatar,
  Box,
  Burger,
  Button,
  Group,
  Header,
  Image,
  Menu,
  Popover,
  Tabs,
  Text,
  UnstyledButton,
  createStyles,
  rem,
  useMantineTheme,
} from "@mantine/core";
import {
  IconHeart,
  IconLogout,
  IconMessage,
  IconSettings,
  IconStar,
} from "@tabler/icons-react";
import { useState } from "react";
import { TbBell, TbChevronDown } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useBasicHeaderStyles } from "./basicHeader.styles";
import { logout, useAuth } from "@/hooks/auth";
export const BasicHeader = () => {
  const { navHidden, drawerOpened } = useAppSelector(
    (state) => state.appConfig
  );
  const dispatch = useAppDispatch();

  const { classes } = useBasicHeaderStyles();
  const burgerOpened = !navHidden;
  return (
    <Header
      withBorder={false}
      className={classes.header}
      height={70}>
      {/* largerThan="sm" styles={{ display: "none" }} */}

      <Burger
        opened={burgerOpened}
        color="white"
        onClick={() => dispatch(toggleNavState())}
        size="sm"
        mx="xl"
      />
      <Anchor
        sx={{ display: "flex" }}
        component={Link}
        to="/">
        <Box sx={{ width: 100, overflow: "hidden" }}>
          <Image
            src={BrandLogo}
            sx={{ width: "100%" }}></Image>
        </Box>
        {/* <Title
            size="h2"
            order={5}
            color="white">
            MotoMedic
          </Title> */}
      </Anchor>

      {/* drawer button */}

      {/* <Burger
          opened={drawerOpened}
          color="white"
          onClick={() => dispatch(toggleDrawerState())}
          size="sm"
          mr="xl"
          ml="auto"
        /> */}

      <Group
        noWrap
        h={"100%"}
        ml={"auto"}
        mr={"xl"}>
        <AuthenticatedNotification />
        <AuthenticatedProfile />
      </Group>
    </Header>
  );
};

const AuthenticatedNotification = () => {
  const theme = useMantineTheme();
  const [selectedTab, setSelectedTab] = useState<string | null>("orders");
  const isTabSelected = (v: string) => {
    return selectedTab === v;
  };
  return (
    <Popover
      styles={{
        dropdown: { padding: 5, borderRadius: theme.other.radius.primary },
      }}
      width={260}
      position="bottom"
      withinPortal>
      <Popover.Target>
        <UnstyledButton
          sx={(t) => ({
            color: t.white,
            padding: ".5rem",
            borderRadius: "50%",
            display: "inline-flex",
            background: "#ffffff66",
            position: "relative",
          })}>
          <TbBell size={20} />
          <Box
            sx={(t) => ({
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: t.colors.green[5],
              position: "absolute",
              top: "0",
              right: "0",
            })}></Box>
        </UnstyledButton>
      </Popover.Target>
      <Popover.Dropdown>
        <Tabs
          styles={(theme) => ({
            tab: {
              backgroundColor: theme.other.colors.primary.foreground,
              color: theme.other.colors.primary.background,
              boxShadow: theme.shadows.md,
              border: 0,
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
                backgroundColor: theme.other.colors.primary.background,
                borderColor: theme.other.colors.primary.foreground,
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
            panel: {
              padding: theme.spacing.md,
            },
          })}
          unstyled
          value={selectedTab}
          onTabChange={setSelectedTab}>
          <Tabs.List sx={{ display: "flex" }}>
            <Tabs.Tab
              value="orders"
              sx={{ flex: 1 }}>
              Orders
            </Tabs.Tab>
            <Tabs.Tab
              value="invoice"
              sx={{ flex: 1 }}>
              Invoice
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="orders">Orders</Tabs.Panel>
          <Tabs.Panel value="invoice">Invoices</Tabs.Panel>
        </Tabs>
      </Popover.Dropdown>
    </Popover>
  );
};

const useDemoStyles = createStyles((theme) => ({
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
  },
  user: {
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,
    padding: `${theme.spacing.xs} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    transition: "background-color 100ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.white,
    },

    [theme.fn.smallerThan("xs")]: {
      display: "none",
    },
  },
}));
const AuthenticatedProfile = () => {
  const { user } = useAuth();
  const [userMenuOpened, setUserMenuOpened] = useState(false);
  const { classes, cx, theme } = useDemoStyles();
  return (
    <Menu
      width={260}
      position="bottom-end"
      transitionProps={{ transition: "pop-top-right" }}
      onClose={() => setUserMenuOpened(false)}
      onOpen={() => setUserMenuOpened(true)}
      withinPortal>
      <Menu.Target>
        <UnstyledButton
          onFocus={() => {
            console.log("focushappend");
          }}
          sx={(theme) => ({
            // display: "block",
            width: "100%",
            height: "100%",
            paddingInline: theme.spacing.md,
            // padding: theme.spacing.md,
            // backgroundColor: theme.colors.blue[6],
            // borderRadius: theme.other.radius.primary,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            // boxShadow: "0 0 .5rem #00000088",

            color: userMenuOpened
              ? theme.other.colors.primaryDark.background
              : theme.other.colors.primaryDark.foreground,
            background: userMenuOpened
              ? theme.other.colors.primaryDark.foreground
              : theme.other.colors.primaryDark.background,

            "&:hover": {
              backgroundColor: theme.other.colors.primaryDark.foreground,
              color: theme.other.colors.primaryDark.background,
            },
          })}>
          <Group>
            <Avatar
              src={""}
              radius="xl"
            />

            <div style={{ flex: 1 }}>
              <Text
                size="sm"
                weight={500}>
                {user.name}
              </Text>

              <Text size="xs">{user.email}</Text>
            </div>

            <TbChevronDown size="1.5rem" />
          </Group>
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Item
          icon={
            <IconHeart
              size="0.9rem"
              color={theme.colors.red[6]}
              stroke={1.5}
            />
          }>
          Your orders
        </Menu.Item>
        <Menu.Item
          icon={
            <IconStar
              size="0.9rem"
              color={theme.colors.yellow[6]}
              stroke={1.5}
            />
          }>
          Your Invoices
        </Menu.Item>
        <Menu.Item
          icon={
            <IconMessage
              size="0.9rem"
              color={theme.colors.blue[6]}
              stroke={1.5}
            />
          }>
          Profile
        </Menu.Item>

        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          icon={
            <IconSettings
              size="0.9rem"
              stroke={1.5}
            />
          }>
          Account settings
        </Menu.Item>

        <Menu.Item
          onClick={async () => {
            const d = await logout();
            console.log(d, "from logout");
          }}
          icon={
            <IconLogout
              size="0.9rem"
              stroke={1.5}
            />
          }>
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
