import { useBrandQuery } from "@/queries/brandQuery";
import { useCategoryQuery } from "@/queries/categoryQuery";
import { useColorQuery } from "@/queries/colorQuery";
import { SelectItem } from "@mantine/core";
import { useMemo } from "react";

export const useColorSelectData = () => {
  const colors = useColorQuery();
  const selectColors = useMemo(() => {
    return colors && Array.isArray(colors.data)
      ? colors.data.map((color) => {
          return {
            value: String(color.id),
            label: color.name,
            hexcode: color.hexcode,
          };
        })
      : [];
  }, [colors]);

  return selectColors;
};
export const useCategorySelectData = () => {
  const categories = useCategoryQuery();
  const selectCategories = useMemo(() => {
    const arr: SelectItem[] = [];
    categories?.data?.forEach((category) => {
      arr.push({ value: String(category.id), label: category.name });

      category.sub_categories?.forEach((subC) => {
        arr.push({
          value: String(subC.id),
          label: subC.name,
          group: category.name,
        });
      });
    });
    return arr;
  }, [categories]);
  return selectCategories;
};
export const useBrandSelectData = () => {
  const brands = useBrandQuery();
  const selectBrands = useMemo(() => {
    return brands && Array.isArray(brands.data)
      ? brands.data.map((brand) => {
          return { value: String(brand.id), label: brand.name };
        })
      : [];
  }, [brands]);

  return selectBrands;
};
