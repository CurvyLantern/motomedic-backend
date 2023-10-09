import BasicSection from "@/components/sections/BasicSection";
import { useOrderQuery } from "@/queries/orderQuery";

import {
  Badge,
  Button,
  CopyButton,
  Group,
  Table,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useEffect } from "react";

const OrderPage = () => {
  const ordersPaginated = useOrderQuery("unpaid");

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
      const PaymentStatusBadge = (
        <Badge variant="light" color={status === "paid" ? "green" : "red"}>
          {status}
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
          <td>{total} ৳</td>
          <td>{DeliveryStatusBadge}</td>
          <td>
            <Badge variant="filled">Cash</Badge> {PaymentStatusBadge}
          </td>
          <td>
            <Button compact size="xs">
              view
            </Button>
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
            <th>Delivery Status</th>
            <th>Payment Method & Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{orderRows}</tbody>
      </Table>
    </BasicSection>
  );
};

export default OrderPage;
