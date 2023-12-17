import { isAuthenticated } from "@/hooks/auth";
import { BasicHeader } from "@/layouts/headers/BasicHeader";
import { AppShell } from "@mantine/core";
import { Outlet, redirect } from "react-router-dom";
import { BodyWrapper } from "./body/BodyWrapper";
import { ContentWrapper } from "./body/ContentWrapper";
import BasicNavbar from "./navbar/BasicNavbar";
import { PosContextProvider } from "@/components/pos/PosContext";

export const authenticatedLoader = async () => {
  try {
    // const user = await qc.fetchQuery(userQuery);
    console.log("authenticatedLoader is not being called");
    const yes = await isAuthenticated();
    // const user = await fetchUser();
    if (yes) {
      return null;
    } else {
      return redirect("/auth");
    }
  } catch (error) {
    console.log(error, " from authenticatedLoader ");
    return redirect("/auth");
  }
};

const AuthenticatedLayout = () => {
  return (
    <AppShell
      header={<BasicHeader />}
      styles={(t) => ({
        main: {
          backgroundColor: t.other.colors.main.background,
          color: t.other.colors.main.foreground,
          paddingTop: `var(--mantine-header-height, 0px)`,
          paddingLeft: "var(--mantine-navbar-width, 0px)",
          paddingRight: "var(--mantine-aside-width, 0px)",
          paddingBottom: "var(--mantine-footer-height, 0px)",
        },
      })}
    >
      <BodyWrapper>
        <BasicNavbar />
        <ContentWrapper>
          <PosContextProvider>
            <Outlet />
          </PosContextProvider>
        </ContentWrapper>
      </BodyWrapper>
    </AppShell>
  );
};
export default AuthenticatedLayout;
