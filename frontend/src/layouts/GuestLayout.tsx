import BasicSection from "@/components/sections/BasicSection";
import {
    Image,
    Box,
    SimpleGrid,
    Center,
    Stack,
    Title,
    MediaQuery,
    rem,
    Text,
    createStyles,
} from "@mantine/core";
import { Outlet, redirect } from "react-router-dom";
import StoreLogo from "@/assets/logo/motomedic-logo.png";
import FinanceSvg from "@/assets/svgs/finance.svg";
import type { qc } from "@/providers/QueryProvider";
import { userQuery } from "@/queries/userQuery";
import { fetchUser } from "@/fetchers/fetchUser";
import { isAuthenticated } from "@/hooks/auth";

export const guestLayoutLoader = async () => {
    // const user = await qc.fetchQuery(userQuery);
    try {
        const yes = await isAuthenticated();
        // const user = await fetchUser();
        if (yes) {
            return redirect("/");
        } else {
            return null;
        }
    } catch (error) {
        return null;
    }
};

const useStyles = createStyles((theme) => ({
    footer: {
        padding: rem(10),
        backgroundColor: theme.fn.lighten(
            theme.other.colors.primary.background,
            0.2
        ),
    },
    footerContent: {
        padding: theme.spacing.sm,
        // border: `1px solid ${theme.colors.primary.background}`,
        color: theme.other.colors.primary.foreground,
        borderRadius: theme.spacing.xs,
        // fontWeight: 600,
        textAlign: "center",
        fontSize: rem(12),
    },
}));

const GuestLayout = () => {
    const { classes } = useStyles();
    console.log("guest layout");

    return (
        <Box
            sx={(theme) => ({
                minHeight: "100%",
                display: "flex",
                flexDirection: "column",
                boxSizing: "border-box",
                backgroundColor: theme.other.colors.main.background,
                // background: "red",
                padding: "0rem",
            })}
        >
            <SimpleGrid
                p="sm"
                mx="auto"
                cols={1}
                breakpoints={[
                    {
                        cols: 2,
                        minWidth: "sm",
                    },
                ]}
                sx={() => ({
                    flex: 1,
                    // maxWidth: rem(1000),
                    width: "90%",
                })}
            >
                <Center>
                    <Stack>
                        <Center>
                            <Box maw={100}>
                                <Image src={StoreLogo}></Image>
                            </Box>
                        </Center>
                        <Title align="center" size={"h3"} order={1}>
                            পয়েন্ট অফ সেল{" "}
                            <Text
                                span
                                sx={(t) => ({
                                    color: t.other.colors.primary.background,
                                    fontSize: "110%",
                                })}
                            >
                                ( POS )
                            </Text>{" "}
                            সফটওয়্যার
                        </Title>
                        <Text align="center" fz={"sm"} weight={600}>
                            আপনার ব্যবসা হোক ত্রুটি মুক্ত
                        </Text>
                        <MediaQuery
                            smallerThan="sm"
                            styles={{ display: "none" }}
                        >
                            <Image src={FinanceSvg} alt="" />
                        </MediaQuery>
                    </Stack>
                </Center>
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Box>
                        <BasicSection p={rem(40)}>
                            <Outlet />
                        </BasicSection>
                    </Box>
                </Box>
            </SimpleGrid>

            <footer className={classes.footer}>
                <Box className={classes.footerContent}>
                    Copyright &copy; 2023 motomedic. All rights reserved
                </Box>
            </footer>
        </Box>
    );
};
export default GuestLayout;
