/* eslint-disable @typescript-eslint/no-explicit-any */
import { CrudDeleteButton } from "@/components/common/CrudOptions";
import Invoice1 from "@/components/invoice/Invoice1";
import { TCartProductDiscount } from "@/components/pos/PosCartProduct";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import currencyToWords from "@/utils/CurrencyToWords";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Group,
  Modal,
  NumberInput,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPrinter } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";
import { TbDotsVertical, TbTrash } from "react-icons/tb";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const useOrderItemQuery = (id?: number | string) => {
  const { data: order } = useQuery({
    queryKey: ["get/order", id],
    queryFn: async () => {
      return await axiosClient.v1.api
        .get(`orders/${id}`)
        .then((res) => res.data);
    },
  });
  return order;
};

const invalidateOrderItemQuery = (id?: number | string) => {
  qc.invalidateQueries(["get/order", id]);
};

const ServiceOrderItemPage = () => {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => invoiceRef.current,
    suppressErrors: true,
    onAfterPrint() {
      // setOrderDataFromServer(null);
    },
  });
  const { id } = useParams() as { id?: number };
  const order = useOrderItemQuery(id);
  const [selectedProductOrderItem, setSelectedProductOrderItem] =
    useState<any>(null);
  const [productChangeOptions, setProductChangeOptions] = useState<{
    productIncrement: number;
    productDecrement: number;
    productSku: string;
    discount: number;
    discountType: string;
  }>({
    productIncrement: 0,
    productDecrement: 0,
    productSku: "",
    discount: 0,
    discountType: "flat",
  });
  const [orderChangeOptions, setOrderChangeOptions] = useState({
    // paymentStatus: "unpaid",
    payAmount: 0,
    overallDiscount: 0,
    overallTax: 0,
    overallDiscountType: "flat",
    overallTaxType: "flat",
    timeStatus: "waiting",
  });

  const resetOrderChangeOptions = () => {
    setOrderChangeOptions({
      // paymentStatus: "unpaid",
      payAmount: 0,
      overallDiscount: 0,
      overallTax: 0,
      overallDiscountType: "flat",
      overallTaxType: "flat",
      timeStatus: "waiting",
    });
  };

  const [
    productOrderItemModalOpened,
    { open: openProductOrderItemModal, close: closeProductOrderItemModal },
  ] = useDisclosure(false);

  useEffect(() => {
    if (!productOrderItemModalOpened) {
      setProductChangeOptions({
        discount: 0,
        discountType: "flat",
        productDecrement: 0,
        productIncrement: 0,
        productSku: "",
      });
    }
  }, [productOrderItemModalOpened]);

  const effectCountRef = useRef(0);
  const previousOrderData = useRef({
    overall_discount: 0,
    overall_discount_type: 0,
    overall_tax: 0,
    overall_tax_type: 0,
    // payment_status: "unpaid",
    paid_amount: 0,
    time_status: "waiting",
  });
  useEffect(() => {
    if (!order || !order.data) return;
    // if (effectCountRef.current > 1) return;
    const {
      paid_amount,
      overall_discount,
      overall_discount_type,
      overall_tax,
      overall_tax_type,
      // payment_status,
      time_status,
    } = order.data;
    // const paid_amount_number = Number(paid_amount);
    // if (previousOrderData.current.paid_amount !== paid_amount_number) {
    //   previousOrderData.current.paid_amount = paid_amount_number;
    //   setOrderChangeOptions((p) => {
    //     return {
    //       ...p,
    //       payAmount: paid_amount_number,
    //     };
    //   });
    // }

    if (previousOrderData.current.time_status !== time_status) {
      previousOrderData.current.time_status = time_status;
      setOrderChangeOptions((p) => {
        return {
          ...p,
          timeStatus: time_status,
        };
      });
    }

    // if (previousOrderData.current.payment_status !== payment_status) {
    //   previousOrderData.current.payment_status = payment_status;
    //   setOrderChangeOptions((p) => {
    //     return {
    //       ...p,
    //       paymentStatus: payment_status,
    //     };
    //   });
    // }

    if (previousOrderData.current.overall_discount !== overall_discount) {
      previousOrderData.current.overall_discount = overall_discount;
      setOrderChangeOptions((p) => {
        return {
          ...p,
          overallDiscount: overall_discount,
        };
      });
    }

    if (previousOrderData.current.overall_discount !== overall_discount) {
      previousOrderData.current.overall_discount = overall_discount;
      setOrderChangeOptions((p) => {
        return {
          ...p,
          overallDiscount: overall_discount,
        };
      });
    }
    if (
      previousOrderData.current.overall_discount_type !== overall_discount_type
    ) {
      previousOrderData.current.overall_discount_type = overall_discount_type;
      setOrderChangeOptions((p) => {
        return {
          ...p,
          overallDiscountType: overall_discount_type,
        };
      });
    }
    if (previousOrderData.current.overall_tax !== overall_tax) {
      previousOrderData.current.overall_tax = overall_tax;
      setOrderChangeOptions((p) => {
        return {
          ...p,
          overallTax: overall_tax,
        };
      });
    }
    if (previousOrderData.current.overall_tax_type !== overall_tax_type) {
      previousOrderData.current.overall_tax_type = overall_tax_type;
      setOrderChangeOptions((p) => {
        return {
          ...p,
          overallTaxType: overall_tax_type,
        };
      });
    }

    console.log({ orderData });
    effectCountRef.current++;
  }, [order]);

  if (!order || !order.data) {
    return (
      <Center h={"100%"}>
        <Stack>
          <Text>No order was found</Text>
          <Text>
            <Link to={"/service"}>Return to service page</Link>
          </Text>
          <Text>
            <Link to={"/"}>Return to Home page</Link>
          </Text>
        </Stack>
      </Center>
    );
  }
  const orderData = order.data;
  const productOrderItems = orderData.productOrderItems;
  const serviceOrderItems = orderData.serviceOrderItems;

  const onOrderOptionsUpdate = (successCb: (a: any) => void) => {
    axiosClient.v1.api
      .put(`orders/${id}`, orderChangeOptions)
      .then((data) => {
        successCb(data);
      })
      .catch((err) => {
        notifications.show({
          message: err.message || err.data.message,
          color: "red",
        });
      })
      .finally(() => {
        invalidateOrderItemQuery(id);
      });
  };

  const onConfirmAndPrint = () => {
    handlePrint();
  };

  const isAllInputDisabled =
    order && order.data ? order.data.time_status === "finished" : false;

  console.log({ isAllInputDisabled: order.data });
  console.log(orderData, "orderData");
  const paidAmount = Number(orderData.paid_amount);
  const due = orderData.total_price - paidAmount;

  const payablesDisabled = orderData.payment_status === "paid";
  return (
    <>
      <Invoice1
        order={order && order.data ? order.data : null}
        ref={invoiceRef}
      />

      <BasicSection
        headerRightElement={
          <ActionIcon
            variant="outline"
            color="blue"
            onClick={onConfirmAndPrint}
          >
            <IconPrinter size={20} />
          </ActionIcon>
        }
      >
        {/* <div>ServiceOrderItemPage {JSON.stringify(order)}</div> */}

        <Box
          component="form"
          sx={{
            display: "contents",
          }}
        >
          <Box
            sx={{
              border: 0,
              display: "contents",
            }}
            component="fieldset"
            disabled={isAllInputDisabled}
          >
            <Container>
              <Stack>
                <Group align="flex-start">
                  <Box>
                    <Title order={4}>Order ID : {orderData.id}</Title>
                    <Text>
                      {" "}
                      Started at :{" "}
                      {format(new Date(orderData.created_at), "dd/MM/yyyy")}
                    </Text>

                    <Text>
                      Overall Discount : {orderData.overall_discount}
                      {orderData.overall_discount_type === "flat" ? "৳" : "%"}
                    </Text>
                    <Text>
                      Overall Tax : {orderData.overall_tax}
                      {orderData.tax_discount_type === "flat" ? "৳" : "%"}
                    </Text>
                    <Text>
                      Order Status :{" "}
                      <Badge size="xl" variant="filled" fw={600}>
                        {orderData.time_status}
                      </Badge>
                    </Text>

                    <Text fz={"112%"}>
                      Total Price : {orderData.total_price}৳
                    </Text>
                    <Text fz={"112%"}>Paid Amount : {paidAmount}৳</Text>
                    <Text fz={"112%"}>Due : {due}৳</Text>
                  </Box>
                  <Box mr={"auto"}>
                    <Title order={4}>
                      Customer Name : {orderData.customer.name}
                    </Title>
                    <Text>Customer Phone : {orderData.customer.phone}</Text>
                    <Text>Customer email : {orderData.customer.email}</Text>
                    <Text>Customer address : {orderData.customer.address}</Text>
                  </Box>
                  <Box>
                    <Text
                      sx={(t) => ({
                        fontSize: 60,
                        borderRadius: t.other.radius.primary,
                        color: "white",
                        textTransform: "uppercase",
                        padding: t.spacing.xs,
                      })}
                      bg={
                        orderData.payment_status === "paid"
                          ? "green"
                          : orderData.payment_status === "unpaid"
                          ? "gray"
                          : "red"
                      }
                      variant="filled"
                    >
                      {orderData.payment_status}
                    </Text>
                  </Box>
                </Group>
                <Flex
                  gap={"md"}
                  direction={{
                    base: "column",
                    md: "row",
                  }}
                  align="flex-start"
                >
                  <Box>
                    <Text
                      align="center"
                      fw={600}
                      fz={"lg"}
                      sx={(t) => ({
                        background: t.colors.gray[2],
                      })}
                    >
                      Items
                    </Text>

                    <Stack>
                      <Box>
                        <Modal
                          title={
                            selectedProductOrderItem ? (
                              <>
                                <Text>
                                  Current quantity{" "}
                                  {selectedProductOrderItem.quantity}
                                </Text>
                                <Text>
                                  Current discount{" "}
                                  {selectedProductOrderItem.discount}{" "}
                                  {selectedProductOrderItem.discount_type}
                                </Text>
                              </>
                            ) : (
                              ""
                            )
                          }
                          centered
                          opened={productOrderItemModalOpened}
                          onClose={closeProductOrderItemModal}
                        >
                          <Stack h={"30vh"}>
                            <SimpleGrid cols={2}>
                              <NumberInput
                                min={0}
                                onChange={(v) => {
                                  setProductChangeOptions((p) => ({
                                    ...p,
                                    productIncrement: Number(v),
                                  }));
                                }}
                                value={productChangeOptions.productIncrement}
                                label="Increment"
                              />
                              <NumberInput
                                disabled={payablesDisabled}
                                min={0}
                                onChange={(v) => {
                                  setProductChangeOptions((p) => ({
                                    ...p,
                                    productDecrement: Number(v),
                                  }));
                                }}
                                value={productChangeOptions.productDecrement}
                                label="Decrement"
                              />
                              <NumberInput
                                disabled={payablesDisabled}
                                label="Discount"
                                value={productChangeOptions.discount}
                                onChange={(v) => {
                                  setProductChangeOptions((p) => {
                                    return {
                                      ...p,
                                      discount: Number(v),
                                    };
                                  });
                                }}
                              />
                              <Select
                                disabled={payablesDisabled}
                                label="Discount Type"
                                value={productChangeOptions.discountType}
                                onChange={(v) => {
                                  setProductChangeOptions((p) => ({
                                    ...p,
                                    discountType: v ? v : "flat",
                                  }));
                                }}
                                data={["flat", "percent"]}
                              />
                            </SimpleGrid>
                            <SimpleGrid cols={2}>
                              <Button
                                onClick={() => {
                                  const confirm =
                                    window.confirm("Are you sure ?");
                                  if (confirm) {
                                    axiosClient.v1.api
                                      .put(
                                        `orders/${id}/productOrderItems/${
                                          selectedProductOrderItem
                                            ? selectedProductOrderItem.id
                                            : ""
                                        }`,
                                        productChangeOptions
                                      )
                                      .then((data) => {
                                        notifications.show({
                                          message: "Product updated",
                                          color: "green",
                                        });
                                        closeProductOrderItemModal();
                                      })
                                      .catch((err) => {
                                        notifications.show({
                                          message:
                                            err.message || err.data.message,
                                          color: "red",
                                        });
                                      })
                                      .finally(() => {
                                        invalidateOrderItemQuery(
                                          selectedProductOrderItem
                                            ? selectedProductOrderItem.id
                                            : ""
                                        );
                                      });
                                  }
                                }}
                                variant="success"
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="danger"
                                onClick={() => {
                                  closeProductOrderItemModal();
                                }}
                              >
                                Close
                              </Button>
                            </SimpleGrid>
                          </Stack>
                        </Modal>
                        <Table
                          withBorder
                          sx={(t) => ({
                            "& thead tr th": {
                              fontSize: t.fontSizes.sm,
                              fontWeight: 600,
                              textAlign: "center",
                            },
                          })}
                        >
                          <caption>
                            <Text>Product associated with this order</Text>
                          </caption>
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Product Name</th>
                              <th>Quantity</th>
                              <th>Unit price</th>
                              <th>Total Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {productOrderItems.length > 0 ? (
                              productOrderItems.map((prod, pIdx) => {
                                return (
                                  <tr key={pIdx}>
                                    <td>{pIdx + 1}</td>
                                    <td>
                                      {prod.product.name ?? "No name found"}
                                    </td>
                                    <td>{prod.quantity}</td>
                                    <td>{prod.unit_price}</td>
                                    <td>{prod.total_price}</td>
                                    <td>
                                      <Group>
                                        <ActionIcon
                                          onClick={() => {
                                            setProductChangeOptions((p) => ({
                                              ...p,
                                              productSku: prod.product_sku,
                                            }));
                                            setSelectedProductOrderItem(prod);
                                            openProductOrderItemModal();
                                          }}
                                          fz={"md"}
                                          size={"md"}
                                          variant="filled"
                                          radius={"lg"}
                                        >
                                          <TbDotsVertical />
                                        </ActionIcon>
                                        <CrudDeleteButton onDelete={() => {}} />
                                      </Group>
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={6} align="center">
                                  No Products
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Box>
                      <Box>
                        <Table
                          withBorder
                          sx={(t) => ({
                            "& thead tr th": {
                              fontSize: t.fontSizes.sm,
                              fontWeight: 600,
                              textAlign: "center",
                            },
                          })}
                        >
                          <caption>
                            <Text>Services associated with this order</Text>
                          </caption>
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Service Type</th>
                              <th>Unit price</th>
                              <th>Total Price</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {serviceOrderItems.length > 0 ? (
                              serviceOrderItems.map((s, sIdx) => {
                                return (
                                  <tr key={sIdx}>
                                    <td>{sIdx + 1}</td>
                                    <td>
                                      {s.service_type.name ?? "No name found"}
                                    </td>
                                    <td>{s.unit_price}</td>
                                    <td>{s.total_price}</td>
                                    <td>
                                      <CrudDeleteButton onDelete={() => {}} />
                                    </td>
                                  </tr>
                                );
                              })
                            ) : (
                              <tr>
                                <td colSpan={5} align="center">
                                  No Services
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </Table>
                      </Box>
                      <Divider />
                      <Stack>
                        <Box>
                          <Text fw={600}>
                            Amount in words :{" "}
                            <Text span fw={400}>
                              {currencyToWords(orderData.total_price)}
                            </Text>
                          </Text>
                          <Text fw={600}>
                            Amount :{" "}
                            <Text span fw={400}>
                              {orderData.total_price}৳
                            </Text>
                          </Text>
                        </Box>
                      </Stack>
                    </Stack>
                  </Box>

                  <Box
                    w={{
                      base: "100%",
                      md: "auto",
                    }}
                    // sx={{
                    //   width: "100%",
                    // }}
                  >
                    <Text
                      align="center"
                      fw={600}
                      fz={"lg"}
                      sx={(t) => ({
                        background: t.colors.gray[2],
                      })}
                    >
                      Controls
                    </Text>
                    <Stack>
                      <SimpleGrid cols={2} p={"xs"}>
                        <Select
                          onChange={(v) => {
                            setOrderChangeOptions((prev) => ({
                              ...prev,
                              timeStatus: v ? v : "",
                            }));
                          }}
                          searchable={false}
                          label="Order status"
                          clearable={false}
                          allowDeselect={false}
                          value={orderChangeOptions.timeStatus}
                          data={["waiting", "running", "finished"]}
                        />

                        <NumberInput
                          disabled={payablesDisabled}
                          label={`Pay amount ( max:${due} )`}
                          defaultValue={0}
                          max={due}
                          min={0}
                          value={orderChangeOptions.payAmount}
                          onChange={(v) => {
                            setOrderChangeOptions((prev) => ({
                              ...prev,
                              payAmount: Number(v),
                            }));
                          }}
                        />
                        {/* <Select
                          value={orderChangeOptions.paymentStatus}
                          onChange={(v) => {
                            setOrderChangeOptions((p) => ({
                              ...p,
                              paymentStatus: v ? v : "",
                            }));
                          }}
                          searchable={false}
                          label="Payment status"
                          clearable={false}
                          allowDeselect={false}
                          defaultValue={orderData.payment_status}
                          data={["paid", "unpaid"]}
                        /> */}
                        {/* <Button
                    onClick={() => {
                      onOrderOptionsUpdate(() => {
                        notifications.show({
                          message: "Payment status has been updated",
                          color: "green",
                        });
                      });
                    }}
                  >
                    Update
                  </Button> */}

                        <NumberInput
                          disabled={payablesDisabled}
                          value={orderChangeOptions.overallDiscount}
                          onChange={(v) => {
                            setOrderChangeOptions((p) => ({
                              ...p,
                              overallDiscount: Number(v),
                            }));
                          }}
                          label="Overall discount"
                          placeholder="Add discount in number"
                        />
                        <Select
                          disabled={payablesDisabled}
                          value={orderChangeOptions.overallDiscountType}
                          onChange={(v) => {
                            setOrderChangeOptions((p) => ({
                              ...p,
                              overallDiscountType: String(v),
                            }));
                          }}
                          allowDeselect={false}
                          clearable={false}
                          label="Discount type"
                          searchable={false}
                          sx={{ flex: 1 }}
                          defaultValue="flat"
                          data={["flat", "percent"]}
                        />
                        {/* <Button
                    onClick={() => {
                      onOrderOptionsUpdate(() => {
                        notifications.show({
                          message: "Discount has been updated",
                          color: "green",
                        });
                      });
                    }}
                  >
                    Update
                  </Button> */}
                        <NumberInput
                          disabled={payablesDisabled}
                          value={orderChangeOptions.overallTax}
                          onChange={(v) => {
                            setOrderChangeOptions((p) => ({
                              ...p,
                              overallTax: Number(v),
                            }));
                          }}
                          label="Overall tax"
                          placeholder="Add tax in number"
                        />
                        <Select
                          disabled={payablesDisabled}
                          value={orderChangeOptions.overallTaxType}
                          onChange={(v) => {
                            setOrderChangeOptions((p) => ({
                              ...p,
                              overallTaxType: v ? v : "",
                            }));
                          }}
                          allowDeselect={false}
                          clearable={false}
                          label="Tax type"
                          searchable={false}
                          sx={{ flex: 1 }}
                          defaultValue="flat"
                          data={["flat", "percent"]}
                        />
                        {/* <Button
                    onClick={() => {
                      onOrderOptionsUpdate(() => {
                        notifications.show({
                          message: "Tax updated",
                          color: "green",
                        });
                      });
                    }}
                  >
                    Update
                  </Button> */}
                      </SimpleGrid>
                      <Box px={"xs"}>
                        <Button
                          fullWidth
                          onClick={() => {
                            onOrderOptionsUpdate(() => {
                              notifications.show({
                                message: "Options updated",
                                color: "green",
                              });

                              resetOrderChangeOptions();
                            });
                          }}
                        >
                          Update
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </Flex>
              </Stack>
            </Container>
          </Box>
        </Box>
      </BasicSection>
    </>
  );
};

export default ServiceOrderItemPage;
