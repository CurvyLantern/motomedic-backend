import { createStyles, rem, getStylesRef } from "@mantine/core";
export const useNavBarStyles = createStyles((theme) => ({
  navbar: {
    backgroundColor: theme.other.colors.primary.background,
    overflow: "hidden",
  },
  version: {
    backgroundColor: theme.other.colors.secondary.background,
    color: theme.other.colors.secondary.foreground,
    fontWeight: 700,
  },
  header: {
    paddingBottom: theme.spacing.md,
    marginBottom: `calc(${theme.spacing.md} * 1.5)`,
    borderBottom: `${rem(1)} solid ${theme.fn.lighten(
      theme.other.colors.primary.background,
      0.1
    )}`,
  },
  footer: {
    paddingTop: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderTop: `${rem(1)} solid ${theme.fn.lighten(
      theme.other.colors.primary.background,
      0.1
    )}`,
  },
  link: {
    ...theme.fn.focusStyles(),
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
      // backgroundColor: theme.fn.lighten(
      //     theme.other.colors.primary.background,
      //     0.1
      // ),
      backgroundColor: theme.other.colors.secondary.background,
    },
  },
  iconWrapper: {
    backgroundColor: theme.fn.lighten(
      theme.other.colors.primary.background,
      0.1
    ),

    borderRadius: theme.radius.sm,
    padding: 5,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  linkActive: {
    "&, &:hover": {
      backgroundColor: theme.fn.lighten(
        theme.other.colors.primary.background,
        0.15
      ),
      [`& .${getStylesRef("icon")}`]: {
        opacity: 0.9,
      },
    },
  },
  linkIcon: {
    ref: getStylesRef("icon"),
    color: theme.other.colors.primary.foreground,
    opacity: 0.75,
  },
}));
