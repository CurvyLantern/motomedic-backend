import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { InventoryItemType } from "@/types/defaultTypes";
import { useQuery } from "@tanstack/react-query";

const url = "inventories";
export const useInventoryQuery = () => {
    const { data: inventoryData } = useQuery<InventoryItemType[]>({
        queryFn: () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
        queryKey: ["get/inventoryData"],
    });
    return inventoryData;
};
export const invalidateInventoryQuery = () => {
    qc.invalidateQueries(["get/inventoryData"]);
};
