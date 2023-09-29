import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

export const useMechanicQuery = () => {
  const { data: mechanics } = useQuery({
    queryFn: () => {
      return axiosClient.v1.api.get("mechanics").then((res) => res.data);
    },
    queryKey: ["get/mechanics"],
  });
  return mechanics;
};

export const invalidateMechanicQuery = () => {
  qc.invalidateQueries(["get/mechanics"]);
};
