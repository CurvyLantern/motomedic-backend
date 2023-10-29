import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Color } from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

const url = "colors";
export const useColorQuery = () => {
  const { data: colors } = useQuery<{
    data: Array<Color>;
  }>({
    queryKey: ["color"],
    queryFn: async () => {
      return axiosClient.v1.api.get(url).then((res) => res.data);
    },
    staleTime: 5000,
    enabled: true,
  });

  return colors;
};

export const invalidateColorQuery = () => {
  qc.invalidateQueries(["color"]);
};
