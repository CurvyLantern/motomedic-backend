import ScrollWrapper2 from "@/components/scrollWrapper/ScrollWrapper2";
import { ScrollWrapper } from "@/components/scroller";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import { closeNavState } from "@/store/slices/AppConfigSlice";
import { CompWithChildren } from "@/types/defaultTypes";
import {
  ActionIcon,
  Box,
  Drawer,
  ScrollArea,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { motion } from "framer-motion";
import { TbX } from "react-icons/tb";
import { navData } from "./navData";
import NavLinkGroup from "./navlinkGroup";
const NavWrapper: CompWithChildren = ({ children }) => {
  const { navHidden } = useAppSelector((s) => s.appConfig);
  return (
    <Box
      component={motion.nav}
      initial={{
        width: 300,
      }}
      animate={{
        width: navHidden ? 0 : 300,
      }}
      sx={() => ({
        width: 300,
        // overflow: "hidden",
        display: "flex",
        position: "relative",
        flexShrink: 0,
      })}
    >
      <ScrollWrapper>
        {/* <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}>
        </Box> */}
        <Box
          p={"xs"}
          pr={0}
          sx={() => ({
            display: "flex",
            width: "100%",
            height: `100%`,
            position: "relative",
          })}
        >
          {children}
        </Box>
      </ScrollWrapper>
    </Box>
  );
};

const BasicNavbarComp: CompWithChildren = ({ children }) => {
  return (
    <NavWrapper>
      <Box
        sx={(theme) => ({
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: theme.other.colors.primary.background,
          borderRadius: theme.other.radius.primary,
          position: "relative",
          fontSize: 14,
          overflowX: "hidden",
        })}
      >
        {/* nav links */}
        <ScrollArea
          px={5}
          pt={"md"}
          sx={{
            flex: 1,
            width: "100%",
          }}
        >
          {children}
        </ScrollArea>
      </Box>
    </NavWrapper>
  );
};

const NavWrapper2: CompWithChildren = ({ children }) => {
  const { navHidden } = useAppSelector((s) => s.appConfig);
  const theme = useMantineTheme();
  return (
    <Box
      component={motion.nav}
      initial={{
        width: 300,
      }}
      animate={{
        width: navHidden ? 0 : 300,
      }}
      sx={(theme) => ({
        width: 300,
        display: "flex",
        flexDirection: "column",
        fontSize: 14,
        overflowX: "hidden",
      })}
    >
      <Box
        sx={(theme) => ({
          margin: theme.spacing.xs,
          marginRight: 0,
          minWidth: 280,
          position: "relative",
          height: "100%",
          borderRadius: theme.radius.md,
          backgroundColor: theme.other.colors.primary.background,
        })}
      >
        <ScrollWrapper2 withRadius={false}>
          <Box
            sx={{
              padding: 5,
            }}
          >
            {children}
          </Box>
        </ScrollWrapper2>
      </Box>
    </Box>
  );
};

const BasicNavbarOrDrawer: CompWithChildren = ({ children }) => {
  const matches = useMediaQuery("(min-width: 1000px)");
  const { navHidden } = useAppSelector((s) => s.appConfig);
  const dispatch = useAppDispatch();
  const t = useMantineTheme();
  return (
    <>
      {matches ? (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            maxHeight: "100%",
            position: "relative",
          }}
        >
          {/* <BasicNavbarComp>{children}</BasicNavbarComp> */}
          <NavWrapper2>{children}</NavWrapper2>
        </Box>
      ) : (
        <Drawer
          p={0}
          opened={!navHidden}
          withCloseButton={false}
          onClose={() => {
            dispatch(closeNavState());
          }}
          styles={{
            content: {
              backgroundColor: t.other.colors.primary.background,
            },
            body: { padding: 0 },
          }}
        >
          <Box
            sx={(t) => ({
              padding: t.spacing.md,
            })}
          >
            <ActionIcon
              onClick={() => {
                dispatch(closeNavState());
              }}
              ml={"auto"}
              variant="light"
              size={"sm"}
            >
              <TbX />
            </ActionIcon>
            {children}
          </Box>
        </Drawer>
      )}
    </>
  );
};

const BasicNavbar = () => {
  return (
    <BasicNavbarOrDrawer>
      <Box w={"100%"} sx={{ display: "grid", gap: 5 }}>
        {navData.map((item, itemIdx) => {
          const { icon, label, childLinks, href } = item;
          return (
            <NavLinkGroup
              Icon={icon}
              href={href ? href : ""}
              label={label}
              childLinks={childLinks}
              key={itemIdx}
            />
          );
        })}
      </Box>
    </BasicNavbarOrDrawer>
  );
};

export default BasicNavbar;
