import { Link } from "react-router-dom";
import { Box, Collapse, Group, UnstyledButton } from "@mantine/core";
import { TbChevronRight } from "react-icons/tb";
import type { IconType } from "react-icons";
import { useState } from "react";
import { useNavLinkGroupStyles } from "./styles";
import { useLocation } from "react-router-dom";

type ChildLink = {
  href: string;
  icon: IconType;
  label: string;
  childLinks?: ChildLink[];
};
type NavLinkGroupProps = {
  href: string;
  Icon: IconType;
  label: string;
  childLinks?: ChildLink[];
};
const NavLinkGroup = ({ href, Icon, label, childLinks }: NavLinkGroupProps) => {
  const { classes, cx, theme } = useNavLinkGroupStyles();
  const hasChild = Array.isArray(childLinks);
  const [opened, setOpened] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  console.log(location, "location");

  const getHref = (path: string) => `/${path}`;
  const navLinkItems = (hasChild ? childLinks : []).map(
    (childLinkItem, childLinkIdx) => {
      return (
        <NavLinkGroup
          key={childLinkIdx}
          Icon={childLinkItem.icon}
          href={childLinkItem.href ? childLinkItem.href : ""}
          label={childLinkItem.label}
          childLinks={childLinkItem.childLinks}
        />
      );
    }
  );

  const linkContent = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Icon className={classes.linkIcon} />
      <Box ml="md">{label}</Box>
      {hasChild && (
        <TbChevronRight
          className={classes.chevron}
          style={{
            transform: opened
              ? `rotate(${theme.dir === "rtl" ? -90 : 90}deg)`
              : "none",
          }}
        />
      )}
    </Box>
  );

  return (
    <Box
      sx={() => ({
        // minWidth: `calc(300px - 3rem)`,
        // minWidth: ,
        fontSize: "90%",
      })}
    >
      {href ? (
        <Link
          to={href}
          className={cx(
            classes.control,
            href === pathname ? classes.controlActive : ""
          )}
        >
          {linkContent}
        </Link>
      ) : (
        <UnstyledButton
          onClick={() => {
            if (hasChild) {
              setOpened((o) => !o);
              return;
            }
          }}
          className={cx(
            classes.control,
            href === pathname ? classes.controlActive : ""
          )}
        >
          {linkContent}
        </UnstyledButton>
      )}
      {hasChild ? (
        <Collapse className={classes.childLinkWrapper} in={opened}>
          {navLinkItems}
        </Collapse>
      ) : null}
    </Box>
  );
};

export default NavLinkGroup;
