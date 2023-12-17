/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseDrawer from "@/components/drawer/BaseDrawer";
import ScrollWrapper2 from "@/components/scrollWrapper/ScrollWrapper2";
import BasicSection from "@/components/sections/BasicSection";
import { useAppSelector } from "@/hooks/storeConnectors";
import { useProductSearch } from "@/hooks/useProductSearch";
import WithCustomerLayout, {
  SelectCustomerButton,
  SelectCustomerDetails,
  SelectCustomerPendingOrders,
} from "@/layouts/WithCustomerLayout";
import axiosClient from "@/lib/axios";
import { qc } from "@/providers/QueryProvider";
import {
  invalidateMechanicQuery,
  useMechanicQuery,
} from "@/queries/mechanicQuery";
import { useServiceTypesAllQuery } from "@/queries/serviceTypeQuery";
import { useUserQuery } from "@/queries/userQuery";
import {
  useBrandSelectData,
  useCategorySelectData,
} from "@/utils/selectFieldsData";
import {
  ActionIcon,
  Box,
  Button,
  Center,
  Flex,
  Grid,
  Group,
  Modal,
  MultiSelect,
  NumberInput,
  Pagination,
  Select,
  SelectItem,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  rem,
} from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { TbCheck, TbEye } from "react-icons/tb";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import React, { useMemo, useState } from "react";
import { TbShoppingCart, TbTrash, TbUserCog } from "react-icons/tb";
import { Product } from "@/types/defaultTypes";
import useCustomForm from "@/hooks/useCustomForm";
import { invalidateProductAllQuery } from "@/queries/productQuery";
import {
  invalidateCustomerUnpaidOrderQuery,
  invalidateOrderQuery,
  useCustomerUnpaidOrderQuery,
  useOrderQuery,
} from "@/queries/orderQuery";
import { Link, useNavigate, useRoutes } from "react-router-dom";

const CreateServicePage = () => {
  return (
    <WithCustomerLayout>
      {/* <ServiceFieldWrapper /> */}
      <ServicePage2 />
    </WithCustomerLayout>
  );
};

const ServicePage2 = () => {
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);
  const [allProblemDetails, allProblemDetailsHandler] = useListState<string>(
    []
  );
  const customerUnpaidOrders = useCustomerUnpaidOrderQuery();
  const [packageInputValue, setPackageInputValue] = useState<string[]>([]);
  const seller = useUserQuery();

  const servicePackages = useServiceTypesAllQuery();
  const selectDataServicePackages = useMemo(() => {
    return servicePackages && servicePackages.data
      ? servicePackages.data.map((v) => ({
          label: v.name,
          value: v.id.toString(),
        }))
      : [];
  }, [servicePackages]);

  const onConfirm = async () => {
    try {
      if (!selectedCustomer || !selectedCustomer.id) {
        throw new Error("No customer is selected");
      }
      if (!seller) {
        throw new Error("Not logged in or something went wrong");
      }
      const data = {
        customer_id: selectedCustomer.id,
        service_type_ids: packageInputValue,
        seller_id: seller.id,
        problem_details: allProblemDetails.join(" "),
      };

      console.log(data, "data");

      await axiosClient.v1.api.post("orders/service", data).then((data) => {
        console.log(data.data, "from server");
        allProblemDetailsHandler.setState([]);
        setPackageInputValue([]);

        notifications.show({
          message: "Service added as waiting",
          color: "green",
        });
      });
    } catch (error) {
      notifications.show({
        // @ts-expect-error error type is not defined
        message: error.message || error.data.message,
        color: "red",
      });
    } finally {
      invalidateMechanicQuery();
      invalidateOrderQuery();
      invalidateCustomerUnpaidOrderQuery();
    }
  };

  const onAttachOrder = async () => {
    try {
      if (!selectedCustomer || !selectedCustomer.id) {
        throw new Error("No customer is selected");
      }
      if (!seller) {
        throw new Error("Not logged in or something went wrong");
      }
      const pendingOrder = customerUnpaidOrders
        ? customerUnpaidOrders.data[0]
        : "";
      if (!pendingOrder) {
        throw new Error("Order wasn't found");
      }

      const data = {
        order_id: pendingOrder.id,
        service_type_ids: packageInputValue,
        seller_id: seller.id,
        problem_details: allProblemDetails.join(" "),
      };

      console.log(data, "data");

      await axiosClient.v1.api.put("orders/service", data).then((data) => {
        console.log(data.data, "from server");
        allProblemDetailsHandler.setState([]);
        setPackageInputValue([]);

        notifications.show({
          message: "Service attached to pending order",
          color: "green",
        });
      });
    } catch (error) {
      notifications.show({
        // @ts-expect-error error type is not defined
        message: error.message || error.data.message,
        color: "red",
      });
    } finally {
      invalidateMechanicQuery();
      invalidateOrderQuery();
      invalidateCustomerUnpaidOrderQuery();
    }
  };

  return (
    <Grid h={"100%"}>
      <Grid.Col
        span={12}
        lg={6}
        sx={{ display: "flex", flexDirection: "column", gap: 5 }}
      >
        <ServiceInfo
          packageInputValue={packageInputValue}
          onChangePackageInput={(v) => setPackageInputValue(v)}
          selectPackageData={selectDataServicePackages}
          onEnterProblemDetail={allProblemDetailsHandler.append}
        />

        <ServiceDetails
          packageInputValue={packageInputValue}
          onConfirm={onConfirm}
          onAttachOrder={onAttachOrder}
          allProblemDetails={allProblemDetails}
          onProblemDelete={(idx: number) => {
            allProblemDetailsHandler.remove(idx);
          }}
        />
      </Grid.Col>
      <Grid.Col span={12} lg={6}>
        <AllServicesTab />
      </Grid.Col>
    </Grid>
  );
};

