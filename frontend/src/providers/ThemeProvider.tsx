import { theme } from "@/styles/theme";
import { CompWithChildren } from "@/types/defaultTypes";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
// import { Notifications } from "@mantine/notifications";
const ThemeProvider: CompWithChildren = ({ children }) => {
  return (
    <MantineProvider withNormalizeCSS withGlobalStyles theme={theme}>
      <ModalsProvider>
        <Notifications />
        {children}
      </ModalsProvider>
    </MantineProvider>
  );
};

export default ThemeProvider;
