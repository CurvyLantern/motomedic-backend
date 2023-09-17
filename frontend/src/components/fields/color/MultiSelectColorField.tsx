import axiosClient from "@/lib/axios";
import {
  Box,
  Group,
  MultiSelect,
  Text,
  MultiSelectValueProps,
  CloseButton,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { forwardRef, useMemo } from "react";

type MultiSelectColorFieldProps = {
  disabled: boolean;
  data: { label: string; value: string }[];
  setColorValues: (colors: string[]) => void;
};

const url = "v1/colors";
const MultiSelectColorField = ({
  data,
  disabled,
  setColorValues,
}: MultiSelectColorFieldProps) => {
  const { data: colorsData } = useQuery<Array<{ name: string; code: string }>>({
    queryKey: ["colors"],
    queryFn: async () => {
      return axiosClient.get(url).then((res) => res.data.data);
    },
    refetchInterval: Infinity,
  });

  const colors = useMemo(() => {
    return colorsData
      ? colorsData.map((c) => ({
          ...c,
          label: c.name,
          value: c.name.toLowerCase(),
        }))
      : [];
  }, [colorsData]);

  return (
    <MultiSelect
      disabled={disabled}
      valueComponent={CustomColorSelected}
      itemComponent={CustomColorItem}
      label="Colors"
      placeholder="Pick all that you like"
      data={colors}
      onChange={(colorValues) => {
        setColorValues(colorValues);
      }}></MultiSelect>
  );
};
const CustomColorItem = forwardRef<
  HTMLDivElement,
  {
    code: string;
    label: string;
  }
>(({ code, label, ...others }, ref) => (
  <div
    ref={ref}
    {...others}>
    <Group noWrap>
      <Box
        sx={(theme) => ({
          width: 20,
          height: 20,
          borderRadius: theme.radius.sm,
          backgroundColor: `${code}`,
        })}
      />

      <div>
        <Text
          sx={{
            textTransform: "capitalize",
          }}>
          {label}
        </Text>
      </div>
    </Group>
  </div>
));

const CustomColorSelected = ({
  code,
  label,
  onRemove,
  ...others
}: MultiSelectValueProps & {
  code: string;
  label: string;
}) => {
  return (
    <div {...others}>
      <Group
        py="xs"
        px="xs"
        spacing="xs"
        sx={(theme) => ({
          borderRadius: theme.radius.sm,
          border: `1px solid ${theme.other.colors.primary.background}`,
        })}>
        <Box
          sx={(theme) => ({
            width: 20,

            height: 10,
            backgroundColor: `${code}`,
            borderRadius: theme.spacing.md,
            boxShadow: "0px 0px 5px 0 #00000099",
          })}
        />
        <Text>{label}</Text>

        <CloseButton
          variant="transparent"
          onMouseDown={onRemove}
          size={22}
          iconSize={18}
          tabIndex={-1}
        />
      </Group>
    </div>
  );
};
export default MultiSelectColorField;
