import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Brand } from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

export const useBrandQuery = () => {
  const url = "brands";
  const { data: brands } = useQuery<{ data: Brand[] } | null>({
    queryKey: ["get/brands"],
    queryFn: async () => {
      return axiosClient.v1.api.get(url).then((res) => res.data);
    },
  });

  return brands;
};

export const invalidateBrandQuery = () => {
  qc.invalidateQueries(["get/brands"]);
};
