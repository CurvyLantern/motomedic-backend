import BasicSection from "@/components/sections/BasicSection";
import { useCategoryQuery } from "@/queries/categoryQuery";

import { useAppSelector } from "@/hooks/storeConnectors";
import WithCustomerLayout, {
  SelectCustomerButton,
} from "@/layouts/WithCustomerLayout";
import axiosClient from "@/lib/axios";
import { IdField, Product } from "@/types/defaultTypes";
import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  CloseButton,
  Divider,
  Grid,
  Group,
  Image,
  NumberInput,
  NumberInputHandlers,
  Pagination,
  Popover,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useRef, useState } from "react";

import { ScrollWrapper } from "@/components/scroller";
import { useProductSearch } from "@/hooks/useProductSearch";
import { useBrandQuery } from "@/queries/brandQuery";
import { TbCactus } from "react-icons/tb";
import { useCustomInputStyles } from "./customInput.styles";
import ScrollWrapper2 from "@/components/scrollWrapper/ScrollWrapper2";

const getPercentage = (prcnt: number, outOf: number) => outOf * (prcnt / 100);

type FlatOrPercent = "flat" | "percent";

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
      <Stack h={"100%"}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: rem(12),
            flexWrap: "wrap",
          }}
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
                  minWidth: 150,
                }}
                key={product.sku}
              >
                <Text
                  sx={{
                    backgroundColor: theme.colors.yellow[5],
                    textTransform: "uppercase",
                    fontSize: rem(10),
                    fontWeight: 600,
                    margin: theme.spacing.xs,
                    paddingInline: 5,
                    paddingBlock: 1,
                    borderRadius: theme.other.radius.primary,
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 10,
                    color: "black",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
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
                <Text weight={500} fz={"sm"} align="center">
                  {formattedProductName}
                </Text>

                <Group
                  noWrap
                  fz={rem(10)}
                  fw={"500"}
                  mt={"auto"}
                  position="apart"
                >
                  {/* <Text>Unit : {product.stock_count}</Text> */}
                  <Text>Price : {product.price} ৳</Text>
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
                    Add to cart
                  </Button>
                )}
              </Box>
            );
          })}
        </Box>

        <Center mt={"auto"}>
          <Pagination
            total={products.totalPageCount}
            value={products?.currentPage}
            onChange={products?.handlePageChange}
          />
        </Center>
      </Stack>
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

  const cartSubTotal = cartProducts.reduce((sum, item) => {
    sum += Number(item.price) * Number(item.cartProductCount);
    return sum;
  }, 0);
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

  const isTotalNegative = cartTotal < 0;

  return (
    <BasicSection px={"sm"} title="Cart">
      <Stack spacing={8}>
        {cartProducts.map((cartProduct) => {
          const max = cartProduct.stock_count;
          const cartPrice =
            Number(cartProduct.price) * cartProduct.cartProductCount;
          const cartProductName =
            typeof cartProduct.name === "string"
              ? cartProduct.name.substring(0, 12)
              : "Name not found";
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
                <Stack spacing={2} fw={"500"}>
                  <Text mr={"auto"}>{cartProductName}</Text>
                  <Text fz={10} mr={"auto"}>
                    Unit Price : {cartProduct.price}
                  </Text>
                </Stack>
                {/*

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
                */}

                <Badge size="md" fw={600} ml={"auto"} variant="filled">
                  {cartPrice.toFixed(2)}
                </Badge>
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
        spacing={"5px"}
        p={"xs"}
        sx={{
          boxShadow: "0 0 0 black",
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
            {/* subtotal */}
            <Text>Subtotal </Text>
            <Text align="right">{cartSubTotal}</Text>

            {/* discount */}
            <Text>Discount </Text>
            <Text align="right">{cartDiscount}</Text>

            {/* tax */}
            <Text>Tax </Text>
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

        <SimpleGrid cols={2} spacing={"xs"}>
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
                sx={{ flex: 1 }}
                classNames={classes}
                value={cartDiscountType}
                onChange={(v) => setCartDiscountType(v as FlatOrPercent)}
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
                sx={{ flex: 1 }}
                classNames={classes}
                value={cartTaxType}
                onChange={(v) => setCartTaxType(v as FlatOrPercent)}
                data={["flat", "percent"]}
              />
            </Popover.Dropdown>
          </Popover>
          {/* <NumberInput
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
          /> */}
        </SimpleGrid>
        {/* <SimpleGrid cols={2} spacing={"xs"}>
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
        </SimpleGrid> */}
        <SimpleGrid cols={2} p={5}>
          <Button
            size="xs"
            variant="gradient"
            disabled={
              !cartProducts || cartProducts.length <= 0 || isTotalNegative
            }
            fullWidth
            onClick={() => {
              console.log(cartProducts);
              confirmOrderAndSubmit();
            }}
          >
            Confirm Order
          </Button>
          <Button
            size="xs"
            variant="danger"
            fullWidth
            onClick={() => {
              setCartProducts([]);
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
    <Stack spacing={3} sx={{ userSelect: "none" }}>
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
            fontWeight: 600,
            width: 55,
            height: rem(20),
            minHeight: 0,
            border: "1px solid",
            borderColor: theme.other.colors.primary.background,
            padding: 0,
            textAlign: "center",
          },
        })}
      />
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
    </Stack>
  );
};

const PosPage = () => {
  const categories = useCategoryQuery();
  const brands = useBrandQuery();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");

  const { products, handleSearchInputChange, searchQuery, searchLoading } =
    useProductSearch(selectedCategoryId, selectedBrandId);
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
    <WithCustomerLayout>
      <Grid h={"100%"} m={0} gutter={"xs"}>
        <Grid.Col span={12} sm={"auto"} h={"100%"}>
          <Stack h={"100%"} spacing={"xs"}>
            {/* Product choose option */}
            <BasicSection p={"5px"} h={"auto"}>
              <Grid gutter={"5px"} m={0}>
                <Grid.Col span={12} xs={4} md={6}>
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
                </Grid.Col>
                <Grid.Col span={12} xs={4} md={3}>
                  <Select
                    size="xs"
                    dropdownComponent="div"
                    clearable
                    value={selectedCategoryId}
                    onChange={(v) => setSelectedCategoryId(v === null ? "" : v)}
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
                </Grid.Col>
                <Grid.Col span={12} xs={4} md={3}>
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
                    data={brandsForSelectInput}
                  />
                </Grid.Col>
                <Grid.Col span={6}>
                  <SelectCustomerButton />
                </Grid.Col>
              </Grid>
            </BasicSection>

            <BasicSection>
              <ScrollWrapper2>
                <PosProductsComp
                  searchLoading={searchLoading}
                  products={products}
                  removeFromCart={removeFromCart}
                  setCartProducts={setCartProducts}
                  cartProducts={cartProducts}
                />
              </ScrollWrapper2>
            </BasicSection>
          </Stack>
        </Grid.Col>
        {/* <MediaQuery smallerThan={"md"} styles={{ display: "none" }}> */}
        <Grid.Col span={12} sm={"content"} h={"100%"}>
          <Box miw={"max(30vw,300px)"} h={"100%"}>
            <Cart
              cartProducts={cartProducts}
              setCartProducts={setCartProducts}
              removeFromCart={removeFromCart}
            />
          </Box>
        </Grid.Col>
        {/* </MediaQuery> */}
      </Grid>
    </WithCustomerLayout>
  );
};

export default PosPage;
