import axiosClient from "@/lib/axios";
import {
  Brand,
  CategoryWithSubCateogry,
  Color,
  ProductModels,
} from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

const useProductFormQuery = () => {
  const queryResponse = useQuery<{
    colors: Color[];
    categories: CategoryWithSubCateogry[];
    brands: Brand[];
  }>({
    queryKey: ["products/createInfos"],
    queryFn: () => {
      return axiosClient.v1.api.get("products/createInfos").then((res) => {
        return res.data;
      });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    staleTime: 60 * 1000,
  });

  return queryResponse.data;
};

export default useProductFormQuery;
