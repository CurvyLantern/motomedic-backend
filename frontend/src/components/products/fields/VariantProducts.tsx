import { SelectColorField } from "@/components/fields/color/MultiSelectColorField";
import { useAttributeQuery } from "@/queries/attributeQuery";
import { useColorQuery } from "@/queries/colorQuery";
import { Variation } from "@/types/defaultTypes";
import {
    Box,
    Button,
    FileButton,
    MultiSelect,
    NumberInput,
    Stack,
    Table,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { useEffect, useMemo, useState } from "react";
import { ProductFormValueType } from "./hooks/useProductForm";

type VariantProducts = {
    form: UseFormReturnType<ProductFormValueType>;
};
const VariantProducts = ({ form }: VariantProducts) => {
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
                          label: v.name,
                          value: String(v.id),
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
        "Price",
        "sku",
        "Image",
        "Action",
    ].map((label) => {
        return <th key={label}>{label}</th>;
    });

    const addVariation = () => {
        // setVariations((p) => [
        //     ...p,
        //     { name: "", price: 100, colorCode: "", image: null },
        // ]);
        form.insertListItem("variations", {
            name: "prod-x-xx-xxx",
            color_id: "",
            attribute_value_ids: [],
            price: 100,
            image: null,
        });
    };

    const trows = form.values.variations
        ? form.values.variations.map((variant, variantIdx) => {
              // const variantEntries = Object.entries(variant);
              /*  {
        name: "v1",
        price: 0,
        sku: "",
        photo: null,
      }, */

              return (
                  <VariantProductTableRow
                      key={variantIdx}
                      form={form}
                      colorSelectArr={colorSelectArr}
                      attibuteSelectArr={attibuteSelectArr}
                      variant={variant}
                      variantIdx={variantIdx}
                  />
              );
          })
        : null;

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
                <Box>
                    <Button
                        onClick={() => {
                            console.clear();
                            console.log(attibuteSelectArr);
                            console.log(form.values);
                        }}
                    >
                        Debug
                    </Button>
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

const VariantProductTableRow = ({
    colorSelectArr,
    variant,
    variantIdx,
    form,
    attibuteSelectArr,
}: VariantProducts & {
    variant: {
        name: string;
        color_id: string;
        attribute_value_ids: [];
        price: 100;
        image: null;
    };
    variantIdx: number;
    colorSelectArr: {
        label: string;
        value: string;
        hexcode: string;
    }[];
    attibuteSelectArr: {
        label: string;
        value: string;
        group: string;
    }[];
}) => {
    const [variantName, setVariantName] = useState("");
    useEffect(() => {
        const colorLabel = colorSelectArr.find(
            (c) => c.value === variant.color_id
        )?.label;
        const attrs = variant.attribute_value_ids.map(
            (id) => attibuteSelectArr.find((a) => a.value === id)?.label
        );
        setVariantName([colorLabel ? colorLabel : "", ...attrs].join("-"));
    }, [variant, colorSelectArr, attibuteSelectArr]);
    useEffect(() => {
        form.setFieldValue(`variations.${variantIdx}.name`, variantName);
    }, [variantName, variantIdx]);

    return (
        <tr key={variantIdx}>
            {/* {variantEntries.map((entry, entryIdx) => {
          return <td key={entryIdx}>{entry[1]}</td>;
        })} */}
            <td>{variantName || variant.name}</td>
            <td>
                {/* <Select
                        data={colorSelectArr}
                        placeholder="select color"
                    ></Select> */}
                <SelectColorField
                    {...form.getInputProps(`variations.${variantIdx}.color_id`)}
                    colors={colorSelectArr}
                ></SelectColorField>
            </td>
            <td>
                <MultiSelect
                    {...form.getInputProps(
                        `variations.${variantIdx}.attribute_value_ids`
                    )}
                    data={attibuteSelectArr}
                    placeholder="Select attributes"
                ></MultiSelect>
            </td>
            <td>
                <NumberInput
                    {...form.getInputProps(`variations.${variantIdx}.price`)}
                    defaultValue={variant.price}
                ></NumberInput>
            </td>
            <td>sku</td>
            <td>
                <FileButton
                    {...form.getInputProps(`variations.${variantIdx}.image`)}
                >
                    {(props) => <Button {...props}>Upload</Button>}
                </FileButton>
            </td>

            <td>
                <Button
                    type="button"
                    compact
                    size="xs"
                    onClick={() => {
                        form.removeListItem("variations", variantIdx);
                    }}
                >
                    Delete
                </Button>
            </td>
        </tr>
    );
};

export default VariantProducts;
