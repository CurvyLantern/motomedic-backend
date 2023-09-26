import axiosClient from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useBrandQuery = () => {
    const url = "brands";
    const { data } = useQuery<Brand[] | { data: Brand[] } | null>({
        queryKey: ["get/brands"],
        queryFn: async () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
    });

    let brands: Brand[] | null = null;

    if (data) {
        if (Array.isArray(data)) {
            brands = data;
        } else if (
            data.data &&
            Array.isArray(data.data) &&
            data.data.length > 0
        ) {
            brands = data.data;
        }
    }
    return {
        brands,
    };
};
