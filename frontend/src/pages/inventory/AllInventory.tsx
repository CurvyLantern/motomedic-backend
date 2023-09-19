import BaseInputs from "@/components/inputs/BaseInputs";
import axiosClient from "@/lib/axios";
import { Button, Table } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { z } from "zod";

type InventoryItemType = {
    id: string;
    product_name: string;
    product_count: string;
};

const url = "api/v1/inventory";
const INVENTORY_COLUMNS = ["ID", "Product name", "Product_count", "Actions"];
const AllInventoryPage = () => {
    const { data: inventoryData } = useQuery<InventoryItemType[]>({
        queryFn: () => {
            return axiosClient.v1.api.get(url).then((res) => res.data.data);
        },
        queryKey: ["get/inventoryData"],
    });

    const isArr = Array.isArray(inventoryData);
    const tRows = isArr
        ? inventoryData.map((inventoryItem) => {
              return (
                  <tr key={inventoryItem.id}>
                      <td>{inventoryItem.product_name}</td>
                      <td>{inventoryItem.product_count}</td>
                      <td>
                          <Button.Group>
                              <Button>details</Button>
                          </Button.Group>
                      </td>
                  </tr>
              );
          })
        : [];

    const onCreate = () => {
        modals.open({
            styles(theme, params, context) {
                return {
                    title: {
                        fontWeight: 600,
                    },
                };
            },
            title: "Please confirm your action",
            children: <div>aksjdakjsd</div>,
            //   labels: { confirm: "Confirm", cancel: "Cancel" },
            //   onCancel: () => console.log("Cancel"),
            //   onConfirm: () => console.log("Confirmed"),
        });
    };

    return (
        <div>
            <Button onClick={onCreate}>Create</Button>
            <Table>
                <thead>
                    <tr>
                        {INVENTORY_COLUMNS.map((thContent) => {
                            return <th key={thContent}>{thContent}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>{tRows}</tbody>
            </Table>
        </div>
    );
};

export default AllInventoryPage;
