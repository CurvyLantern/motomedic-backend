import { ProductCard } from "@/components/products/card/ProductCard";
import { ScrollWrapper } from "@/components/scroller";
import { useAppDispatch, useAppSelector } from "@/hooks/storeConnectors";
import axiosClient from "@/lib/axios";
import {
  OrderProduct,
  addCustomerOrderProduct,
} from "@/store/slices/CustomerSlice";
import { faker } from "@faker-js/faker";
import {
  ActionIcon,
  Box,
  Button,
  Grid,
  Group,
  Image,
  MultiSelect,
  NumberInput,
  NumberInputHandlers,
  Paper,
  ScrollArea,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { TbArrowRight, TbSearch, TbTrash, TbArrowLeft } from "react-icons/tb";
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
const CreateOrderPage = () => {
  const [orders, setOrders] = useState(_mock);

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <p>Create an order</p>
      <Grid sx={{ flex: 1 }}>
        <Grid.Col span={8}>
          <LeftSide></LeftSide>
        </Grid.Col>

        <Grid.Col span={4}>
          <RightSide />
        </Grid.Col>
      </Grid>
    </Box>
  );
};

const LeftSide = () => {
  const theme = useMantineTheme();
  return (
    <Paper
      p={"xs"}
      sx={{
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.xs,
      }}
    >
      <Group align="initial">
        <TextInput
          icon={<TbSearch size="1.1rem" />}
          radius="md"
          size="md"
          rightSection={
            <ActionIcon
              size={32}
              radius="xl"
              color={theme.primaryColor}
              variant="filled"
            >
              {theme.dir === "ltr" ? (
                <TbArrowRight size="1.1rem" />
              ) : (
                <TbArrowLeft size="1.1rem" />
              )}
            </ActionIcon>
          }
          placeholder="Search product"
          rightSectionWidth={42}
        />
        {/* categories */}
        <MultiSelect
          data={[
            "React",
            "Angular",
            "Svelte",
            "Vue",
            "Riot",
            "Next.js",
            "Blitz.js",
          ]}
          //   label="Your favorite frameworks/libraries"
          placeholder="Pick all that you like"
          size="md"
          searchable
          nothingFound="Nothing found"
        />
        {/* brands */}
        <MultiSelect
          data={[
            "React",
            "Angular",
            "Svelte",
            "Vue",
            "Riot",
            "Next.js",
            "Blitz.js",
          ]}
          //   label="Your favorite frameworks/libraries"
          placeholder="Pick all that you like"
          size="md"
          searchable
          nothingFound="Nothing found"
        />
      </Group>
      <Box sx={{ flex: 1, position: "relative", display: "flex" }}>
        <ScrollWrapper>
          <Box
            p={"md"}
            sx={() => ({
              position: "relative",
              height: "100%",
              display: "flex",
              overflow: "hidden",
            })}
          >
            <ScrollArea>
              <OrderView />
            </ScrollArea>
          </Box>
        </ScrollWrapper>
      </Box>
    </Paper>
  );
};

const OrderView = () => {
  const url = "v1/product/all";
  const { data: products } = useQuery({
    queryFn: () => axiosClient.get(url).then((res) => res.data.data),
    queryKey: ["products"],
  });
  const isArr = Array.isArray(products);
  return (
    <SimpleGrid
      cols={1}
      breakpoints={[
        { minWidth: "xs", cols: 2 },
        { minWidth: "sm", cols: 3 },
        { minWidth: "md", cols: 4 },
      ]}
    >
      {isArr
        ? products.map((product) => {
            return (
              <ProductCard
                withDetails={false}
                key={product.id}
                product={product}
                count={0}
              />
            );
          })
        : null}
    </SimpleGrid>
  );
};

const RightSide = () => {
  const theme = useMantineTheme();
  const productOrders = useAppSelector(
    (s) => s.customer.selectedCustomer?.orders.products
  );
  console.log({ rightSide: productOrders });
  //   const productOrders = [""];
  const isArr = Array.isArray(productOrders);
  const subTotal = productOrders.reduce((acc, item) => {
    const sum = Number(item.count) * Number(item.price);
    console.log(sum, " sum ");
    return acc + sum;
  }, 0);
  const tax = 0;
  const discount = 0;
  console.log(productOrders, " right side ");
  return (
    <Paper
      p={"xs"}
      sx={{
        height: "100%",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.xs,
      }}
    >
      <Stack spacing={2}>
        {isArr
          ? productOrders.map((po) => {
              return <OrderItem key={po.id} orderProduct={po} />;
            })
          : "no orders"}
      </Stack>
      <Box mt={"auto"}>
        <Table verticalSpacing="xs" fontSize="xs">
          <tbody>
            <tr>
              <td>Sub Total</td>
              <td>{subTotal}</td>
            </tr>
            <tr>
              <td>Discount</td>
              <td>{discount}</td>
            </tr>
            <tr>
              <td>Tax</td>
              <td>{tax}</td>
            </tr>
          </tbody>
        </Table>
        <SimpleGrid cols={1} breakpoints={[{ minWidth: "lg", cols: 3 }]}>
          <NumberInput placeholder="discount" />
          <NumberInput placeholder="tax" />
          <Button>Place Order</Button>
        </SimpleGrid>
      </Box>
    </Paper>
  );
};

const OrderItem = ({ orderProduct }: { orderProduct: OrderProduct }) => {
  const dispatch = useAppDispatch();
  const onCountChange = (count: number) => {
    dispatch(addCustomerOrderProduct({ ...orderProduct, count }));
  };
  console.log(orderProduct, "order");
  return (
    <Paper shadow="xs">
      <Group align="center" noWrap>
        <StackInput onCountChange={onCountChange} />
        <Box w={30} h={30} bg={"green"}>
          <Image src="asd"></Image>
        </Box>
        <Group sx={{ flex: 1 }}>
          <Text fw={600} size="md">
            {orderProduct.product_name}
          </Text>
          <Text size="md">unit : {orderProduct.count}</Text>
          <Text size="md">price : {orderProduct.price}</Text>
          <p>12</p>
          <p>10</p>
        </Group>
        <Button variant="danger">
          <TbTrash />
        </Button>
      </Group>
    </Paper>
  );
};
const StackInput = ({
  onCountChange,
}: {
  onCountChange: (n: number) => void;
}) => {
  const [value, setValue] = useState<number | "">(0);
  const handlers = useRef<NumberInputHandlers>();
  console.log("value", value);
  useEffect(() => {
    onCountChange(Number(value));
  }, [value, onCountChange]);
  return (
    <Stack spacing={5}>
      <ActionIcon
        size={20}
        variant="default"
        onClick={() => handlers.current?.decrement()}
      >
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => setValue(val)}
        handlersRef={handlers}
        max={10}
        min={0}
        step={1}
        p={0}
        styles={{ input: { padding: 0, width: rem(20), textAlign: "center" } }}
      />

      <ActionIcon
        size={20}
        variant="default"
        onClick={() => handlers.current?.increment()}
      >
        +
      </ActionIcon>
    </Stack>
  );
};

export default CreateOrderPage;
