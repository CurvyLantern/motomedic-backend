import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Product } from "@/types/defaultTypes";
import { notifications } from "@mantine/notifications";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
const getPaginatedUrl = (page: number, perPage: number) =>
  `products/all?page=${page}&perPage=${perPage}`;

export const useProductAllQuery = () => {
  const { data: products } = useQuery<{ data?: Array<Product> }>({
    queryKey: ["products/all"],
    queryFn: () => {
      const qs = new URLSearchParams({
        stock: "in_stock",
      });
      return axiosClient.v1.api
        .get(`products/all?${qs.toString()}`)
        .then((res) => {
          return res.data;
        });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 2000,
  });
  return products;
};

export type TStockFilterArgs = "all" | "in_stock";
export const useFlatProducts = (stock: TStockFilterArgs = "all") => {
  const products = useProductAllQuery();

  const flatProducts = useMemo(() => {
    if (!products || !products.data) return [];
    const _temp: Partial<Product>[] = [];
    for (const product of products.data) {
      if (product.variation_product) {
        for (const variation of product.variations) {
          // const vp = {
          //   ...variation,
          //   // name: [
          //   //   product.name,
          //   //   variation.product_model.name,
          //   //   variation.color.name,
          //   //   ...variation.attribute_values.map((v) => v.name),
          //   // ].join("-"),
          //   // brand: product.brand,
          //   // category: product.category,
          //   // name: "nasim",
          //   // type: "variation" as const,
          // };
          if (stock === "in_stock") {
            if (variation.stock_count > 0) {
              _temp.push(variation);
            }
          } else {
            _temp.push(variation);
          }
        }
      } else {
        product.type = "product";
        if (stock === "in_stock") {
          if (product.stock_count > 0) {
            _temp.push(product);
          }
        } else {
          _temp.push(product);
        }
      }
    }
    return _temp;
  }, [products]);

  return flatProducts;
};

export const invalidateProductAllQuery = () => {
  qc.invalidateQueries(["products/all"]);
};

export const deleteProduct = async (
  selector: string,
  onSuccess: () => void
) => {
  try {
    await axiosClient.v1.api
      .delete(`products/${selector}`)
      .then((data) => data);
    notifications.show({
      message: JSON.stringify("Product deleted successfully"),
      color: "green",
    });
    onSuccess();
  } catch (error) {
    notifications.show({
      // @ts-expect-error stupidity
      message: JSON.stringify(error.data.message),
      color: "red",
    });
  }
};
