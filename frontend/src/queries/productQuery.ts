import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Product } from "@/types/defaultTypes";
import { notifications } from "@mantine/notifications";

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
      message: JSON.stringify(error.data.message),
      color: "red",
    });
  }
};
