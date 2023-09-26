import axiosClient from "@/lib/axios";
import { SelectInputItem } from "@/types/defaultTypes";
import {
    Select,
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
    colors: SelectInputItem[];
    setColorValues: (colors: string[]) => void;
};

const MultiSelectColorField = ({
    colors,
    disabled,
    setColorValues,
}: MultiSelectColorFieldProps) => {
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
            }}
        ></MultiSelect>
    );
};

type SelectColorFieldProps = {
    disabled: boolean;
    colors: SelectInputItem[];
};
export const SelectColorField = ({
    colors,
    disabled,
}: SelectColorFieldProps) => {
    return <Select data={colors} itemComponent={CustomColorItem}></Select>;
};

const CustomColorItem = forwardRef<
    HTMLDivElement,
    {
        hexcode: string;
        label: string;
    }
>(({ hexcode, label, ...others }, ref) => (
    <div ref={ref} {...others}>
        <Group noWrap>
            <Box
                sx={(theme) => ({
                    width: 20,
                    height: 20,
                    borderRadius: theme.radius.sm,
                    backgroundColor: `${hexcode}`,
                })}
            />

            <div>
                <Text
                    sx={{
                        textTransform: "capitalize",
                    }}
                >
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
                })}
            >
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
