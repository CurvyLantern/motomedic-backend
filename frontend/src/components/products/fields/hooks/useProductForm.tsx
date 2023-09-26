/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { productFields } from "../fields";
import { useQuery } from "@tanstack/react-query";
import { useCategoryQuery } from "@/queries/categoryQuery";
import { useEffect, useMemo } from "react";
import useCustomForm from "@/hooks/useCustomForm";

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
    const { categories } = useCategoryQuery();
    const category_id = categories
        ? categories.map((c) => ({
              group: c.name,
              //   items: c.sub_categories.map((subC) => ({
              //       label: subC.name,
              //       value: String(subC.id),
              //   })),
              items: c.sub_categories.map((subC) => subC.name),
          }))
        : [];
    const form = useCustomForm({
        validate: zodResolver(productSchema),
        initialValues: () => {
            return {
                ...initialValues,
                category_id,
            };
        },
    });

    const selectInitialData: Record<string, any> = {
        category_id,
    };

    return {
        form,
        selectInitialData,
    };
};
