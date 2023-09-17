import { createStyles } from "@mantine/core";
export const useBasicSectionStyles = createStyles((theme) => ({
  paper: {
    // backgroundColor: theme.fn.lighten(theme.colors.primary.background, 0.8),
    backgroundColor: theme.other.colors.card.background,
    color: theme.other.colors.card.foreground,
    height: "100%",
    // backgroundImage: theme.fn.gradient({
    //     from: "red",
    //     to: "orange",
    //     deg: 45,
    // }),
  },
  title: {
    fontWeight: 600,
    fontSize: theme.fontSizes.lg,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    color: theme.other.colors.card.foreground,
  },
}));
