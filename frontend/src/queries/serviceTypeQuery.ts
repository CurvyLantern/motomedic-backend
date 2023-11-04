import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { notifications } from "@mantine/notifications";

import { useQuery } from "@tanstack/react-query";

export const useServiceTypesAllQuery = () => {
  const { data: products } = useQuery<{
    data?: Array<{
      id: string;
      name: string;
      price: number | string;
      description: string;
    }>;
  }>({
    queryKey: ["get/serviceTypes"],
    queryFn: () => {
      return axiosClient.v1.api.get("serviceTypes").then((res) => {
        return res.data;
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: Infinity,
  });
  return products;
};

export const invalidateServiceTypesAllQuery = () => {
  qc.invalidateQueries(["get/serviceTypes"]);
};

export const deleteServiceType = async (
  selector: string,
  onSuccess: () => void
) => {
  try {
    await axiosClient.v1.api
      .delete(`serviceTypes/${selector}`)
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
  } finally {
    invalidateServiceTypesAllQuery();
  }
};
