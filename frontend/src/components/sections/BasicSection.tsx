import { Paper, Text, PaperProps, Box, Group } from "@mantine/core";

type BasicSectionType = PaperProps & {
  title?: string;
  children: React.ReactNode;
  headerLeftElement?: JSX.Element;
  headerRightElement?: JSX.Element;
};
const BasicSection = ({
  title,
  children,
  headerLeftElement,
  headerRightElement,
  ...props
}: BasicSectionType) => {
  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      sx={(theme) => ({
        backgroundColor: theme.other.colors.card.background,
        color: theme.other.colors.card.foreground,
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      })}
      {...props}
    >
      {headerLeftElement || headerRightElement || title ? (
        <Group
          align="center"
          position="apart"
          sx={(theme) => ({
            boxShadow: theme.shadows.xs,
            borderBottom: "1px solid",
            borderColor: theme.other.colors.primary.background,
          })}
          px="md"
        >
          {headerLeftElement ? (
            <Box ml={"auto"}>{headerLeftElement}</Box>
          ) : null}
          {title ? (
            <Text
              component="p"
              py={"xs"}
              sx={(theme) => ({
                fontWeight: 600,
                fontSize: theme.fontSizes.lg,
                color: theme.other.colors.card.foreground,
              })}
            >
              {title}
            </Text>
          ) : null}
          {headerRightElement ? (
            <Box ml={"auto"}>{headerRightElement}</Box>
          ) : null}
        </Group>
      ) : null}

      <Box p={"xs"} sx={{ flex: 1 }}>
        {children}
      </Box>
    </Paper>
  );
};
export default BasicSection;
