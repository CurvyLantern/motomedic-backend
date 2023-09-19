import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useCategoryQuery = () => {
    const url = "categories";
    const { data } = useQuery({
        queryKey: ["get/categories"],
        queryFn: () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
    });
    return { categories: data?.data ? data.data : [] };
};
