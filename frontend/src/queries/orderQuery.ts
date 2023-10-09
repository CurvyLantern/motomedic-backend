import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

export const useOrderQuery = (status: "paid" | "unpaid") => {
  const { data: orders } = useQuery({
    queryKey: ["get/orders", status],
    queryFn: () => {
      return axiosClient.v1.api
        .get(`orders?status=${status}`)
        .then((res) => res.data);
    },
  });
  return orders;
};

export const invalidateOrderQuery = () => {
  qc.invalidateQueries(["get/orders"]);
};
