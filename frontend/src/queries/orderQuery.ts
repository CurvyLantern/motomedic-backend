import { useAppSelector } from "@/hooks/storeConnectors";
import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { useQuery } from "@tanstack/react-query";

export const useOrderQuery = (
  paymentStatus?: "paid" | "unpaid",
  timeStatus?: "waiting" | "running"
) => {
  const { data: orders } = useQuery({
    queryKey: ["get/orders", paymentStatus, timeStatus],
    queryFn: () => {
      const searchParams = new URLSearchParams({
        paymentStatus: paymentStatus ? paymentStatus : "",
        timeStatus: timeStatus ? timeStatus : "",
      });
      return axiosClient.v1.api
        .get(`orders?${searchParams.toString()}`)
        .then((res) => res.data);
    },
  });
  return orders;
};

export const useCustomerUnpaidOrderQuery = () => {
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);

  const id =
    selectedCustomer && selectedCustomer.id
      ? selectedCustomer.id.toString()
      : "";
  const { data: orders } = useQuery({
    queryKey: ["get/customer/unpaid/orders", id],
    queryFn: () => {
      if (selectedCustomer) {
        const searchParams = new URLSearchParams({
          customer_id: id,
          status: "unpaid",
        });
        return axiosClient.v1.api
          .get(`orders?${searchParams.toString()}`)
          .then((res) => res.data);
      } else {
        return null;
      }
    },
  });
  return orders;
};

export const invalidateCustomerUnpaidOrderQuery = () => {
  qc.invalidateQueries(["get/customer/unpaid/orders"]);
};
export const invalidateOrderQuery = () => {
  qc.invalidateQueries(["get/orders"]);
};
