import { createStyles, rem, getStylesRef, px } from "@mantine/core";
export const useNavLinkGroupStyles = createStyles((theme) => ({
  control: {
    ...theme.fn.focusStyles(),
    width: "100%",
    // display: "flex",
    // alignItems: "center",
    // justifyContent: "space-between",
    display: "block",
    textDecoration: "none",
    fontSize: "inherit",
    color: theme.other.colors.primary.foreground,
    padding: `.5rem ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    transition: "all 300ms ease",
    "&:hover": {
      // backgroundColor: theme.fn.lighten(
      //     theme.colors.primary.background,
      //     0.1
      // ),
      // backgroundColor: theme.other.colors.secondary.background,
      color: theme.fn.darken(theme.other.colors.primary.foreground, 0.9),
      backgroundColor: theme.fn.lighten(
        theme.other.colors.primary.background,
        0.9
      ),
    },
  },
  controlActive: {
    color: theme.fn.darken(theme.other.colors.primary.foreground, 0.9),
    backgroundColor: theme.fn.lighten(
      theme.other.colors.primary.background,
      0.9
    ),
  },
  activeControl: {
    fontWeight: 700,
  },

  childLinkWrapper: {
    marginLeft: rem(px(theme.spacing.sm) + 10),
    // marginLeft: rem(px(theme.spacing.sm)),
    // borderLeft: `${rem(1)} dotted ${theme.other.colors.secondary.background}`,
    paddingLeft: rem(5),
    paddingTop: rem(5),
    paddingBottom: rem(5),
    background: theme.fn.darken(theme.other.colors.primary.background, 0.1),
    borderRadius: theme.other.radius.primary,
  },

  link: {
    display: "flex",
    alignItems: "center",
    textDecoration: "none",
    fontSize: theme.fontSizes.sm,
    color: theme.other.colors.primary.foreground,
    padding: `${theme.spacing.sm} ${theme.spacing.sm}`,
    borderRadius: theme.radius.sm,
    fontWeight: 500,
    gap: theme.spacing.sm,

    "&:hover": {
      backgroundColor: theme.fn.darken(
        theme.other.colors.secondary.background,
        0.1
      ),
      color: theme.other.colors.secondary.foreground,
    },
  },
  linkActive: {
    backgroundColor: theme.fn.darken(
      theme.other.colors.secondary.background,
      0.1
    ),
    color: theme.other.colors.secondary.foreground,
  },

  chevron: {
    ref: getStylesRef("icon"),
    transition: "transform 200ms ease",
    // color: theme.other.colors.primary.foreground,
    fontSize: theme.fontSizes.lg,
    opacity: 0.75,
    marginLeft: "auto",
  },

  linkIcon: {
    ref: getStylesRef("icon"),
    // color: theme.other.colors.primary.foreground,
    opacity: 1,
    // fontSize: "calc(90% + 1vw)",
    fontSize: `clamp(1.25rem, 1.5vw, 1.75rem);`,
    // fontSize: "90%",
  },
}));
