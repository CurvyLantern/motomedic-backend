/* eslint-disable @typescript-eslint/no-explicit-any */
import BasicSection from "@/components/sections/BasicSection";

import { useAppSelector } from "@/hooks/storeConnectors";
import { SelectCustomerButton } from "@/layouts/WithCustomerLayout";
import axiosClient from "@/lib/axios";
import {
  Box,
  Button,
  Divider,
  Flex,
  Group,
  NumberInput,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  invalidateCustomerUnpaidOrderQuery,
  invalidateOrderQuery,
  useCustomerUnpaidOrderQuery,
} from "@/queries/orderQuery";
import { invalidateProductAllQuery } from "@/queries/productQuery";
import { useUserQuery } from "@/queries/userQuery";
import ScrollWrapper2 from "../scrollWrapper/ScrollWrapper2";
import PosCartProduct, { TCartProductDiscount } from "./PosCartProduct";
import { usePosContext } from "./PosContext";
import { useCustomInputStyles } from "./customInput.styles";
import { useReactToPrint } from "react-to-print";
import Invoice1, { TInvoice1Props } from "../invoice/Invoice1";

export const getPercentage = (prcnt: number, outOf: number) =>
  outOf * (prcnt / 100);

const PosCart = () => {
  const [orderDataFromServer, setOrderDataFromServer] =
    useState<TInvoice1Props | null>(null);
  const invoiceRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    onAfterPrint() {
      setOrderDataFromServer(null);
    },
  });
  const { cartProducts, resetCart } = usePosContext();
  const user = useUserQuery();

  const theme = useMantineTheme();
  const { classes } = useCustomInputStyles();
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);

  const [hasPaid, setHasPaid] = useState<"paid" | "unpaid">("unpaid");

  const customerUnpaidOrders = useCustomerUnpaidOrderQuery();

  console.log(customerUnpaidOrders, "customerUnpaidOrders");

  const [cartDiscountType, setCartDiscountType] =
    useState<TCartProductDiscount>("flat");
  const [cartTaxType, setCartTaxType] = useState<TCartProductDiscount>("flat");
  const [cartDiscountInput, setCartDiscountInput] = useState(0);
  const [cartTaxInput, setCartTaxInput] = useState(0);

  const cartSubTotal = useMemo(() => {
    return cartProducts.reduce((sum, item) => {
      sum += item.total_price;
      return sum;
    }, 0);
  }, [cartProducts]);

  const cartDiscount =
    cartDiscountType === "flat"
      ? cartDiscountInput
      : getPercentage(cartDiscountInput, cartSubTotal);
  const cartTotalWithDiscount = cartSubTotal - cartDiscount;
  const cartTax =
    cartTaxType === "flat"
      ? cartTaxInput
      : getPercentage(cartTaxInput, cartTotalWithDiscount);
  const cartTotal = cartTotalWithDiscount - cartTax;

  const attachToPendingOrder = async () => {
    try {
      if (!selectedCustomer) {
        throw new Error("Please select a customer first");
      }
      if (customerUnpaidOrders && customerUnpaidOrders.data.length > 0) {
        const orderId = customerUnpaidOrders.data[0].id;
        if (!orderId) {
          throw new Error("No Order was found");
        }
        const submitData = {
          order_id: customerUnpaidOrders.data[0].id,
          seller_id: user?.id.toString(),
          items: cartProducts.map((p) => ({
            product_sku: p.sku,
            type: p.type,
            status: "unpaid",
            quantity: p.quantity,
            unit_price: p.unit_price,
            total_price: p.total_price,
            discount: p.discount,
            discountType: p.discountType,
          })),
        };
        console.log(submitData, cartProducts, " cart submit Data ");

        const serverData = await axiosClient.v1.api
          .put(`orders/pos`, submitData)
          .then((res) => res.data);

        notifications.show({
          message: "Order Attached successfully",
          color: "green",
        });
        resetCart();
        console.log(serverData, "Server response data");
      }
    } catch (error) {
      notifications.show({
        // @ts-expect-error error is not typed
        message: error.message,
        color: "red",
      });
      console.error(error);
    } finally {
      invalidateProductAllQuery();
      invalidateCustomerUnpaidOrderQuery();
      invalidateOrderQuery();
    }
  };

  const confirmOrderAndPrint = async () => {
    try {
      if (!selectedCustomer) {
        throw new Error("Please select a customer first");
      }

      const submitData = {
        customer_id: selectedCustomer.id,
        total: cartTotal,
        overallDiscountPrice: cartDiscount,
        overallDiscountAmount: cartDiscountInput,
        overallDiscountType: cartDiscountType,

        taxPrice: cartTax,
        taxAmount: cartTaxInput,
        taxType: cartTaxType,

        note: "Note",
        status: hasPaid,
        seller_id: user?.id,
        items: cartProducts.map((p) => ({
          order_id: null,
          product_sku: p.sku,
          type: p.type,
          status: hasPaid,
          quantity: p.quantity,
          unit_price: p.unit_price,
          total_price: p.total_price,
          discount: p.discount,
          discountType: p.discountType,
        })),
      };
      console.log(submitData, cartProducts, " cart submit Data ");
      console.log(JSON.stringify(submitData, null, 2));

      const state = false;
      if (state) return;

      const serverData = await axiosClient.v1.api
        .post("orders/posConfirmPrint", submitData)
        .then((res) => res.data);

      notifications.show({
        message: "Order Placed successfully",
        color: "green",
      });
      resetCart();
      setOrderDataFromServer(serverData?.data);

      // setPrintData(serverData.data);
    } catch (error) {
      notifications.show({
        // @ts-expect-error error is not typed
        message: error.message,
        color: "red",
        autoClose: 1500,
      });
      console.error(error);
    } finally {
      invalidateProductAllQuery();
    }
  };

  const isTotalNegative = cartTotal < 0;

  console.log(cartProducts, "cartProducts");

  useEffect(() => {
    if (orderDataFromServer) {
      handlePrint();
    }
  }, [orderDataFromServer, handlePrint]);

  return (
    <>
      <Invoice1 order={orderDataFromServer} ref={invoiceRef} />
      <Box
        sx={{
          height: "100%",
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <BasicSection
          title="Cart"
          headerRightElement={
            <Group>
              <Box p={5} sx={{ border: "1px solid black" }}>
                {selectedCustomer?.id
                  ? `${selectedCustomer.name} ${selectedCustomer.phone} ${
                      selectedCustomer.bike_info
                        ? selectedCustomer.bike_info
                        : ""
                    }`
                  : "No customer is selected"}
              </Box>
              <SelectCustomerButton />
            </Group>
          }
          sx={{ flex: 1 }}
          withoutPadding
        >
          <Flex p={0} direction={"column"} sx={{ flex: 1, height: "100%" }}>
            <ScrollWrapper2>
              <Stack p={"xs"} spacing={"sm"} sx={{}}>
                {cartProducts && cartProducts.length > 0 ? (
                  cartProducts.map((cartProduct, cartProductIdx) => {
                    return (
                      <PosCartProduct
                        key={cartProductIdx}
                        cartProduct={cartProduct}
                      />
                    );
                  })
                ) : (
                  <Box>No products in cart</Box>
                )}
              </Stack>
            </ScrollWrapper2>
            <Stack
              spacing={"5px"}
              p={"xs"}
              sx={{
                boxShadow: "0 0 0 black",
                // position: "absolute",
                // bottom: 0,
                // left: 0,
                // right: 0,
                backgroundColor: theme.fn.lighten(
                  theme.other.colors.primary.background,
                  0.9
                ),
              }}
            >
              {selectedCustomer?.id ? (
                <Box
                  sx={(t) => ({
                    backgroundColor: t.colors.orange[4],
                    textAlign: "center",
                  })}
                >
                  {selectedCustomer?.name} has{" "}
                  {customerUnpaidOrders ? customerUnpaidOrders.data.length : 0}{" "}
                  pending orders
                </Box>
              ) : null}

              <Box>
                <SimpleGrid
                  cols={2}
                  spacing={"xs"}
                  sx={{
                    fontSize: "10px",
                    fontWeight: 500,
                    textTransform: "uppercase",
                    opacity: 0.9,
                  }}
                >
                  <Text>Subtotal </Text>
                  <Text align="right">{cartSubTotal}</Text>

                  <Text>
                    Discount ({cartDiscountInput}
                    {cartDiscountType === "percent" ? "%" : "৳"})
                  </Text>
                  <Text align="right">{cartDiscount}</Text>

                  <Text>
                    Tax ({cartTaxInput}
                    {cartTaxType === "percent" ? "%" : "৳"})
                  </Text>
                  <Text align="right">{cartTax}</Text>
                </SimpleGrid>
                <Divider />
                <SimpleGrid
                  cols={2}
                  sx={{
                    fontWeight: 500,
                    textTransform: "uppercase",
                    color: isTotalNegative ? "red" : "black",
                  }}
                >
                  {/* total */}
                  <Text fz={"md"}>Total </Text>
                  <Text fz={"md"} align="right">
                    {cartTotal}
                  </Text>
                </SimpleGrid>
              </Box>
              <Divider />

              <SimpleGrid cols={3} spacing={"xs"}>
                <Select
                  searchable={false}
                  clearable={false}
                  value={hasPaid}
                  onChange={(v) => setHasPaid(v === "paid" ? v : "unpaid")}
                  data={["paid", "unpaid"]}
                />
                <Popover trapFocus withArrow>
                  <Popover.Target>
                    <Button size="xs" variant="outline" bg={"white"}>
                      Discount
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown
                    sx={(t) => ({
                      display: "flex",
                      gap: 5,
                      padding: rem(5),
                      border: `1px solid ${t.other.colors.primary}`,
                    })}
                  >
                    <Box sx={{ flex: 2, width: 100 }}>
                      <NumberInput
                        classNames={classes}
                        hideControls
                        placeholder="Discount"
                        value={cartDiscountInput}
                        onChange={(v) => {
                          setCartDiscountInput(Number(v));
                        }}
                      />
                    </Box>
                    <Select
                      allowDeselect={false}
                      clearable={false}
                      searchable={false}
                      sx={{ flex: 1 }}
                      classNames={classes}
                      value={cartDiscountType}
                      onChange={(v) =>
                        setCartDiscountType(v as TCartProductDiscount)
                      }
                      data={["flat", "percent"]}
                    />
                  </Popover.Dropdown>
                </Popover>
                <Popover trapFocus withArrow>
                  <Popover.Target>
                    <Button size="xs" variant="outline" bg={"white"}>
                      Tax
                    </Button>
                  </Popover.Target>
                  <Popover.Dropdown
                    sx={(t) => ({
                      display: "flex",
                      gap: 5,
                      padding: rem(5),
                      border: `1px solid ${t.other.colors.primary}`,
                    })}
                  >
                    <Box sx={{ flex: 2, width: 100 }}>
                      <NumberInput
                        classNames={classes}
                        hideControls
                        placeholder="Tax"
                        value={cartTaxInput}
                        onChange={(v) => {
                          setCartTaxInput(Number(v));
                        }}
                      />
                    </Box>
                    <Select
                      allowDeselect={false}
                      clearable={false}
                      searchable={false}
                      sx={{ flex: 1 }}
                      classNames={classes}
                      value={cartTaxType}
                      onChange={(v) =>
                        setCartTaxType(v as TCartProductDiscount)
                      }
                      data={["flat", "percent"]}
                    />
                  </Popover.Dropdown>
                </Popover>
              </SimpleGrid>

              <SimpleGrid cols={3} p={5}>
                <Button
                  size="xs"
                  variant="gradient"
                  disabled={
                    !cartProducts ||
                    cartProducts.length <= 0 ||
                    !customerUnpaidOrders ||
                    !customerUnpaidOrders.data ||
                    customerUnpaidOrders.data.length <= 0
                  }
                  fullWidth
                  onClick={() => {
                    console.log(cartProducts);
                    attachToPendingOrder();
                  }}
                >
                  Attach to pending order
                </Button>
                <Button
                  size="xs"
                  variant="gradient"
                  disabled={
                    !cartProducts ||
                    cartProducts.length <= 0 ||
                    isTotalNegative ||
                    hasPaid === "unpaid"
                  }
                  fullWidth
                  onClick={() => {
                    console.log(cartProducts);
                    confirmOrderAndPrint();
                  }}
                >
                  Confirm & print
                </Button>
                <Button
                  size="xs"
                  variant="danger"
                  fullWidth
                  onClick={() => {
                    console.log("resetting");
                    resetCart();
                    setCartDiscountInput(0);
                    setCartDiscountType("flat");

                    setCartTaxInput(0);
                    setCartTaxType("percent");
                  }}
                >
                  Reset cart
                </Button>
              </SimpleGrid>
            </Stack>
          </Flex>
        </BasicSection>
      </Box>
    </>
  );
};

export default PosCart;
