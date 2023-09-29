import BasicSection from "@/components/sections/BasicSection";
import { useCategoryQuery } from "@/queries/categoryQuery";

import {
  CloseButton,
  Image,
  Text,
  Box,
  Grid,
  Group,
  Center,
  Button,
  UnstyledButton,
  Stack,
  SimpleGrid,
  useMantineTheme,
  ActionIcon,
  rem,
  NumberInput,
  NumberInputHandlers,
  Badge,
  AspectRatio,
  Select,
} from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import { CompWithChildren, IdField, Product } from "@/types/defaultTypes";
import { useElementSize } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosClient from "@/lib/axios";
import { TbChevronUp, TbChevronDown } from "react-icons/tb";
import WithCustomerLayout from "@/layouts/WithCustomerLayout";
import { useAppSelector } from "@/hooks/storeConnectors";
import { notifications } from "@mantine/notifications";

const getPercentage = (prcnt: number, outOf: number) => outOf * (prcnt / 100);

type FlatOrPercent = "flat" | "percent";
const PosContents = () => {
  const categories = useCategoryQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [cartDiscountType, setCartDiscountType] =
    useState<FlatOrPercent>("flat");
  const [cartTaxType, setCartTaxType] = useState<FlatOrPercent>("flat");
  const [cartDiscountInput, setCartDiscountInput] = useState(0);
  const [cartTaxInput, setCartTaxInput] = useState(0);

  const { data: products } = useQuery<{
    data: Array<Product & { id: IdField; stock_count: number }>;
  }>({
    queryKey: ["pos", selectedCategoryId],
    queryFn: () => {
      return axiosClient.v1.api
        .get(`products?categoryId=${selectedCategoryId}`)
        .then((res) => res.data);
    },
    // enabled: Boolean(selectedCategoryId),
  });

  useEffect(() => {
    console.log(JSON.stringify(products), "from products filter");
  }, [products]);

  const { ref, width } = useElementSize();
  const isArr = Array.isArray(categories) && categories.length > 0;
  const theme = useMantineTheme();
  const [cartProducts, setCartProducts] = useState<
    Array<
      Product & { id: IdField; cartProductCount: number; stock_count: number }
    >
  >([]);
  useEffect(() => {
    console.log(products, "categories");
  }, [products]);
  const removeFromCart = (sku: string) => {
    setCartProducts((cps) => {
      const withoutProduct = cps.filter((cp) => cp.sku !== sku);
      console.log({ withoutProduct });
      return withoutProduct;
    });
  };
  const cartTotalWithoutTaxDiscount = cartProducts.reduce((sum, item) => {
    sum += Number(item.price) * Number(item.cartProductCount);
    return sum;
  }, 0);
  const cartDiscount =
    cartDiscountType === "flat"
      ? cartDiscountInput
      : getPercentage(cartDiscountInput, cartTotalWithoutTaxDiscount);
  const cartTotalWithDiscount = cartTotalWithoutTaxDiscount - cartDiscount;
  const cartTax =
    cartTaxType === "flat"
      ? cartTaxInput
      : getPercentage(cartTaxInput, cartTotalWithDiscount);
  const cartTotal = cartTotalWithDiscount - cartTax;

  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);

  const confirmOrderAndSubmit = async () => {
    if (!selectedCustomer) {
      notifications.show({
        message: "Please select a customer first",
        color: "red",
      });
      throw new Error("No selected Customer");
    }
    const submitData = {
      customer_id: selectedCustomer.id,
      total: cartTotal,
      discount: cartDiscount,
      tax: cartTax,
      note: "Note",
      status: "Onhold",
      type: "product",
      items: cartProducts.map((cartProduct) => ({
        id: cartProduct.id,
        sku: cartProduct.sku,
        quantity: cartProduct.cartProductCount,
        total_price:
          Number(cartProduct.price) * Number(cartProduct.cartProductCount),
        unit_price: Number(cartProduct.price),
        problem_details: "",
        service_type: "",
      })),
    };
    console.log(submitData, " submit Data ");

    const serverData = await axiosClient.v1.api
      .post("orders", submitData)
      .then((res) => res.data);
    console.log(serverData, "Server response data");
  };

  return (
    <Grid h={"100%"}>
      <Grid.Col span={8} ref={ref}>
        <Stack>
          <BasicSection p={"xs"} title="Select category">
            <Carousel
              sx={{ maxWidth: `${width}px`, flex: 1 }}
              slideSize="25%"
              height={60}
              align="start"
              slideGap="xs"
              controlsOffset="sm"
              loop
              slidesToScroll={4}
              styles={{
                control: {
                  "&[data-inactive]": {
                    opacity: 0,
                    cursor: "default",
                  },
                },
              }}
            >
              {isArr
                ? categories.map((category, categoryIdx) => {
                    const colors = [
                      "#69d2e7",
                      "#a7dbd8",
                      "#e0e4cc",
                      "#f38630",
                      "#fa6900",
                    ];
                    const isCatActive = selectedCategoryId == category.id;
                    return (
                      <Carousel.Slide p={"xs"} key={category.id}>
                        <UnstyledButton
                          onClick={() => {
                            setSelectedCategoryId(category.id as string);
                          }}
                          h={"100%"}
                          w={"100%"}
                          sx={{ display: "block" }}
                        >
                          <Center
                            p={5}
                            w={"100%"}
                            h={"100%"}
                            sx={(t) => ({
                              fontWeight: 900,
                              outline: isCatActive ? "2px" : "0px",
                              outlineStyle: "dashed",
                              outlineColor: theme.colors.red,
                              outlineOffset: 2,
                              backgroundColor:
                                colors[categoryIdx % colors.length],
                              borderRadius: t.other.radius.primary,
                              boxShadow: t.shadows.md,
                              //   border: `1px solid ${t.black}`,
                            })}
                          >
                            <Text>{category.name}</Text>
                          </Center>
                        </UnstyledButton>
                      </Carousel.Slide>
                    );
                  })
                : null}
            </Carousel>
          </BasicSection>

          <BasicSection>
            <SimpleGrid
              cols={1}
              breakpoints={[
                { minWidth: "xs", cols: 2 },
                { minWidth: "md", cols: 3 },
                { minWidth: "lg", cols: 5 },
                { minWidth: "xl", cols: 6 },
              ]}
            >
              {products &&
              Array.isArray(products.data) &&
              products.data.length > 0
                ? products.data.map((product) => {
                    const productInCart = cartProducts.find(
                      (cp) => cp.sku === product.sku
                    );

                    return (
                      <Box
                        p={theme.spacing.sm}
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                          borderRadius: theme.other.radius.primary,
                          boxShadow: theme.shadows.md,
                          border: `1px solid black`,
                        }}
                        key={product.sku}
                      >
                        <Image
                          styles={{
                            figure: {
                              height: "100%",
                            },
                            imageWrapper: {
                              height: "100%",
                            },
                          }}
                          withPlaceholder
                          h={80}
                          src={"#"}
                        ></Image>
                        <Text weight={600} align="center">
                          {product.name}
                        </Text>

                        <Group
                          noWrap
                          fz={"xs"}
                          fw={"bold"}
                          mt={"auto"}
                          position="apart"
                        >
                          <Text>Unit : {product.stock_count}</Text>
                          <Text>Price : {product.price}</Text>
                        </Group>
                        {productInCart ? (
                          <Button
                            variant="danger"
                            onClick={() => {
                              removeFromCart(product.sku);
                            }}
                          >
                            Remove
                          </Button>
                        ) : (
                          <Button
                            variant="gradient"
                            disabled={product.stock_count <= 0}
                            onClick={() => {
                              setCartProducts((p) => [
                                ...p,
                                {
                                  ...product,
                                  cartProductCount: 1,
                                },
                              ]);
                            }}
                          >
                            Add
                          </Button>
                        )}
                      </Box>
                    );
                  })
                : "No products or category selected"}
            </SimpleGrid>
          </BasicSection>
        </Stack>
      </Grid.Col>
      <Grid.Col span={4}>
        <BasicSection px={"sm"} title="Cart">
          <Stack spacing={8}>
            {cartProducts.map((cartProduct) => {
              const max = cartProduct.stock_count;
              const cartPrice =
                Number(cartProduct.price) * cartProduct.cartProductCount;
              return (
                <Box
                  sx={{
                    backgroundColor: theme.fn.lighten(
                      theme.other.colors.primary.background,
                      0.95
                    ),
                    borderRadius: theme.other.radius.primary,
                    boxShadow: theme.shadows.sm,
                    border: `1px solid black`,
                  }}
                  key={cartProduct.sku}
                  py={5}
                  px={5}
                >
                  <Group>
                    <CartNumberInput
                      defaultValue={cartProduct.cartProductCount}
                      max={max}
                      min={1}
                      onUpdate={(count) => {
                        setCartProducts((cp) => {
                          const desiredCp = cp.find(
                            (c) => c.sku === cartProduct.sku
                          );
                          if (desiredCp) {
                            desiredCp.cartProductCount = count;
                          }
                          return [...cp];
                        });
                      }}
                    />
                    <Stack spacing={2} fw={"bold"}>
                      <Text mr={"auto"}>{cartProduct.name}</Text>
                      <Text fz={10} mr={"auto"}>
                        Unit Price : {cartProduct.price}
                      </Text>
                    </Stack>
                    <AspectRatio ratio={1} w={rem(40)}>
                      <Image
                        styles={{
                          figure: {
                            height: "100%",
                          },
                          imageWrapper: {
                            height: "100%",
                          },
                        }}
                        withPlaceholder
                        h={"100%"}
                        src={"#"}
                      ></Image>
                    </AspectRatio>

                    <Stack ml={"auto"} spacing={2}>
                      <Badge size="lg" variant="filled">
                        {cartPrice.toFixed(2)}
                      </Badge>
                    </Stack>
                    <CloseButton
                      onClick={() => {
                        removeFromCart(cartProduct.sku);
                      }}
                      variant="filled"
                      color="red"
                    />
                  </Group>
                </Box>
              );
            })}
          </Stack>
          <Stack
            spacing={3}
            p={5}
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: theme.fn.lighten(
                theme.other.colors.primary.background,
                0.9
              ),
            }}
          >
            <SimpleGrid
              cols={3}
              sx={{
                fontSize: "10px",
                fontWeight: 600,
                gap: 2,
              }}
            >
              <Text>
                <Badge fullWidth size="xs" color="green" variant="filled">
                  Discount : {cartDiscount} ৳
                </Badge>
              </Text>
              <Text>
                <Badge fullWidth size="xs" color="red" variant="filled">
                  Tax : {cartTax} ৳
                </Badge>
              </Text>
              <Text>
                <Badge variant="gradient" fullWidth>
                  Total : {cartTotal}
                </Badge>
              </Text>
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <NumberInput
                hideControls
                placeholder="Discount"
                value={cartDiscountInput}
                onChange={(v) => {
                  setCartDiscountInput(Number(v));
                }}
              />
              <Select
                value={cartDiscountType}
                onChange={(v) => setCartDiscountType(v as FlatOrPercent)}
                data={["flat", "percent"]}
              />
            </SimpleGrid>
            <SimpleGrid cols={2}>
              <NumberInput
                hideControls
                placeholder="Tax"
                value={cartTaxInput}
                onChange={(v) => {
                  setCartTaxInput(Number(v));
                }}
              />
              <Select
                value={cartTaxType}
                onChange={(v) => setCartTaxType(v as FlatOrPercent)}
                data={["flat", "percent"]}
              />
            </SimpleGrid>
            <SimpleGrid cols={2} p={5}>
              <Button
                variant="gradient"
                disabled={!cartProducts || cartProducts.length <= 0}
                fullWidth
                onClick={() => {
                  console.log(cartProducts);
                  confirmOrderAndSubmit();
                }}
              >
                Confirm Order
              </Button>
              <Button
                variant="danger"
                disabled={!cartProducts || cartProducts.length <= 0}
                fullWidth
                onClick={() => {
                  setCartProducts([]);
                }}
              >
                Reset cart
              </Button>
            </SimpleGrid>
          </Stack>
        </BasicSection>
      </Grid.Col>
    </Grid>
  );
};

