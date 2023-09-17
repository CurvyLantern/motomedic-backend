import { useAppSelector } from "@/hooks/storeConnectors";
import {
  Text,
  Avatar,
  Box,
  Group,
  ScrollArea,
  UnstyledButton,
} from "@mantine/core";
import { motion } from "framer-motion";
import { TbLogout, TbSettings2, TbSwitchHorizontal } from "react-icons/tb";
import { Link } from "react-router-dom";
import { navData } from "./navData";
import { useNavBarStyles } from "./navbar.styles";
import NavLinkGroup from "./navlinkGroup";
import { ScrollWrapper } from "@/components/scroller";
import { IconChevronRight } from "@tabler/icons-react";
const NavWrapper: CompWithChildren = ({ children }) => {
  const { navHidden } = useAppSelector((s) => s.appConfig);
  return (
    <Box
      component={motion.nav}
      animate={{
        width: navHidden ? 0 : "300px",
      }}
      sx={() => ({
        width: 300,
        // overflow: "hidden",
        display: "flex",
        position: "relative",
        flexShrink: 0,
      })}>
      <ScrollWrapper>
        {/* <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}>
        </Box> */}
        {children}
      </ScrollWrapper>
    </Box>
  );
};

const BasicNavbar = () => {
  const { classes } = useNavBarStyles();
  // const { navHidden } = useAppSelector((s) => s.appConfig);

  const links = navData.map((item, itemIdx) => {
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
  });

  return (
    <NavWrapper>
      <Box
        p={"sm"}
        pr={0}
        sx={() => ({
          display: "flex",
          width: "100%",
          height: `100%`,
          position: "relative",
        })}>
        <Box
          sx={(theme) => ({
            width: "100%",
            display: "flex",
            flexDirection: "column",
            backgroundColor: theme.other.colors.primary.background,
            borderRadius: theme.other.radius.primary,
            position: "relative",
          })}>
          {/* nav links */}
          <ScrollArea
            px={5}
            pt={"md"}
            sx={{
              flex: 1,
            }}>
            {links}
          </ScrollArea>
        </Box>
      </Box>
    </NavWrapper>
  );
};

export default BasicNavbar;