const AllServicesTab = () => {
  return (
    <>
      <BasicSection title="Services">
        <Tabs defaultValue="waiting">
          <Tabs.List>
            <Tabs.Tab value="waiting">Waiting</Tabs.Tab>
            <Tabs.Tab value="running">Running</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="waiting">
            <ServicesWaiting />
          </Tabs.Panel>
          <Tabs.Panel value="running">
            <ServicesRunning />
          </Tabs.Panel>
        </Tabs>
      </BasicSection>

      {/* <Drawer

      >
        <Drawer.Header>
          <Drawer.CloseButton variant="danger">
            <TbX />
          </Drawer.CloseButton>
        </Drawer.Header>
      </Drawer> */}
    </>
  );
};

const ServicesRunning = () => {
  const navigate = useNavigate();
  const user = useUserQuery();
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<{
    service_order_id: number;
  } | null>(null);

  const waitingServices = useOrderQuery(undefined, "running");

  const mechanics = useMechanicQuery("idle");
  const [posDrawerOpened, { close: closePosDrawer, open: openPosDrawer }] =
    useDisclosure(false);
  const [
    mechanicModalOpened,
    { close: closeMechanicModal, open: openMechanicModal },
  ] = useDisclosure(false);

  const categoryForSelectInput = useCategorySelectData();
  const brandSelectData = useBrandSelectData();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const { products, handleSearchInputChange, searchQuery, searchLoading } =
    useProductSearch(selectedCategoryId, selectedBrandId);

  const [addedProductList, productListOptions] = useListState<{
    name: string;
    sku: string;
    quantity: number;
    stock_count: number;
    unit_price: number;
    type: "product" | "variation";
  }>([]);
  const onProductAdd = (order: any) => {
    // console.log(, " object order");
    setSelectedServiceOrder({ service_order_id: order.id });
    openPosDrawer();
  };

  const onMechanicAdd = (order: any) => {
    setSelectedServiceOrder({ service_order_id: order.id });
    openMechanicModal();
  };

  const addProductsToService = async () => {
    const productOrderItems = addedProductList.map((p) => ({
      product_sku: p.sku,
      quantity: p.quantity,
      unit_price: p.unit_price,
      type: p.type,
    }));

    console.log(productOrderItems, "from added product service");
    if (!String(selectedServiceOrder?.service_order_id)) {
      notifications.show({
        message: "No order has been selected probably a bug",
        color: "red",
      });
      return;
    }

    const orderId = selectedServiceOrder?.service_order_id;

    const submitData = {
      order_id: orderId,
      seller_id: user?.id.toString(),
      items: productOrderItems,
    };

    const serverData = await axiosClient.v1.api
      .put(`orders/pos`, submitData)
      .then((res) => {
        console.log(res.data, " data from server response ");
        productListOptions.setState([]);
        notifications.show({
          message: "Products have been added successfully",
          color: "green",
        });
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
          message: error.message || error.data.message,
          color: "red",
        });
      })
      .finally(() => {
        invalidateProductAllQuery();
      });

    // await axiosClient.v1.api
    //   .put(
    //     `orders/${selectedServiceOrder?.service_order_id}/addProductOrders`,
    //     {
    //       productOrderItems,
    //       seller_id: user?.id,
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data, " data from server response ");
    //     productListOptions.setState([]);
    //     notifications.show({
    //       message: "Products have been added successfully",
    //       color: "green",
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     notifications.show({
    //       message: error.message || error.data.message,
    //       color: "red",
    //     });
    //   })
    //   .finally(() => {
    //     invalidateProductAllQuery();
    //   });
  };

  const addMechanicToServiceOrder = async (mid: number | string) => {
    await axiosClient.v1.api
      .put(`orders/${selectedServiceOrder?.service_order_id}/addMechanic`, {
        mechanic_id: mid,
      })
      .then((data) => {
        console.log(data, "from mechanic add to service");
        notifications.show({
          message: "Mechanic has been added successfully",
          color: "green",
        });
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
          message: error.message,
          color: "red",
        });
      })
      .finally(() => {
        invalidateMechanicQuery();
        invalidateOrderQuery();
      });
  };

  return (
    <>
      <Modal centered opened={mechanicModalOpened} onClose={closeMechanicModal}>
        <Table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mechanics?.data?.map((mechanic, mechanicIdx) => {
              return (
                <tr key={mechanic.id}>
                  <td>{mechanicIdx + 1}</td>
                  <td>{mechanic.name}</td>
                  <td>{mechanic.phone}</td>
                  <td>{mechanic.status}</td>
                  <td>
                    <Button
                      onClick={() => {
                        addMechanicToServiceOrder(mechanic.id);
                      }}
                      compact
                      size="xs"
                    >
                      Assign
                    </Button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal>
      <BaseDrawer
        position="top"
        opened={posDrawerOpened}
        onClose={closePosDrawer}
        size={"100%"}
      >
        <BasicSection>
          <SimpleGrid
            cols={1}
            breakpoints={[
              {
                minWidth: "md",
                cols: 2,
              },
            ]}
          >
            <Box sx={{ height: "90vh", position: "relative" }}>
              <ScrollWrapper2>
                <Stack>
                  <SimpleGrid
                    cols={1}
                    breakpoints={[
                      {
                        minWidth: "sm",
                        cols: 1,
                      },
                      {
                        minWidth: "md",
                        cols: 3,
                      },
                    ]}
                  >
                    <TextInput
                      value={searchQuery}
                      onChange={(event) =>
                        handleSearchInputChange(event.currentTarget.value)
                      }
                      size="xs"
                      placeholder="Search product by name or sku or barcode "
                      styles={{
                        input: {
                          "::placeholder": {
                            color: "#555",
                          },
                        },
                      }}
                    />
                    <Select
                      size="xs"
                      dropdownComponent="div"
                      clearable
                      value={selectedCategoryId}
                      onChange={(v) =>
                        setSelectedCategoryId(v === null ? "" : v)
                      }
                      styles={{
                        input: {
                          "::placeholder": {
                            color: "#555",
                          },
                        },
                      }}
                      placeholder="Select Category"
                      searchable
                      nothingFound="No category found"
                      data={categoryForSelectInput}
                    />
                    <Select
                      size="xs"
                      dropdownComponent="div"
                      clearable
                      value={selectedBrandId}
                      onChange={(v) => setSelectedBrandId(v === null ? "" : v)}
                      styles={{
                        input: {
                          "::placeholder": {
                            color: "#555",
                          },
                        },
                      }}
                      placeholder="Select Brand"
                      searchable
                      nothingFound="No brand found"
                      data={brandSelectData}
                    />
                  </SimpleGrid>
                  <Stack>
                    {products.paginatedProducts.map((p) => {
                      return (
                        <Box
                          sx={(t) => ({
                            border: "1px solid",
                            borderRadius: t.radius.sm,
                            padding: rem("5px"),
                            display: "flex",
                            flexWrap: "wrap",
                            gap: t.spacing.xs,
                            backgroundColor: t.colors.yellow[2],
                          })}
                          key={p.sku}
                        >
                          <Stack spacing={"3px"} fz={"sm"}>
                            <Text>Name : {p.name}</Text>
                            <Text>Sku : {p.sku}</Text>
                            <Text>Barcode : {p.barcode}</Text>
                            <Text>
                              Price : {p.price.selling_price}৳ x (
                              {p.stock_count}
                              pcs)
                            </Text>
                          </Stack>
                          <Button
                            disabled={Boolean(
                              p.stock_count <= 0 ||
                                addedProductList.find(
                                  (item) => item.sku === p.sku
                                )
                            )}
                            onClick={() => {
                              productListOptions.append({
                                name: p.name,
                                sku: p.sku,
                                stock_count: p.stock_count,
                                quantity: 0,
                                unit_price: p.price.selling_price,
                                type: p.type,
                              });
                            }}
                            ml={"auto"}
                            variant="success"
                            compact
                            size="sm"
                          >
                            <TbCheck />
                          </Button>
                          <Button
                            disabled={Boolean(
                              p.stock_count <= 0 ||
                                !addedProductList.find(
                                  (item) => item.sku === p.sku
                                )
                            )}
                            onClick={() => {
                              productListOptions.filter(
                                (item) => item.sku !== p.sku
                              );
                            }}
                            variant="danger"
                            compact
                            size="sm"
                          >
                            <TbTrash />
                          </Button>
                        </Box>
                      );
                    })}

                    <Center mt={"auto"}>
                      <Pagination
                        total={products.totalPageCount}
                        value={products?.currentPage}
                        onChange={products?.handlePageChange}
                      />
                    </Center>
                  </Stack>
                </Stack>
              </ScrollWrapper2>
            </Box>
            <Box sx={{ height: "90vh", position: "relative" }}>
              <ScrollWrapper2>
                <BasicSection>
                  {addedProductList.length > 0 ? (
                    <Stack h={"100%"}>
                      <Table withBorder>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedProductList.map((p, pIdx) => {
                            return (
                              <tr key={p.sku}>
                                <td>{pIdx + 1}</td>
                                <td>
                                  <Text>{p.name}</Text>
                                </td>
                                <td>
                                  <NumberInput
                                    onChange={(v) => {
                                      productListOptions.setItemProp(
                                        pIdx,
                                        "quantity",
                                        Number(v)
                                      );
                                    }}
                                    value={p.quantity}
                                    min={1}
                                    max={p.stock_count}
                                  />
                                </td>
                                <td>
                                  <Button
                                    variant="danger"
                                    size="xs"
                                    onClick={() => {
                                      productListOptions.remove(pIdx);
                                    }}
                                  >
                                    <TbTrash />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                      <Group mt={"auto"} align="center" position="center">
                        <Button
                          onClick={addProductsToService}
                          variant="success"
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => {
                            const confirm = window.confirm("Are you sure ?");
                            if (confirm) {
                              productListOptions.setState([]);
                            }
                          }}
                          variant="danger"
                        >
                          Remove
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Center h={"100%"}>No product has been added</Center>
                  )}
                </BasicSection>
              </ScrollWrapper2>
            </Box>
          </SimpleGrid>
        </BasicSection>
      </BaseDrawer>
      <ServiceListTable
        type="running"
        onProductAdd={onProductAdd}
        onMechanicAdd={onMechanicAdd}
        rowData={(waitingServices && waitingServices.data) ?? []}
      />
    </>
  );
};

const ServicesWaiting = () => {
  const user = useUserQuery();
  const [selectedServiceOrder, setSelectedServiceOrder] = useState<{
    service_order_id: number;
  } | null>(null);

  const waitingServices = useOrderQuery(undefined, "waiting");

  const mechanics = useMechanicQuery("idle");
  console.log(mechanics, " mechanics");

  console.log(waitingServices, "waitingServices");
  const [posDrawerOpened, { close: closePosDrawer, open: openPosDrawer }] =
    useDisclosure(false);
  const [
    mechanicModalOpened,
    { close: closeMechanicModal, open: openMechanicModal },
  ] = useDisclosure(false);

  const categoryForSelectInput = useCategorySelectData();
  const brandSelectData = useBrandSelectData();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const { products, handleSearchInputChange, searchQuery, searchLoading } =
    useProductSearch(selectedCategoryId, selectedBrandId);

  const [addedProductList, productListOptions] = useListState<{
    name: string;
    sku: string;
    quantity: number;
    stock_count: number;
    unit_price: number;
    type: "product" | "variation";
  }>([]);
  const onProductAdd = (order: any) => {
    // console.log(, " object order");
    setSelectedServiceOrder({ service_order_id: order.id });
    openPosDrawer();
  };

  const onMechanicAdd = (order: any) => {
    setSelectedServiceOrder({ service_order_id: order.id });
    openMechanicModal();
  };

  const addProductsToService = async () => {
    const productOrderItems = addedProductList.map((p) => ({
      product_sku: p.sku,
      quantity: p.quantity,
      unit_price: p.unit_price,
      type: p.type,
    }));

    console.log(productOrderItems, "from added product service");
    if (!String(selectedServiceOrder?.service_order_id)) {
      notifications.show({
        message: "No order has been selected probably a bug",
        color: "red",
      });
      return;
    }

    const orderId = selectedServiceOrder?.service_order_id;

    const submitData = {
      order_id: orderId,
      seller_id: user?.id.toString(),
      items: productOrderItems,
    };

    const serverData = await axiosClient.v1.api
      .put(`orders/pos`, submitData)
      .then((res) => {
        console.log(res.data, " data from server response ");
        productListOptions.setState([]);
        notifications.show({
          message: "Products have been added successfully",
          color: "green",
        });
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
          message: error.message || error.data.message,
          color: "red",
        });
      })
      .finally(() => {
        invalidateProductAllQuery();
      });

    // await axiosClient.v1.api
    //   .put(
    //     `orders/${selectedServiceOrder?.service_order_id}/addProductOrders`,
    //     {
    //       productOrderItems,
    //       seller_id: user?.id,
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data, " data from server response ");
    //     productListOptions.setState([]);
    //     notifications.show({
    //       message: "Products have been added successfully",
    //       color: "green",
    //     });
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //     notifications.show({
    //       message: error.message || error.data.message,
    //       color: "red",
    //     });
    //   })
    //   .finally(() => {
    //     invalidateProductAllQuery();
    //   });
  };

  const addMechanicToServiceOrder = async (mid: number | string) => {
    await axiosClient.v1.api
      .put(`orders/${selectedServiceOrder?.service_order_id}/addMechanic`, {
        mechanic_id: mid,
      })
      .then((data) => {
        console.log(data, "from mechanic add to service");
        notifications.show({
          message: "Mechanic has been added successfully",
          color: "green",
        });
      })
      .catch((error) => {
        console.error(error);
        notifications.show({
          message: error.message,
          color: "red",
        });
      })
      .finally(() => {
        invalidateMechanicQuery();
        invalidateOrderQuery();
      });
  };

  return (
    <>
      <Modal centered opened={mechanicModalOpened} onClose={closeMechanicModal}>
        <Table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mechanics?.data?.map((mechanic, mechanicIdx) => {
              return (
                <tr key={mechanic.id}>
                  <td>{mechanicIdx + 1}</td>
                  <td>{mechanic.name}</td>
                  <td>{mechanic.phone}</td>
                  <td>{mechanic.status}</td>
                  <td>
                    <Button
                      onClick={() => {
                        addMechanicToServiceOrder(mechanic.id);
                      }}
                      compact
                      size="xs"
                    >
                      Assign
                    </Button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal>
      <BaseDrawer
        position="top"
        opened={posDrawerOpened}
        onClose={closePosDrawer}
        size={"100%"}
      >
        <BasicSection>
          <SimpleGrid
            cols={1}
            breakpoints={[
              {
                minWidth: "md",
                cols: 2,
              },
            ]}
          >
            <Box sx={{ height: "90vh" }}>
              <ScrollWrapper2>
                <Stack>
                  <SimpleGrid
                    cols={1}
                    breakpoints={[
                      {
                        minWidth: "sm",
                        cols: 1,
                      },
                      {
                        minWidth: "md",
                        cols: 3,
                      },
                    ]}
                  >
                    <TextInput
                      value={searchQuery}
                      onChange={(event) =>
                        handleSearchInputChange(event.currentTarget.value)
                      }
                      size="xs"
                      placeholder="Search product by name or sku or barcode "
                      styles={{
                        input: {
                          "::placeholder": {
                            color: "#555",
                          },
                        },
                      }}
                    />
                    <Select
                      size="xs"
                      dropdownComponent="div"
                      clearable
                      value={selectedCategoryId}
                      onChange={(v) =>
                        setSelectedCategoryId(v === null ? "" : v)
                      }
                      styles={{
                        input: {
                          "::placeholder": {
                            color: "#555",
                          },
                        },
                      }}
                      placeholder="Select Category"
                      searchable
                      nothingFound="No category found"
                      data={categoryForSelectInput}
                    />
                    <Select
                      size="xs"
                      dropdownComponent="div"
                      clearable
                      value={selectedBrandId}
                      onChange={(v) => setSelectedBrandId(v === null ? "" : v)}
                      styles={{
                        input: {
                          "::placeholder": {
                            color: "#555",
                          },
                        },
                      }}
                      placeholder="Select Brand"
                      searchable
                      nothingFound="No brand found"
                      data={brandSelectData}
                    />
                  </SimpleGrid>
                  <Box sx={{ position: "relative", height: "100%" }}>
                    <Stack>
                      {products.paginatedProducts.map((p) => {
                        return (
                          <Box
                            sx={(t) => ({
                              border: "1px solid",
                              borderRadius: t.radius.sm,
                              padding: rem("5px"),
                              display: "flex",
                              flexWrap: "wrap",
                              gap: t.spacing.xs,
                              backgroundColor: t.colors.yellow[2],
                            })}
                            key={p.sku}
                          >
                            <Stack spacing={"3px"} fz={"sm"}>
                              <Text>Name : {p.name}</Text>
                              <Text>Sku : {p.sku}</Text>
                              <Text>Barcode : {p.barcode}</Text>
                              <Text>
                                Price : {p.price.selling_price}৳ x (
                                {p.stock_count}
                                pcs)
                              </Text>
                            </Stack>
                            <Button
                              disabled={Boolean(
                                p.stock_count <= 0 ||
                                  addedProductList.find(
                                    (item) => item.sku === p.sku
                                  )
                              )}
                              onClick={() => {
                                productListOptions.append({
                                  name: p.name,
                                  sku: p.sku,
                                  stock_count: p.stock_count,
                                  quantity: 0,
                                  unit_price: p.price.selling_price,
                                  type: p.type,
                                });
                              }}
                              ml={"auto"}
                              variant="success"
                              compact
                              size="sm"
                            >
                              <TbCheck />
                            </Button>
                            <Button
                              disabled={Boolean(
                                p.stock_count <= 0 ||
                                  !addedProductList.find(
                                    (item) => item.sku === p.sku
                                  )
                              )}
                              onClick={() => {
                                productListOptions.filter(
                                  (item) => item.sku !== p.sku
                                );
                              }}
                              variant="danger"
                              compact
                              size="sm"
                            >
                              <TbTrash />
                            </Button>
                          </Box>
                        );
                      })}
                      <Center mt={"auto"}>
                        <Pagination
                          total={products.totalPageCount}
                          value={products?.currentPage}
                          onChange={products?.handlePageChange}
                        />
                      </Center>
                    </Stack>
                  </Box>
                </Stack>
              </ScrollWrapper2>
            </Box>
            <Box sx={{ height: "90vh" }}>
              <ScrollWrapper2>
                <BasicSection>
                  {addedProductList.length > 0 ? (
                    <Stack h={"100%"}>
                      <Table withBorder>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Name</th>
                            <th>Quantity</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {addedProductList.map((p, pIdx) => {
                            return (
                              <tr key={p.sku}>
                                <td>{pIdx + 1}</td>
                                <td>
                                  <Text>{p.name}</Text>
                                </td>
                                <td>
                                  <NumberInput
                                    onChange={(v) => {
                                      productListOptions.setItemProp(
                                        pIdx,
                                        "quantity",
                                        Number(v)
                                      );
                                    }}
                                    value={p.quantity}
                                    min={1}
                                    max={p.stock_count}
                                  />
                                </td>
                                <td>
                                  <Button
                                    variant="danger"
                                    size="xs"
                                    onClick={() => {
                                      productListOptions.remove(pIdx);
                                    }}
                                  >
                                    <TbTrash />
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </Table>
                      <Group mt={"auto"} align="center" position="center">
                        <Button
                          onClick={addProductsToService}
                          variant="success"
                        >
                          Add
                        </Button>
                        <Button
                          onClick={() => {
                            const confirm = window.confirm("Are you sure ?");
                            if (confirm) {
                              productListOptions.setState([]);
                            }
                          }}
                          variant="danger"
                        >
                          Remove
                        </Button>
                      </Group>
                    </Stack>
                  ) : (
                    <Center h={"100%"}>No product has been added</Center>
                  )}
                </BasicSection>
              </ScrollWrapper2>
            </Box>
          </SimpleGrid>
        </BasicSection>
      </BaseDrawer>
      <ServiceListTable
        type="waiting"
        onProductAdd={onProductAdd}
        onMechanicAdd={onMechanicAdd}
        rowData={(waitingServices && waitingServices.data) ?? []}
      />
    </>
  );
};

const ServiceListTable = ({
  onProductAdd,
  onMechanicAdd,

  type,
  rowData,
}: {
  rowData: Array<any>;
  onProductAdd: (order: (typeof rowData)[number]) => void;
  onMechanicAdd: (order: (typeof rowData)[number]) => void;

  type: "waiting" | "running";
}) => {
  const timeArr = useMemo(() => {
    return rowData.map((r) => {
      if (type === "running") {
        console.log(r, "started_at");
        return formatDistanceToNow(new Date(r.started_at ?? ""));
      }
      console.log(r, "created_at");
      return formatDistanceToNow(new Date(r.created_at ?? ""));
    });
  }, [rowData]);
  const [searchQuery, setSearchQuery] = useState("");
  const filteredRowData = useMemo(() => {
    if (!searchQuery) return rowData;
    return rowData.filter((row) => {
      const { customer } = row;
      const matched = [customer.name, customer.phone].some((item) =>
        item.trim().toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
      return matched;
    });
  }, [searchQuery, rowData]);
  return (
    <>
      <Flex align="flex-end" direction={"column"}>
        <TextInput
          size="xs"
          sx={{
            width: "50%",
          }}
          value={searchQuery}
          onChange={(evt) => setSearchQuery(evt.target.value)}
          placeholder="Search by customer name or phone"
        />
      </Flex>
      <Table
        sx={{
          "& thead tr th": {
            fontSize: rem(13),
            fontWeight: 500,
            textAlign: "center",
          },
          "& tbody tr td": {
            textAlign: "center",
          },
        }}
      >
        <thead>
          <tr>
            <th>SL</th>
            <th>Duration</th>
            <th>Customer</th>
            <th>Payment Status</th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRowData.map((rowItem, rowIndex) => {
            return (
              <tr key={rowIndex}>
                <td>{rowIndex + 1}</td>
                <td>{timeArr[rowIndex]}</td>
                <td>
                  <Flex direction={"column"} gap={5}>
                    <p>Name : {rowItem?.customer?.name}</p>
                    <p>Phone : {rowItem?.customer?.phone}</p>
                  </Flex>
                </td>
                {/* <td>{rowItem.time_status}</td> */}
                <td>{rowItem.payment_status}</td>
                <td style={{ color: "white" }}>
                  <Center
                    sx={(theme) => ({
                      width: "100%",
                      gap: theme.spacing.sm,
                    })}
                  >
                    <ActionIcon
                      onClick={() => onProductAdd(rowItem)}
                      variant="gradient"
                    >
                      <TbShoppingCart />
                    </ActionIcon>
                    <ActionIcon
                      onClick={() => onMechanicAdd(rowItem)}
                      variant="gradient"
                    >
                      <TbUserCog />
                    </ActionIcon>
                    <ActionIcon
                      component={Link}
                      to={`serviceOrder/${rowItem.id}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      variant="gradient"
                    >
                      <TbEye />
                    </ActionIcon>
                    {/* {type === "waiting" ? null : (
                    <Button
                      component={Link}
                      to={`serviceOrder/${rowItem.id}`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      compact
                      size="xs"
                      variant="gradient"
                    >
                      Done
                    </Button>
                  )} */}
                  </Center>
                </td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </>
  );
};

const ServiceDetails = ({
  allProblemDetails,
  onProblemDelete,
  onConfirm,
  onAttachOrder,
  packageInputValue,
}: {
  allProblemDetails: string[];
  onProblemDelete: (idx: number) => void;
  onConfirm: () => void;
  onAttachOrder: () => void;
  packageInputValue: string[];
}) => {
  // const confirmDisabled = allProblemDetails.length <= 0;
  const confirmDisabled = !Boolean(
    Array.isArray(packageInputValue) && packageInputValue.length > 0
  );
  const customerUnpaidOrders = useCustomerUnpaidOrderQuery();
  const count = customerUnpaidOrders ? customerUnpaidOrders.data.length : 0;
  return (
    <BasicSection
      title="Problems"
      mih={300}
      headerRightElement={
        <>
          {count > 0 ? (
            <Button disabled={confirmDisabled} onClick={onAttachOrder}>
              Attach to pending order
            </Button>
          ) : (
            <Button disabled={confirmDisabled} onClick={onConfirm}>
              Create New Order
            </Button>
          )}
        </>
      }
    >
      <ScrollWrapper2>
        <Stack px={"xs"} spacing={"xs"}>
          {allProblemDetails.length > 0 ? (
            allProblemDetails.map((detail, detailIdx) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    justifyContent: "space-between",
                    textTransform: "capitalize",

                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  key={detailIdx}
                >
                  <p>{detail}</p>
                  <Button
                    onClick={() => {
                      onProblemDelete(detailIdx);
                    }}
                    variant="danger"
                    compact
                    size="xs"
                  >
                    <TbTrash />
                  </Button>
                </Box>
              );
            })
          ) : (
            <Center>Nothing here</Center>
          )}
        </Stack>
      </ScrollWrapper2>
    </BasicSection>
  );
};

const ServiceInfo = ({
  onEnterProblemDetail,
  selectPackageData,
  onChangePackageInput,
  packageInputValue,
}: {
  packageInputValue: string[];
  onChangePackageInput: (v: string[]) => void;
  selectPackageData: SelectItem[];
  onEnterProblemDetail: (detail: string) => void;
}) => {
  const [problemDetailsInput, setProblemDetailsInput] = useState("");
  const onEnterDetails = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!problemDetailsInput) return;
    onEnterProblemDetail(problemDetailsInput);
    setProblemDetailsInput("");
  };

  return (
    <BasicSection
      title="Service Info"
      headerRightElement={
        <Group>
          <SelectCustomerDetails />
          <SelectCustomerButton />
        </Group>
      }
    >
      <Stack>
        {/* <Select
          label="Service Type"
          data={selectPackageData}
          value={packageInputValue}
          onChange={(v) => onChangePackageInput(v ? v : "")}
        /> */}
        <MultiSelect
          label="Select service Type"
          data={selectPackageData}
          value={packageInputValue}
          onChange={(v) => onChangePackageInput(v ? v : [])}
        />
        <form onSubmit={onEnterDetails}>
          <Flex gap={"md"} align="flex-end">
            <TextInput
              sx={{
                flex: 2,
              }}
              label="Problem Details"
              placeholder="Enter Problem Details one by one"
              value={problemDetailsInput}
              onChange={(evt) =>
                setProblemDetailsInput(evt.currentTarget.value)
              }
            />
            <Button
              sx={{
                flex: 1,
              }}
              type="submit"
            >
              Save
            </Button>
          </Flex>
        </form>

        <SelectCustomerPendingOrders />
      </Stack>
    </BasicSection>
  );
};

export default CreateServicePage;
