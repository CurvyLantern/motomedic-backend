import { MultiSelect, SimpleGrid, Stack, Switch } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";
import { generateProductVariationCombinations } from "@/utils/generateProductVariationCombinations";
import MultiSelectColorField from "@/components/fields/color/MultiSelectColorField";
import BasicSection from "@/components/sections/BasicSection";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import { createVariant } from "@/store/slices/ProductSlice";
import VariantProducts from "./VariantProducts";
import useProductFormQuery from "@/queries/productFormQuery";
import { SelectInputItem } from "@/types/defaultTypes";

type ProductVariationFields = {
    colors: [];
};

const useProductVariationData = () => {
    const productFormInitialData = useProductFormQuery();
    const colors: Array<SelectInputItem & { code: string }> = [];

    if (productFormInitialData) {
        productFormInitialData.colors.forEach((color) => {
            colors.push({
                label: color.name,
                value: String(color.id),
                code: color.hexcode,
            });
        });
    }
    return {
        colors,
    };
};

export const ProductVariationFieldsSimple = () => {
    const { colors } = useProductVariationData();
    const [isVariationEnabled, setIsVariationEnabled] = useState(false);
    const dispatch = useAppDispatch();
    const availableAttrs = useAppSelector((state) => state.product.attributes);
    const attrInputData = useMemo(() => {
        return availableAttrs.map(({ label, value }) => ({ label, value }));
    }, [availableAttrs]);

    const [selectedAttrsValue, setSelectedAttrsValue] = useState<string[]>([]);

    const selectedAttrs = useMemo(() => {
        return availableAttrs
            .filter((attrs) => {
                return selectedAttrsValue.includes(attrs.value);
            })
            .map((a) => a)
            .sort((a, b) => a.priority - b.priority);
    }, [availableAttrs, selectedAttrsValue]);
    // child Attrs values
    const [selectedChildAttrs, setSelectedChildAttrs] = useState<
        { values: string[]; label: string }[]
    >([]);
    const [selectedColorValues, setSelectedColorValues] = useState<string[]>(
        []
    );

    useEffect(() => {
        console.log({ selectedAttrs });
    }, [selectedAttrs]);

    useEffect(() => {
        const total: string[] = [];
        console.log(selectedChildAttrs, " selected childAttrs ");
        selectedColorValues.forEach((color) => {
            const output = generateProductVariationCombinations({
                colors: color,
                attrs: selectedChildAttrs,
                attrSelector: "values",
            });
            console.log({ output });
            total.push(...output);
        });

        dispatch(createVariant(total.map((t) => ({ name: t }))));

        console.log({ total }, "from use Effect");
    }, [selectedColorValues, selectedChildAttrs, dispatch]);

    const isFormDisabled = !isVariationEnabled;

    return (
        <BasicSection title="Product Variation">
            <Stack>
                <Switch
                    onChange={(e) =>
                        setIsVariationEnabled(e.currentTarget.checked)
                    }
                    label="Enable Variations"
                    labelPosition="left"
                ></Switch>
                <SimpleGrid cols={2}>
                    {/* product colors */}
                    <MultiSelectColorField
                        disabled={isFormDisabled}
                        colors={colors}
                        setColorValues={setSelectedColorValues}
                    />

                    {/* product attributes */}
                    <MultiSelect
                        onChange={(value) => {
                            setSelectedAttrsValue(value);
                        }}
                        disabled={isFormDisabled}
                        label="Attributes"
                        placeholder="Pick all that you like"
                        data={attrInputData}
                    ></MultiSelect>
                </SimpleGrid>

                <SimpleGrid>
                    {selectedAttrs.map((attr, attrIdx) => {
                        return (
                            <MultiSelect
                                onChange={(values) => {
                                    setSelectedChildAttrs((p) => {
                                        const childDataArr = p.find(
                                            (v) => v.label === attr.label
                                        );
                                        if (childDataArr) {
                                            childDataArr.values = values;
                                            return [...p];
                                        } else {
                                            return [
                                                ...p,
                                                {
                                                    label: attr.label,
                                                    values,
                                                },
                                            ];
                                        }
                                    });
                                }}
                                key={attrIdx}
                                label={attr.label}
                                placeholder="Pick all that you like"
                                data={attr.childAttrs}
                            ></MultiSelect>
                        );
                    })}
                    {/* product sizes */}
                </SimpleGrid>

                {isFormDisabled ? null : <VariantProducts />}
            </Stack>
        </BasicSection>
    );
};
