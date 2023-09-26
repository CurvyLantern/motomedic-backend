import { SelectColorField } from "@/components/fields/color/MultiSelectColorField";
import { useAppSelector } from "@/hooks/storeConnectors";
import axiosClient from "@/lib/axios";
import { useAttributeQuery } from "@/queries/attributeQuery";
import { useColorQuery } from "@/queries/colorQuery";
import { Variation } from "@/types/defaultTypes";
import {
    Select,
    MultiSelect,
    Stack,
    Table,
    Box,
    NumberInput,
    TextInput,
    FileInput,
    FileButton,
    Button,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const VariantProducts = () => {
    // const variants = useAppSelector((state) => state.product.variants);
    const attributes = useAttributeQuery();
    const colors = useColorQuery();
    const colorSelectArr = useMemo(() => {
        return colors
            ? colors.map((c) => ({
                  label: c.name,
                  value: String(c.id),
                  hexcode: c.hexcode,
              }))
            : [];
    }, [colors]);
    const attibuteSelectArr = useMemo(() => {
        return attributes
            ? attributes
                  .map((a) =>
                      a.values.map((v) => ({
                          label: v,
                          value: v,
                          group: a.name,
                      }))
                  )
                  .flat(1)
            : [];
    }, [attributes]);
    const [variations, setVariations] = useState<Variation[]>([]);
    const ths = [
        "Variant Name",
        "color",
        "Attribute",
        "price",
        "sku",
        "image",
    ].map((label) => {
        return <th key={label}>{label}</th>;
    });

    const addVariation = () => {
        setVariations((p) => [
            ...p,
            { name: "", price: 100, colorCode: "", image: null },
        ]);
    };

    const trows = variations.map((variant, variantIdx) => {
        // const variantEntries = Object.entries(variant);
        /*  {
        name: "v1",
        price: 0,
        sku: "",
        photo: null,
      }, */

        return (
            <tr key={variantIdx}>
                {/* {variantEntries.map((entry, entryIdx) => {
          return <td key={entryIdx}>{entry[1]}</td>;
        })} */}
                <td>{variant.name}</td>
                <td>
                    {/* <Select
                        data={colorSelectArr}
                        placeholder="select color"
                    ></Select> */}
                    <SelectColorField
                        colors={colorSelectArr}
                        disabled={false}
                    ></SelectColorField>
                </td>
                <td>
                    <MultiSelect
                        data={attibuteSelectArr}
                        placeholder="Select attributes"
                    ></MultiSelect>
                </td>
                <td>
                    <NumberInput defaultValue={variant.price}></NumberInput>
                </td>
                <td>sku</td>
                <td>
                    <FileButton onChange={() => {}}>
                        {(props) => <Button {...props}>Upload</Button>}
                    </FileButton>
                </td>
            </tr>
        );
    });

    return (
        <Box
            sx={(theme) => ({
                backgroundColor: theme.white,
            })}
        >
            <Stack>
                <Box>
                    <Button onClick={addVariation}>Add Variation</Button>
                </Box>
                <Table
                    horizontalSpacing="xl"
                    verticalSpacing="sm"
                    highlightOnHover
                    withBorder
                    withColumnBorders
                >
                    <thead>
                        <tr>{ths}</tr>
                    </thead>
                    <tbody>{trows}</tbody>
                </Table>
            </Stack>
        </Box>
    );
};

export default VariantProducts;
