import BlankInvoice from "@/components/invoice/BlankInvoice";
import Invoice1 from "@/components/invoice/Invoice1";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import { invalidateOrderQuery, useOrderQuery } from "@/queries/orderQuery";
import {
  Badge,
  Box,
  Button,
  Center,
  Checkbox,
  Divider,
  Grid,
  Group,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";

const CreateBillingPage = () => {
  const [AmountInWords, setAmountInWords] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  const orders = useOrderQuery("unpaid");

  const printElmRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printElmRef.current,
  });
  const [isPaid, setIsPaid] = useState(false);

  const updateOrder = async () => {
    if (!selectedOrder) {
      throw new Error("No order has been selected");
    }
    if (!isPaid) {
      throw new Error("Not paid");
    }

    const serverResponse = await axiosClient.v1.api
      .put(`orders/${selectedOrder.id}`, { status: "paid" })
      .then((data) => data);

    qc.invalidateQueries(["get/orders/unpaid"]);

    console.log(serverResponse, "serverResponse");
  };

  return (
    <Grid h={"100%"}>
      <Grid.Col span={8}>
        <BasicSection>
          <Box sx={{ position: "relative", height: "100%" }}>
            {selectedOrder ? (
              <Invoice1
                ref={printElmRef}
                order={selectedOrder}
                amountInWords={AmountInWords}
              />
            ) : (
              // <Center h={"100%"}>Select an order to create Invoice</Center>
              <BlankInvoice ref={printElmRef} />
            )}
          </Box>
        </BasicSection>
      </Grid.Col>
      <Grid.Col span={4}>
        <Stack h={"100%"}>
          <BasicSection
            sx={(t) => ({
              boxShadow: t.shadows.sm,
              padding: t.spacing.xs,
              minHeight: "50%",
              height: "50%",
              display: "flex",
              flexDirection: "column",
            })}
          >
            <Text align="center" variant="gradient" fw={"bold"}>
              Select Order
            </Text>

            {orders && Array.isArray(orders.data) && orders.data.length > 0 ? (
              orders.data.map((order) => {
                return (
                  <React.Fragment key={order.id}>
                    <Box
                      py={"xs"}
                      sx={{
                        display: "flex",
                        gap: rem(10),
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Text opacity={0.9} fw={"bold"} fz={"md"}>
                          {order.id}
                        </Text>
                      </Box>
                      <Box mx={"auto"} sx={{}}>
                        <Text opacity={0.9} fw={"bold"} fz={"sm"}>
                          <Badge variant="outline" color="yellow">
                            {order.status}
                          </Badge>
                          {/* <Badge variant="outline" color="green">
                        Completed
                      </Badge> */}
                        </Text>
                      </Box>
                      <Box>
                        {selectedOrder && selectedOrder.id === order.id ? (
                          <Button
                            onClick={() => {
                              setIsPaid(false);
                              setSelectedOrder(null);
                            }}
                            compact
                            size="xs"
                            variant="gradient"
                          >
                            Unselect
                          </Button>
                        ) : (
                          <Button
                            onClick={() => {
                              setIsPaid(false);
                              setSelectedOrder(order);
                            }}
                            compact
                            size="xs"
                            variant="gradient"
                          >
                            Select
                          </Button>
                        )}
                      </Box>
                    </Box>
                    <Divider />
                  </React.Fragment>
                );
              })
            ) : (
              <Center h={"100%"}>No orders to show 😔</Center>
            )}
          </BasicSection>

          <BasicSection>
            <Stack>
              <TextInput
                label="Amount In words"
                disabled={!selectedOrder}
                placeholder="Amount in words"
                value={AmountInWords}
                onChange={(evt) => {
                  setAmountInWords(evt.currentTarget.value);
                }}
              />
              <Group noWrap position="apart">
                <Checkbox
                  label="Paid"
                  disabled={!selectedOrder}
                  placeholder="Payment Status"
                  value={isPaid}
                  onChange={(evt) => setIsPaid(evt.currentTarget.checked)}
                />

                <Button
                  onClick={async () => {
                    try {
                      if (selectedOrder) {
                        await updateOrder();
                      }
                      handlePrint();
                      setSelectedOrder(null);
                      invalidateOrderQuery();
                    } catch (error) {
                      notifications.show({
                        message: error.message,
                        color: "red",
                      });
                    }
                  }}
                >
                  Print
                </Button>
              </Group>
            </Stack>
          </BasicSection>
        </Stack>
      </Grid.Col>
    </Grid>
  );
};

export default CreateBillingPage;
