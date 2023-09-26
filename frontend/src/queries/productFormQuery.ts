import axiosClient from "@/lib/axios";
import { Brand, CategoryWithSubCateogry, Color } from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

const useProductFormQuery = () => {
    const { data: productFormInitialData } = useQuery<{
        colors: Color[];
        categories: CategoryWithSubCateogry[];
        brands: Brand[];
    }>({
        queryKey: ["products/createInfos"],
        queryFn: () => {
            return axiosClient.v1.api
                .get("products/createInfos")
                .then((res) => {
                    return res.data;
                });
        },
        refetchOnWindowFocus: false,
        refetchOnMount: true,
        staleTime: 2000,
    });

    return productFormInitialData;
};

export default useProductFormQuery;
