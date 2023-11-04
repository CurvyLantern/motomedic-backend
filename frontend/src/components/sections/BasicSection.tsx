import {
  Paper,
  Text,
  PaperProps,
  Box,
  Group,
  MantineTheme,
  packSx,
} from "@mantine/core";

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
  sx,
  ...props
}: BasicSectionType) => {
  return (
    <Paper
      withBorder
      shadow="xs"
      radius="md"
      mx={"auto"}
      sx={[
        (theme) => ({
          backgroundColor: theme.other.colors.card.background,
          color: theme.other.colors.card.foreground,
          height: "100%",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          maxWidth: 1920,
          width: "100%",
        }),
        ...packSx(sx),
      ]}
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
          p="sm"
        >
          {headerLeftElement ? (
            <Box mr={"auto"}>{headerLeftElement}</Box>
          ) : null}
          {title ? (
            <Text
              component="p"
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
