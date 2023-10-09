import axiosClient from "@/lib/axios";
import { Product } from "@/types/defaultTypes";

import { useQuery } from "@tanstack/react-query";
const getPaginatedUrl = (page: number, perPage: number) =>
  `products/all?page=${page}&perPage=${perPage}`;

export const useProductAllQuery = () => {
  const { data: products } = useQuery<Array<Product>>({
    queryKey: ["products/all"],
    queryFn: () => {
      return axiosClient.v1.api.get("products/all").then((res) => {
        return res.data;
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 2000,
  });

  return products;
};
