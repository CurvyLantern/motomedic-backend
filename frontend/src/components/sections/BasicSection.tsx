
import { Paper, Text, PaperProps, Box } from "@mantine/core";

type BasicSectionType = PaperProps & {
  title?: string;
  children: React.ReactNode;
};
const BasicSection = ({ title, children, ...props }: BasicSectionType) => {
  return (
      <Paper
          withBorder
          shadow="sm"
          radius="md"
          p="lg"
          sx={(theme) => ({
              backgroundColor: theme.other.colors.card.background,
              color: theme.other.colors.card.foreground,
              height: "100%",
          })}
          {...props}
      >
          {title ? (
              <Text
                  component="p"
                  sx={(theme) => ({
                      fontWeight: 600,
                      fontSize: theme.fontSizes.lg,
                      paddingTop: theme.spacing.lg,
                      paddingBottom: theme.spacing.lg,
                      color: theme.other.colors.card.foreground,
                  })}

              >
                  {title}
              </Text>
          ) : null}
          <Box sx={{ flex: 1 }}>{children}</Box>
      </Paper>
  );
};
export default BasicSection;
