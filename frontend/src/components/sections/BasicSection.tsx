import { Paper, Text, PaperProps, Box, Group } from "@mantine/core";

type BasicSectionType = PaperProps & {
  title?: string;
  children: React.ReactNode;
  headerLeftElement?: JSX.Element;
};
const BasicSection = ({
  title,
  children,
  headerLeftElement,
  ...props
}: BasicSectionType) => {
  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p="md"
      pt={title ? 0 : "md"}
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
      {headerLeftElement || title ? (
        <Group align="center">
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

          <Box ml={"auto"}>{headerLeftElement}</Box>
        </Group>
      ) : null}

      <Box sx={{ flex: 1 }}>{children}</Box>
    </Paper>
  );
};
export default BasicSection;
