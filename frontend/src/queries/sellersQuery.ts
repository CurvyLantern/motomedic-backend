import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

export const useSellersQuery = () => {
  const { data: sellers } = useQuery({
    queryFn: () => {
      return axiosClient.v1.api.get("sellers").then((res) => res.data);
    },
    queryKey: ["get/mechanics"],
  });
  return sellers;
};

export const invalidateSellersQuery = () => {
  qc.invalidateQueries(["get/sellers"]);
};
