import { useTheme } from "@/styles/theme";
import { CompWithChildren } from "@/types/defaultTypes";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
// import { Notifications } from "@mantine/notifications";
const ThemeProvider: CompWithChildren = ({ children }) => {
  const theme = useTheme({ colorScheme: "light" });
  return (
    <MantineProvider
      withNormalizeCSS
      withGlobalStyles
      theme={{
        ...theme,
        components: {
          Button: {
            variants: {
              danger: (theme) => ({
                root: {
                  backgroundColor: theme.colors.red[8],
                  color: theme.colors.red[0],
                  ...theme.fn.hover({ backgroundColor: theme.colors.red[7] }),
                },
              }),

              success: (theme) => ({
                root: {
                  backgroundImage: theme.fn.linearGradient(
                    45,
                    theme.colors.cyan[theme.fn.primaryShade()],
                    theme.colors.teal[theme.fn.primaryShade()],
                    theme.colors.green[theme.fn.primaryShade()]
                  ),
                  color: theme.white,
                },
              }),
            },
            styles: (_, __, { variant }) => ({
              root: {
                backgroundColor:
                  variant === "filled"
                    ? theme.other?.colors.primary.background
                    : undefined,
              },
              label: {
                fontWeight: 500,
              },
            }),
          },
          NumberInput: {
            defaultProps: {
              type: "number",
            },
          },
        },
      }}
    >
      <ModalsProvider>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
};

export default ThemeProvider;
