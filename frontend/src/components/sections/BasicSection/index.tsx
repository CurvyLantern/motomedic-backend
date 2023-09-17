import { useBasicSectionStyles } from "./styles";
import { Paper, Text, PaperProps, Box } from "@mantine/core";

type BasicSectionType = PaperProps & {
  title?: string;
  children: React.ReactNode;
};
const BasicSection = ({ title, children, ...props }: BasicSectionType) => {
  const { classes, cx } = useBasicSectionStyles();

  return (
    <Paper
      withBorder
      className={cx(classes.paper)}
      shadow="sm"
      radius="md"
      p="lg"
      {...props}>
      {title ? (
        <Text
          component="p"
          className={cx(classes.title)}>
          {title}
        </Text>
      ) : null}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Paper>
  );
};
export default BasicSection;
