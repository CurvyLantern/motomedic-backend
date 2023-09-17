import BasicSection from "@/components/sections/BasicSection";
import { faker } from "@faker-js/faker";
import {
  Badge,
  Button,
  CopyButton,
  Group,
  Table,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import { useState } from "react";
class Order {
  orderId: string;
  customer: string;
  seller: string;
  amount: number;
  deliveryStatus: string;
  paymentMethod: string;
  paymentStatus: string;

  constructor({
    orderId,
    customer,
    seller,
    amount,
    deliveryStatus,
    paymentMethod,
    paymentStatus,
  }: {
    orderId: string;
    customer: string;
    seller: string;
    amount: number;
    deliveryStatus: string;
    paymentMethod: string;
    paymentStatus: string;
  }) {
    this.orderId = orderId;
    this.customer = customer;
    this.seller = seller;
    this.amount = amount;
    this.deliveryStatus = deliveryStatus;
    this.paymentMethod = paymentMethod;
    this.paymentStatus = paymentStatus;
  }
}
faker.seed(123);
const _mock = Array.from({ length: 100 }, () => {
  return new Order({
    orderId: faker.string.uuid(),
    amount: faker.number.float({ min: 100, max: 20000, precision: 0.01 }),
    customer: faker.person.fullName(),
    deliveryStatus: faker.helpers.arrayElement(["pending", "delivered"]),
    paymentMethod: "Cash",
    paymentStatus: faker.helpers.arrayElement(["paid", "unpaid"]),
    seller: faker.person.fullName(),
  });
});
const OrderPage = () => {
  const [orders, setOrders] = useState(_mock);

  const orderRows = orders.map((order) => {
    const {
      orderId,
      customer,
      seller,
      amount,
      deliveryStatus,
      paymentMethod,
      paymentStatus,
    } = order;

    const DeliveryStatusBadge = (
      <Badge
        variant="light"
        color={deliveryStatus === "delivered" ? "green" : "red"}>
        {deliveryStatus}
      </Badge>
    );
    const PaymentStatusBadge = (
      <Badge
        variant="light"
        color={paymentStatus === "paid" ? "green" : "red"}>
        {paymentStatus}
      </Badge>
    );
    return (
      <tr key={orderId}>
        <td>
          <Group>
            <CopyButton value={orderId}>
              {({ copied, copy }) => {
                return (
                  <Tooltip
                    label={copied ? "Copied" : "Copy"}
                    withArrow
                    position="right">
                    <UnstyledButton onClick={copy}>
                      <Badge>{orderId}</Badge>
                    </UnstyledButton>
                  </Tooltip>
                );
              }}
            </CopyButton>
          </Group>
        </td>
        <td>{customer}</td>
        <td>{seller}</td>
        <td>৳ {amount}</td>
        <td>{DeliveryStatusBadge}</td>
        <td>
          <Badge variant="filled">{paymentMethod}</Badge> {PaymentStatusBadge}
        </td>
        <td>
          <Button
            compact
            size="xs">
            view
          </Button>
        </td>
      </tr>
    );
  });
  return (
    <BasicSection>
      <Table
        withBorder
        withColumnBorders>
        <thead>
          <tr>
            <th>OrderId</th>
            <th>Customer</th>
            <th>Seller</th>
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
