
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
            p="lg"
            sx={(theme) => ({
                backgroundColor: theme.other.colors.card.background,
                color: theme.other.colors.card.foreground,
                height: "100%",
            })}
            {...props}
        >
            <Group align="center">
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

                <Box ml={"auto"}>{headerLeftElement}</Box>
            </Group>
            <Box sx={{ flex: 1 }}>{children}</Box>
        </Paper>
    );
};
export default BasicSection;
