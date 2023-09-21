import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Category, CategoryWithSubCateogry } from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

const url = "categories";
export const useCategoryQuery = () => {
    console.log(" from cat query ");

    const { data } = useQuery<
        | { data: Array<CategoryWithSubCateogry> }
        | Array<CategoryWithSubCateogry>
    >({
        queryKey: ["get/categories"],
        queryFn: () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
    });

    let categories: CategoryWithSubCateogry[] | null = null;

    if (data) {
        if (Array.isArray(data)) {
            categories = data;
        } else if (
            data.data &&
            Array.isArray(data.data) &&
            data.data.length > 0
        ) {
            categories = data.data;
        }
    }

    return {
        categories,
    };
};
export const editCategory = async (category: Category) => {
    return axiosClient.v1.api
        .put(`${url}/${category.id}`, category)
        .then((res) => res.data)
        .catch((error) => console.error(error));
};
export const deleteCategory = async (category: Category) => {
    return axiosClient.v1.api
        .delete(`${url}/${category.id}`)
        .then((res) => {
            qc.invalidateQueries(["get/categories"]);
            return res.data;
        })
        .catch((error) => console.error(error));
};
