import CrudOptions, { CrudViewButton } from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import { useOrderQuery } from "@/queries/orderQuery";

import {
  ActionIcon,
  Badge,
  Button,
  CopyButton,
  Group,
  Table,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useEffect } from "react";
import { TbEye } from "react-icons/tb";
import { Link } from "react-router-dom";

const OrderPage = () => {
  const ordersPaginated = useOrderQuery();

  useEffect(() => {
    console.log(ordersPaginated, " ordersPaginated ");

    return () => {};
  }, [ordersPaginated]);

  const orderRows = ordersPaginated ? (
    ordersPaginated.data.map((order) => {
      const { id, customer, total, status } = order;

      const DeliveryStatusBadge = (
        <Badge variant="light" color={"green"}>
          Delivered
        </Badge>
      );
      return (
        <tr key={id}>
          <td>
            <Group>
              <CopyButton value={id}>
                {({ copied, copy }) => {
                  return (
                    <Tooltip
                      label={copied ? "Copied" : "Copy"}
                      withArrow
                      position="right"
                    >
                      <UnstyledButton onClick={copy}>
                        <Badge>{id}</Badge>
                      </UnstyledButton>
                    </Tooltip>
                  );
                }}
              </CopyButton>
            </Group>
          </td>
          <td>{customer.name}</td>
          <td>{order.total_price} ৳</td>
          <td>
            <Badge
              variant="filled"
              color={
                order.time_status === "finished"
                  ? "green"
                  : order.time_status === "running"
                  ? "blue"
                  : "red"
              }
            >
              {order.time_status}
            </Badge>
          </td>
          <td>
            {" "}
            <Badge
              variant="filled"
              color={order.payment_status === "paid" ? "green" : "red"}
            >
              {order.payment_status}
            </Badge>
          </td>
          <td>
            <Group>
              <ActionIcon
                component={Link}
                to={`/order/${order.id}`}
                fz={"md"}
                size={"md"}
                variant="filled"
                radius={"lg"}
                color={"orange"}
              >
                <TbEye />
              </ActionIcon>
            </Group>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td>Nothing Found</td>
    </tr>
  );
  return (
    <BasicSection>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Customer</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{orderRows}</tbody>
      </Table>
    </BasicSection>
  );
};

export default OrderPage;