const CartNumberInput = ({
  max,
  min,
  onUpdate,
  defaultValue,
}: {
  max: number;
  min: number;
  onUpdate: (v: number) => void;
  defaultValue: number;
}) => {
  const handlers = useRef<NumberInputHandlers>();
  // const [count, setCount] = useState(0);
  // const increment = () => {
  //     setCount((p) => Math.min(p + 1, max));
  // };
  // const decrement = () => {
  //     setCount((p) => Math.max(p - 1, min));
  // };
  return (
    <Group spacing={3} sx={{ userSelect: "none" }}>
      {/* <UnstyledButton onClick={increment}>
                <TbChevronUp />
            </UnstyledButton> */}
      <ActionIcon
        // w={"100%"}
        mih={0}
        h={"auto"}
        disabled={defaultValue <= min}
        variant={"gradient"}
        onClick={() => handlers.current?.decrement()}
      >
        –
      </ActionIcon>
      <NumberInput
        hideControls
        value={defaultValue}
        onChange={(val) => onUpdate(Math.min(Number(val), max))}
        handlersRef={handlers}
        max={max}
        min={min}
        step={1}
        styles={(theme) => ({
          input: {
            fontWeight: "bold",
            height: rem(20),
            minHeight: 0,
            border: "1px solid",
            borderColor: theme.other.colors.primary.background,
            padding: 0,
            textAlign: "center",
          },
        })}
      />
      {/* <span>{count}</span>
            <UnstyledButton onClick={decrement}>
                <TbChevronDown />
            </UnstyledButton> */}

      <ActionIcon
        // w={"100%"}
        mih={0}
        h={"auto"}
        variant={"gradient"}
        disabled={defaultValue >= max}
        onClick={() => handlers.current?.increment()}
      >
        +
      </ActionIcon>
    </Group>
  );
};

const PosPage = () => {
  return (
    <WithCustomerLayout>
      <PosContents />
    </WithCustomerLayout>
  );
};

export default PosPage;
