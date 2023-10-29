import useProductFormQuery from "@/queries/productFormQuery";
import { SelectItem } from "@mantine/core";
import { useMemo, useState } from "react";

export const useProductSelectData = () => {
  const allInfos = useProductFormQuery();

  const selectProductsData = useMemo(() => {
    const selectCategoriesData: SelectItem[] = [];
    const selectBrandsData: SelectItem[] = [];
    const selectColorsData: SelectItem[] = [];
    const selectsProductModelMap: Record<string, SelectItem[]> = {};
    if (allInfos?.categories) {
      allInfos.categories.forEach((cat) => {
        cat.sub_categories.forEach((subCat) => {
          selectCategoriesData.push({
            label: subCat.name,
            value: subCat.id.toString(),
            group: cat.name,
          });
        });

        selectCategoriesData.push({
          label: cat.name,
          value: cat.id.toString(),
        });
      });
    }
    if (allInfos?.brands) {
      allInfos.brands.forEach((brand) => {
        selectBrandsData.push({
          label: brand.name,
          value: brand.id.toString(),
        });

        selectsProductModelMap[brand.id.toString()] = brand.product_models.map(
          (model) => ({
            label: model.name,
            value: model.id.toString(),
          })
        );
      });
    }
    if (allInfos?.colors) {
      allInfos.colors.forEach((color) => {
        selectColorsData.push({
          label: color.name,
          value: color.id.toString(),
          ...color,
        });
      });
    }

    return {
      selectCategoriesData,
      selectBrandsData,
      selectColorsData,
      selectsProductModelMap,
    };
  }, [allInfos]);
  return selectProductsData;
};
