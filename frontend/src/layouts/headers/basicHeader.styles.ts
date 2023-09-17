import { createStyles } from "@mantine/core";

export const useBasicHeaderStyles = createStyles((theme) => ({
  header: {
    backgroundColor: theme.other.colors.primaryDark.background,
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.md,
  },
}));
