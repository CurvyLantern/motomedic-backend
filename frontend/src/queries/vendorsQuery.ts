import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

type Vendor = {
  name: string;
  phone: string;
  id: string;
};
export const useVendorsQuery = () => {
  const { data: vendors } = useQuery<{
    data?: Array<Vendor>;
  }>({
    queryFn: () => {
      return axiosClient.v1.api.get("vendors").then((res) => res.data);
    },
    queryKey: ["get/vendors"],
  });
  return vendors;
};

export const invalidateVendorsQuery = () => {
  qc.invalidateQueries(["get/vendors"]);
};
