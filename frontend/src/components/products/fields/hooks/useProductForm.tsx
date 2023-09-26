/* eslint-disable @typescript-eslint/no-explicit-any */
import useCustomForm from "@/hooks/useCustomForm";
import useProductFormQuery from "@/queries/productFormQuery";
import { zodResolver } from "@mantine/form";
import { z } from "zod";
import { productFields } from "../fields";
import { SelectInputItem } from "@/types/defaultTypes";

const initialValues = Object.values(productFields)
    .flat(1)
    .reduce((acc, item) => {
        //@ts-expect-error don't need typescript help here
        acc[item.name] = item.data;
        return acc;
    }, {});

const validation = Object.values(productFields)
    .flat(1)
    .reduce((acc, item) => {
        acc[item.name] = item.validate;
        return acc;
    }, {} as Record<string, z.AnyZodObject>);
const productSchema = z.object(validation);

export const useProductForm = () => {
    const form = useCustomForm({
        validate: zodResolver(productSchema),
        initialValues: {
            ...initialValues,
        },
    });
    const productFormInitialData = useProductFormQuery();
    const category_id: SelectInputItem[] = [];
    const brand_id: SelectInputItem[] = [];
    const color_id: SelectInputItem[] = [];

    if (productFormInitialData) {
        productFormInitialData.brands.forEach((brand) => {
            brand_id.push({ label: brand.name, value: String(brand.id) });
        });
        productFormInitialData.categories.forEach((category) => {
            category.sub_categories.forEach((subC) => {
                category_id.push({
                    value: String(subC.id),
                    label: subC.name,
                    group: category.name,
                });
            });
        });
        productFormInitialData.colors.forEach((color) => {
            color_id.push({ label: color.name, value: String(color.id) });
        });
    }

    const selectInitialData: Record<string, any> = {
        category_id,
        brand_id,
        color_id,
    };

    return {
        form,
        selectInitialData,
    };
};
