import currencyToWords from "@/utils/CurrencyToWords";
import {
  Box,
  Container,
  Flex,
  Group,
  Stack,
  Table,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { format } from "date-fns";
import { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";

const useInvoiceStyles = createStyles((t) => ({
  storeInfo: {
    fontSize: rem(12),
  },
  user: {
    fontSize: rem(14),
  },
  amount: {
    fontWeight: 600,
    fontSize: rem(12),
    color: t.colors.dark[3],
  },
  amountInfo: {
    fontSize: rem(10),
    fontWeight: 600,
    color: t.colors.dark[1],
  },
  th: {
    textAlign: "initial",
    fontSize: rem(12),
    fontWeight: 600,
  },
  calculate: {
    display: " flex",
    gap: rem(10),
  },
  calculateLeftLabel: {
    textAlign: "left",
    verticalAlign: "middle",
  },
  parent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

type TDiscountType = "flat" | "percent";
type TProductOrderItem = {
  discount: number;
  discount_type: TDiscountType;
  id: number | string;
  product_sku: string;
  quantity: number;
  total_price: number;
  type: "variation" | "product";
  unit_price: number;
  product: {
    name: string;
  };
};
type TServiceOrderItem = {
  discount: number;
  discount_type: TDiscountType;
  id: number | string;
  quantity: number;
  total_price: number;
  unit_price: number;
  name: string;
  service_type: {
    name: string;
  };
};
type TCustomer = {
  address: string;
  bike_info: string;
  email: string;
  id: number | string;
  name: string;
  phone: string;
};
type TSeller = {
  id: string | number;
  name: string;
  email: string;
};
export type TInvoice1Props = {
  customer: TCustomer;
  id: string | number;
  note: string;
  overall_discount: number;
  overall_discount_type: TDiscountType;

  overall_tax: number;
  overall_tax_type: TDiscountType;
  status: "paid" | "unpaid" | "due" | "cancelled";
  productOrderItems: TProductOrderItem[];
  serviceOrderItems?: TServiceOrderItem[];
  seller: TSeller;
  total_price: number;
  payment_status?: string;
  time_status?: string;
};

const Invoice1 = forwardRef<HTMLDivElement, { order: TInvoice1Props | null }>(
  ({ order }, ref) => {
    const currencySymbol = "৳";

    const { classes } = useInvoiceStyles();

    let subTotal =
      order && order.productOrderItems
        ? order.productOrderItems.reduce((acc, item) => {
            acc += item.total_price;
            return acc;
          }, 0)
        : 0;
    subTotal +=
      order && order.serviceOrderItems
        ? order.serviceOrderItems.reduce((acc, item) => {
            acc += item.total_price;
            return acc;
          }, 0)
        : 0;
    return (
      <Box
        p={"xs"}
        ref={ref}
        sx={{
          display: "none",
          flexDirection: "column",
          "@media print": {
            display: "flex",
          },
        }}
      >
        {order ? (
          <Box
            sx={(t) => ({
              maxWidth: "800px",
              height: "100%",
              border: "0px solid #000",
              // boxShadow: t.shadows.sm,
              display: "flex",
              flexDirection: "column",
            })}
          >
            {/* invoice header */}
            <Box
              sx={(t) => ({
                width: "100%",
                backgroundColor: t.colors.blue,
                color: t.white,
                padding: t.spacing.sm,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              })}
            >
              {/* logo */}
              <Text
                sx={{
                  fontSize: 30,
                  fontWeight: "bold",
                }}
              >
                MotoMedic
              </Text>

              {/* store info */}
              <Box className={classes.storeInfo}>
                <p>MotoMedic</p>
                <p>016029009</p>
                <p>motomedic@gmail.com</p>
                <p>Dhaka</p>
              </Box>
            </Box>
            {/* invoice user section */}

            <Group
              noWrap
              py={"xs"}
              px={"md"}
              align="flex-start"
              position="apart"
              sx={{
                width: "100%",
              }}
            >
              {/* user info*/}

              <Box sx={{ minWidth: 0 }}>
                <InfoTable
                  rowArray={[
                    { content: order.customer.name, title: "Customer" },
                    { content: order.customer.phone, title: "Phone" },
                    { content: order.customer.email, title: "Email" },
                  ]}
                />
              </Box>

              <Box sx={{ flexShrink: 0 }}>
                <InfoTable
                  rowArray={[
                    {
                      content: format(new Date(), "MM/dd/yyyy"),
                      title: "Date",
                    },
                    { content: order.id.toString(), title: "Order ID" },
                    { content: order.seller.name.toString(), title: "Seller" },
                    { content: "Cash", title: "Payment Method" },
                  ]}
                />
              </Box>
            </Group>

            {/* invoice contents */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                height: "100%",
              }}
            >
              <Box sx={{ flex: 1 }}>
                <Table
                  withBorder
                  withColumnBorders
                  verticalSpacing="2px"
                  horizontalSpacing="xs"
                  fontSize="xs"
                >
                  <thead>
                    <tr>
                      <th style={{ width: "10%" }}>#</th>
                      <th>Products</th>
                      <th style={{ width: "20%" }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order?.productOrderItems?.map(
                      (productOrderItem, productOrderItemIdx) => {
                        const isProduct = productOrderItem.type === "product";

                        return (
                          <tr
                            style={{ height: 20, border: "none" }}
                            key={productOrderItem.id}
                          >
                            <td
                              style={{
                                borderBottom: "none",
                                borderTop: "none",
                              }}
                            >
                              {productOrderItemIdx + 1}
                            </td>
                            {/* name */}
                            <td
                              style={{
                                borderBottom: "none",
                                borderTop: "none",
                              }}
                            >
                              <p>
                                {productOrderItem?.product?.name ??
                                  "Basic Product"}
                              </p>
                              <Group>
                                <p className={classes.amountInfo}>
                                  {productOrderItem.quantity} pcs *{" "}
                                  {productOrderItem.unit_price} {currencySymbol}
                                </p>
                                <p className={classes.amountInfo}>
                                  Discount : {productOrderItem.discount}{" "}
                                  {productOrderItem.discount_type === "flat"
                                    ? "৳"
                                    : "%"}
                                </p>
                              </Group>
                            </td>
                            <td
                              style={{
                                borderBottom: "none",
                                borderTop: "none",
                              }}
                            >
                              <div>
                                <p className={classes.amount}>
                                  {productOrderItem.total_price}{" "}
                                  {currencySymbol}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}

                    {order?.serviceOrderItems?.map(
                      (serviceOrderItem, serviceOrderItemIdx) => {
                        const SL =
                          order.productOrderItems.length +
                          serviceOrderItemIdx +
                          1;
                        return (
                          <tr
                            style={{ height: 20, border: "none" }}
                            key={serviceOrderItem.id}
                          >
                            <td
                              style={{
                                borderBottom: "none",
                                borderTop: "none",
                              }}
                            >
                              {SL}
                            </td>
                            {/* name */}
                            <td
                              style={{
                                borderBottom: "none",
                                borderTop: "none",
                              }}
                            >
                              <p>
                                {serviceOrderItem?.service_type?.name ??
                                  "Basic Service"}
                              </p>
                              <Group>
                                <p className={classes.amountInfo}>
                                  {1} pcs * {serviceOrderItem.unit_price}{" "}
                                  {currencySymbol}
                                </p>
                                <p className={classes.amountInfo}>
                                  Discount : {serviceOrderItem.discount}{" "}
                                  {serviceOrderItem.discount_type === "flat"
                                    ? "৳"
                                    : "%"}
                                </p>
                              </Group>
                            </td>
                            <td
                              style={{
                                borderBottom: "none",
                                borderTop: "none",
                              }}
                            >
                              <div>
                                <p className={classes.amount}>
                                  {serviceOrderItem.total_price}{" "}
                                  {currencySymbol}
                                </p>
                              </div>
                            </td>
                          </tr>
                        );
                      }
                    )}

                    {/* total row */}
                  </tbody>
                </Table>
              </Box>
              <Table
                withBorder
                verticalSpacing="2px"
                horizontalSpacing="xs"
                fontSize="xs"
              >
                <thead>
                  <tr>
                    <th
                      style={{
                        width: "50%",
                        textTransform: "uppercase",
                        fontSize: 30,
                        fontWeight: 400,
                      }}
                    >
                      {order.payment_status}
                    </th>
                    <Box
                      component="th"
                      sx={{
                        width: "30%",
                        "& p": {
                          textAlign: "right",
                        },
                      }}
                    >
                      <p>Subtotal</p>
                      <p>Discount</p>
                      <p>Tax</p>
                    </Box>
                    <th style={{ minWidth: "20%" }}>
                      <p>
                        {subTotal} {currencySymbol}
                      </p>
                      <p>
                        {order.overall_discount} {currencySymbol}
                      </p>
                      <p>
                        {order.overall_tax} {currencySymbol}
                      </p>
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      style={{
                        fontSize: rem(13),
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text fw={600} fz={10}>
                          <Text fz={12} span transform="uppercase">
                            In words :
                          </Text>{" "}
                          {currencyToWords(order.total_price)}
                        </Text>
                        <Text>Total</Text>
                      </Box>
                    </th>
                    <th>
                      {order.total_price} {currencySymbol}
                    </th>
                  </tr>
                </thead>
                <tfoot></tfoot>
              </Table>
            </Box>
            {/* invoice footer */}
            <Container fluid sx={{ width: "100%", marginTop: "auto" }}>
              <Group noWrap pt={40} pb={15} position="apart" align="flex-start">
                <Stack spacing={0} sx={{ width: "35%", alignSelf: "flex-end" }}>
                  {/* <Text className={classes.info}>Paid By Cash</Text> */}
                  <Box h={2} bg={"black"}></Box>
                  <Text fw={500} fz={"xs"} pt={"sm"} align="center">
                    Customer's Signature
                  </Text>
                </Stack>

                <Stack spacing={0} sx={{ width: "35%", alignSelf: "flex-end" }}>
                  {/* <Text className={classes.info}>Paid By Cash</Text> */}
                  <Box h={2} bg={"black"}></Box>
                  <Text fw={500} fz={"xs"} pt={"sm"} align="center">
                    Authorised's Signature
                  </Text>
                </Stack>
              </Group>
            </Container>
          </Box>
        ) : (
          <Box>No order was found</Box>
        )}
      </Box>
    );
  }
);

const InfoTable = ({
  rowArray,
}: {
  rowArray: { title: string; content: string }[];
}) => {
  return (
    <table style={{ width: "100%" }}>
      <tbody>
        {rowArray.map((row) => (
          <tr key={row.title}>
            <th
              align="justify"
              style={{
                verticalAlign: "top",
                fontSize: 12,
                fontWeight: 500,
                // fontWeight: "bold",
                width: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              {row.title}
            </th>
            <td
              style={{
                minWidth: "16px",
                verticalAlign: "top",
                textAlign: "center",
                fontSize: 12,
                fontWeight: "bold",
              }}
            >
              :
            </td>
            <td style={{ verticalAlign: "top" }}>
              {" "}
              <Text sx={{ fontSize: 13 }}> {row.content}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Invoice1;
