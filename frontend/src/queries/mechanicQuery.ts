import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

type Mechanic = {
  name: string;
  id: string;
  phone: string;
  email: string;
  status: string;
  address: string;
};
export const useMechanicQuery = (status?: "idle" | "busy") => {
  const { data: mechanics } = useQuery<{
    data?: Mechanic[];
  }>({
    queryFn: () => {
      return axiosClient.v1.api
        .get(`mechanics?status=${status ? status : ""}`)
        .then((res) => res.data);
    },
    queryKey: ["get/mechanics"],
  });
  return mechanics;
};

export const invalidateMechanicQuery = () => {
  qc.invalidateQueries(["get/mechanics"]);
};
