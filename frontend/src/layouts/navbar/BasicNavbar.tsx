import { ScrollWrapper } from "@/components/scroller";
import { useAppSelector } from "@/hooks/storeConnectors";
import { Box, ScrollArea } from "@mantine/core";
import { motion } from "framer-motion";
import { navData } from "./navData";
import NavLinkGroup from "./navlinkGroup";
import { CompWithChildren } from "@/types/defaultTypes";
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

const BasicNavbar = () => {
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
            width: 280,
          }}
        >
          <Box w={"100%"} sx={{ display: "grid", gap: 5 }}>
            {links}
          </Box>
        </ScrollArea>
      </Box>
    </NavWrapper>
  );
};

export default BasicNavbar;
