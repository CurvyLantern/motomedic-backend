import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

export const useCustomerQuery = () => {
  const { data: customers } = useQuery({
    queryKey: ["get/customers"],
    queryFn: () => {
      return axiosClient.v1.api.get("customers").then((res) => res.data);
    },
  });

  return customers;
};

export const invalidateCustomerQuery = () => {
  qc.invalidateQueries(["get/customers"]);
};
