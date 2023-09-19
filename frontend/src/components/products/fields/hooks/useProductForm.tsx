import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { productFields } from "../fields";
import { useQuery } from "@tanstack/react-query";
import { useCategoryQuery } from "@/queries/categoryQuery";
import { useEffect, useMemo } from "react";

const initialValues = Object.values(productFields)
    .flat(1)
    .reduce((acc, item) => {
        //@ts-expect-error don't need typescript help here
        acc[item.name] = item.data;
        return acc;
    }, {});
console.log({ initialValues });

const validation = Object.values(productFields)
    .flat(1)
    .reduce((acc, item) => {
        acc[item.name] = item.validate;
        return acc;
    }, {} as Record<string, z.AnyZodObject>);
const productSchema = z.object(validation);

export const useProductForm = () => {
    const { categories } = useCategoryQuery();
    const category_id = Array.isArray(categories)
        ? categories.map((c: { name: string; id: number }) => ({
              ...c,
              label: c.name,
              value: String(c.id),
          }))
        : [];

    const form = useForm({
        validate: zodResolver(productSchema),
        initialValues: () => {
            return {
                ...initialValues,
                category_id,
            };
        },
    });

    return {
        form,
        selectInitialData: {
            category_id,
        },
    };
};
