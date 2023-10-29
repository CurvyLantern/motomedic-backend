import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Brand } from "@/types/defaultTypes";
import { notifications } from "@mantine/notifications";

import { useQuery } from "@tanstack/react-query";

export const useProductModelQuery = () => {
  const { data: productModels } = useQuery<{
    data?: Array<{
      name: string;
      id: string;
      brands: Brand[];
    }>;
  }>({
    queryKey: ["productModels"],
    queryFn: () => {
      return axiosClient.v1.api.get("productModels").then((res) => {
        return res.data;
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 2000,
  });

  return productModels;
};

export const invalidateProductModelQuery = () => {
  qc.invalidateQueries(["productModels"]);
};

export const deleteProductModel = async (
  selector: string,
  onSuccess: () => void
) => {
  try {
    await axiosClient.v1.api
      .delete(`productModels/${selector}`)
      .then((data) => data);
    notifications.show({
      message: JSON.stringify("Product Model deleted successfully"),
      color: "green",
    });
    onSuccess();
  } catch (error) {
    notifications.show({
      // @ts-expect-error stupid error;
      message: JSON.stringify(error.data.message),
      color: "red",
    });
  }
};
