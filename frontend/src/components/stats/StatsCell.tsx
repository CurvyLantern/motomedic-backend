import { createStyles, Group, Paper, Text, ThemeIcon } from "@mantine/core";
import { TbArrowUpRight, TbArrowDownRight } from "react-icons/tb";

const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  label: {
    fontFamily: `Greycliff CF, ${theme.fontFamily}`,
  },
}));

type StatsCellType = {
  title: string;
  value: string;
  diff: number;
};
export const StatsCell = ({ title, value, diff }: StatsCellType) => {
  const { classes } = useStyles();
  const DiffIcon = diff > 0 ? TbArrowUpRight : TbArrowDownRight;

  return (
    <Paper
      withBorder
      p="md"
      radius="md">
      <Group position="apart">
        <div>
          <Text
            c="dimmed"
            tt="uppercase"
            fw={700}
            fz="xs"
            className={classes.label}>
            {title}
          </Text>
          <Text
            fw={700}
            fz="xl">
            {value}
          </Text>
        </div>
        <ThemeIcon
          color="gray"
          variant="light"
          sx={(theme) => ({
            color: diff > 0 ? theme.colors.teal[6] : theme.colors.red[6],
          })}
          size={38}
          radius="md">
          <DiffIcon size="1.8rem" />
        </ThemeIcon>
      </Group>
      <Text
        c="dimmed"
        fz="sm"
        mt="md">
        <Text
          component="span"
          c={diff > 0 ? "teal" : "red"}
          fw={700}>
          {diff}%
        </Text>{" "}
        {diff > 0 ? "increase" : "decrease"} compared to last month
      </Text>
    </Paper>
  );
};
