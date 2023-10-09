import BasicSection from "@/components/sections/BasicSection";
import { useCategoryQuery } from "@/queries/categoryQuery";

import { useAppSelector } from "@/hooks/storeConnectors";
import WithCustomerLayout from "@/layouts/WithCustomerLayout";
import axiosClient from "@/lib/axios";
import { IdField, Product } from "@/types/defaultTypes";
import {
  ActionIcon,
  AspectRatio,
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  Grid,
  Group,
  Image,
  LoadingOverlay,
  NumberInput,
  NumberInputHandlers,
  Pagination,
  ScrollArea,
  Select,
  SimpleGrid,
  Spoiler,
  Stack,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useRef, useState } from "react";

import { useProductSearch } from "@/hooks/useProductSearch";
import { useBrandQuery } from "@/queries/brandQuery";
import { useCustomInputStyles } from "./customInput.styles";
import { ScrollWrapper } from "@/components/scroller";
import { TbCactus } from "react-icons/tb";

const getPercentage = (prcnt: number, outOf: number) => outOf * (prcnt / 100);

type FlatOrPercent = "flat" | "percent";
const PosContents = () => {
  const categories = useCategoryQuery();
  const brands = useBrandQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  // const { data: products } = useQuery<{
  //   data: Array<Product & { id: IdField; stock_count: number }>;
  // }>({
  //   queryKey: ["pos", selectedCategoryId],
  //   queryFn: () => {
  //     return axiosClient.v1.api
  //       .get(`products?categoryId=${selectedCategoryId}`)
  //       .then((res) => res.data);
  //   },
  //   // enabled: Boolean(selectedCategoryId),
  // });

  const { products, handleSearchInputChange, searchQuery, searchLoading } =
    useProductSearch(selectedCategoryId, selectedBrandId);

  const { ref } = useElementSize();
  const categoriesIsArr = Array.isArray(categories) && categories.length > 0;

  const categoryForSelectInput = useMemo(() => {
    return categoriesIsArr
      ? categories
          .map((cat) => {
            return [
              {
                label: cat.name,
                value: String(cat.id),
              },
              ...cat.sub_categories.map((subC) => ({
                label: subC.name,
                value: String(subC.id),
              })),
            ];
          })
          .flat(1)
      : [];
  }, [categories, categoriesIsArr]);
  const brandsForSelectInput = useMemo(() => {
    return brands && Array.isArray(brands.data) && brands.data.length > 0
      ? brands.data.map((brand) => ({
          ...brand,
          label: brand.name,
          value: String(brand.id),
        }))
      : [];
  }, [brands]);

  const [cartProducts, setCartProducts] = useState<
    Array<
      Product & { id: IdField; cartProductCount: number; stock_count: number }
    >
  >([]);
  useEffect(() => {
    console.log(products, "products");
  }, [products]);

  const removeFromCart = (sku: string) => {
    setCartProducts((cps) => {
      const withoutProduct = cps.filter((cp) => cp.sku !== sku);
      console.log({ withoutProduct });
      return withoutProduct;
    });
  };

  return (
    <Grid h={"100%"}>
      <Grid.Col span={8} ref={ref}>
        <Box
          sx={() => ({
            display: "flex",
            width: "100%",
            height: "100%",
            maxHeight: "100%",
            position: "relative",
          })}
        >
          <ScrollWrapper>
            <Box
              p={"0"}
              sx={() => ({
                position: "relative",
                height: "100%",
                display: "flex",
                overflow: "hidden",
              })}
            >
              <ScrollArea
                styles={{
                  viewport: {
                    display: "flex",
                    "& > div": {
                      height: "100%",
                      position: "relative",
                    },
                  },
                }}
                sx={(t) => ({
                  // display: "flex",
                  borderRadius: t.other.radius.primary,
                  flex: 1,
                })}
              >
                <Stack h={"100%"} spacing={"xs"}>
                  {/* Product choose option */}
                  <BasicSection p={"xs"} h={"auto"}>
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput
                          value={searchQuery}
                          onChange={(event) =>
                            handleSearchInputChange(event.currentTarget.value)
                          }
                          size="md"
                          placeholder="Search product by name or sku or barcode "
                          styles={{
                            input: {
                              "::placeholder": {
                                color: "#555",
                              },
                            },
                          }}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Select
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
                          size="md"
                          data={categoryForSelectInput}
                        />
                      </Grid.Col>
                      <Grid.Col span={3}>
                        <Select
                          dropdownComponent="div"
                          clearable
                          value={selectedBrandId}
                          onChange={(v) =>
                            setSelectedBrandId(v === null ? "" : v)
                          }
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
                          size="md"
                          data={brandsForSelectInput}
                        />
                      </Grid.Col>
                    </Grid>
                  </BasicSection>

                  <PosProductsComp
                    searchLoading={searchLoading}
                    products={products}
                    removeFromCart={removeFromCart}
                    setCartProducts={setCartProducts}
                    cartProducts={cartProducts}
                  />
                </Stack>
              </ScrollArea>
            </Box>
          </ScrollWrapper>
        </Box>
      </Grid.Col>

      <Grid.Col span={4}>
        <Cart
          cartProducts={cartProducts}
          setCartProducts={setCartProducts}
          removeFromCart={removeFromCart}
        />
      </Grid.Col>
    </Grid>
  );
};
type PosProductsComp = {
  searchLoading: boolean;
  products?: {
    currentPage: number;
    currentPageSize: number;
    totalProducts: number;
    totalPageCount: number;
    paginatedProducts: Product[];
    handlePageChange: (newPage: number) => void;
    handlePageSizeChange: (newPageSize: number) => void;
  };
  cartProducts: Product[];
  setCartProducts: React.Dispatch<
    React.SetStateAction<
      (Product & {
        id: IdField;
        cartProductCount: number;
        stock_count: number;
      })[]
    >
  >;
  removeFromCart: (sku: string) => void;
};
const PosProductsComp = ({
  searchLoading,
  products,
  cartProducts,
  setCartProducts,
  removeFromCart,
}: PosProductsComp) => {
  const theme = useMantineTheme();
  const posProducts = products ? products.paginatedProducts : [];
  if (
    products &&
    posProducts &&
    Array.isArray(posProducts) &&
    posProducts.length > 0
  ) {
    return (
      <BasicSection p={"xs"}>
        <Stack h={"100%"}>
          <SimpleGrid
            cols={1}
            breakpoints={[
              { minWidth: "xs", cols: 3 },
              { minWidth: "md", cols: 3 },
              { minWidth: "lg", cols: 4 },
              { minWidth: "xl", cols: 5 },
            ]}
          >
            {posProducts.map((product) => {
              const productInCart = cartProducts.find(
                (cp) => cp.sku === product.sku
              );

              const maxNameLen = 12;
              const formattedProductName =
                typeof product.name === "string"
                  ? product.name.length > maxNameLen
                    ? `${product.name.substring(0, maxNameLen)}...`
                    : product.name
                  : "Name not found";

              return (
                <Box
                  p={theme.spacing.xs}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: theme.spacing.xs,
                    borderRadius: theme.other.radius.primary,
                    boxShadow: theme.shadows.sm,
                    border: `1px solid black`,
                    position: "relative",
                  }}
                  key={product.sku}
                >
                  <Text
                    sx={{
                      backgroundColor: theme.colors.yellow[5],
                      textTransform: "uppercase",
                      fontSize: 12,
                      fontWeight: "bold",
                      margin: theme.spacing.xs,
                      paddingInline: 5,
                      paddingBlock: 2,
                      borderRadius: theme.other.radius.primary,
                      position: "absolute",
                      top: 0,
                      left: 0,
                      zIndex: 10,
                      color: "black",
                    }}
                  >
                    Unit : {product.stock_count}
                  </Text>
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
                    h={40}
                    src={"#"}
                  ></Image>
                  <Text weight={500} fz={"xs"} align="center">
                    {formattedProductName}
                  </Text>

                  <Group
                    noWrap
                    fz={"xs"}
                    fw={"500"}
                    mt={"auto"}
                    position="apart"
                  >
                    {/* <Text>Unit : {product.stock_count}</Text> */}
                    <Text>Price : {product.price}</Text>
                  </Group>
                  {productInCart ? (
                    <Button
                      size="xs"
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
                      size="xs"
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
            })}
          </SimpleGrid>
          <Center mt={"auto"}>
            <Pagination
              total={products.totalPageCount}
              value={products?.currentPage}
              onChange={products?.handlePageChange}
            />
          </Center>
        </Stack>
      </BasicSection>
    );
  }
  return (
    <Center h={"100%"}>
      <Box>
        <Text align="center" fz={"xl"}>
          No products here 😔
        </Text>
        <Box sx={{ fontSize: 200 }}>
          <TbCactus />
        </Box>
      </Box>
    </Center>
  );
};

type Cart = {
  cartProducts: (Product & {
    id: IdField;
    cartProductCount: number;
    stock_count: number;
  })[];
  setCartProducts: React.Dispatch<
    React.SetStateAction<
      (Product & {
        id: IdField;
        cartProductCount: number;
        stock_count: number;
      })[]
    >
  >;
  removeFromCart: (sku: string) => void;
};
const Cart = ({ cartProducts, setCartProducts, removeFromCart }: Cart) => {
  const theme = useMantineTheme();
  const { classes } = useCustomInputStyles();
  const selectedCustomer = useAppSelector((s) => s.customer.selectedCustomer);

  const [cartDiscountType, setCartDiscountType] =
    useState<FlatOrPercent>("flat");
  const [cartTaxType, setCartTaxType] = useState<FlatOrPercent>("flat");
  const [cartDiscountInput, setCartDiscountInput] = useState(0);
  const [cartTaxInput, setCartTaxInput] = useState(0);

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

  const confirmOrderAndSubmit = async () => {
    try {
      if (!selectedCustomer) {
        throw new Error("Please select a customer first");
      }
      const submitData = {
        customer_id: selectedCustomer.id,
        total: cartTotal,
        discount: cartDiscount,
        tax: cartTax,
        note: "Note",
        status: "unpaid",
        type: "product",
        items: cartProducts.map((cartProduct) => ({
          id: cartProduct.id,
          sku: cartProduct.sku,
          quantity: cartProduct.cartProductCount,
          total_price:
            Number(cartProduct.price) * Number(cartProduct.cartProductCount),
          unit_price: Number(cartProduct.price),
        })),
      };
      console.log(submitData, " submit Data ");

      const serverData = await axiosClient.v1.api
        .post("orders", submitData)
        .then((res) => res.data);

      notifications.show({
        message: "Order Placed successfully",
        color: "green",
      });
      setCartProducts([]);
      console.log(serverData, "Server response data");
    } catch (error) {
      notifications.show({
        // @ts-expect-error error is not typed
        message: error.message,
        color: "red",
        autoClose: 1500,
      });
      console.error(error);
    }
  };

  return (
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
                  // theme.other.colors.primary.background,
                  theme.colors.yellow[5],
                  0.8
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
        spacing={"xs"}
        p={"xs"}
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
          spacing={"xs"}
          sx={{
            fontSize: "10px",
            fontWeight: 600,
          }}
        >
          <Badge size="lg" fullWidth color="green" variant="filled">
            Discount : {cartDiscount} ৳
          </Badge>

          <Badge size="lg" fullWidth color="red" variant="filled">
            Tax : {cartTax} ৳
          </Badge>

          <Badge size="lg" variant="filled" fullWidth>
            Total : {cartTotal} ৳
          </Badge>
        </SimpleGrid>
        <SimpleGrid cols={2} spacing={"xs"}>
          <NumberInput
            classNames={classes}
            label="Discount"
            hideControls
            placeholder="Discount"
            value={cartDiscountInput}
            onChange={(v) => {
              setCartDiscountInput(Number(v));
            }}
          />
          <Select
            classNames={classes}
            label="Discount Type"
            value={cartDiscountType}
            onChange={(v) => setCartDiscountType(v as FlatOrPercent)}
            data={["flat", "percent"]}
          />
        </SimpleGrid>
        <SimpleGrid cols={2} spacing={"xs"}>
          <NumberInput
            classNames={classes}
            label="Tax"
            hideControls
            placeholder="Tax"
            value={cartTaxInput}
            onChange={(v) => {
              setCartTaxInput(Number(v));
            }}
          />
          <Select
            classNames={classes}
            label="Tax Type"
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
    <Group noWrap spacing={3} sx={{ userSelect: "none" }}>
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
          root: {},
          input: {
            fontWeight: "bold",
            width: 40,
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

/* Old category slider


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







*/
