import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { Attribute, IdField } from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

const url = "attributes";
export const useAttributeQuery = () => {
    const { data: attrs } = useQuery<Array<Attribute>>({
        queryKey: ["attribute"],
        queryFn: async () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
        refetchInterval: Infinity,
        enabled: true,
    });

    return attrs;
};

export const invalidateAttributeQuery = () => {
    qc.invalidateQueries(["attribute"]);
};
