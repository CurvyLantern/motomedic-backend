import {
  Box,
  Button,
  Flex,
  Group,
  Image,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useEffect, useMemo, useRef } from "react";

import { Product } from "@/types/defaultTypes";
import { usePosContext } from "./PosContext";

import JsBarcode from "jsbarcode";

type TPosProductCard = {
  product: Product;
};

const MyBarcode = ({ value = "" }: { value: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    JsBarcode(canvasRef.current, value, {
      height: 30,
      width: 2,
      textPosition: "bottom",
    });
  }, [value]);
  return <canvas ref={canvasRef}></canvas>;
};

const PosProductCard = ({ product }: TPosProductCard) => {
  const { cartProducts, removeCartProduct, addToCart } = usePosContext();

  const productInCart = useMemo(() => {
    return cartProducts.find((cp) => cp.sku === product.sku);
  }, [cartProducts, product]);

  const maxNameLen = Infinity;
  const formattedProductName =
    typeof product.name === "string"
      ? product.name.length > maxNameLen
        ? `${product.name.substring(0, maxNameLen)}...`
        : product.name
      : "Name not found";

  return (
    <Box
      p={rem(5)}
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        gap: theme.spacing.xs,
        borderRadius: theme.other.radius.primary,
        boxShadow: theme.shadows.sm,
        border: `1px solid black`,
        position: "relative",
        minWidth: 150,
        width: 150,
      })}
      key={product.sku}
    >
      <Text
        sx={(theme) => ({
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
        })}
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
        height={40}
        src={"#"}
      ></Image>
      <Text weight={500} fz={rem(10)} align="center">
        {formattedProductName}
      </Text>

      <Stack
        sx={(theme) => ({
          marginTop: "auto",
          gap: theme.spacing.xs,
        })}
      >
        {product.barcode ? (
          <MyBarcode value={product.barcode} />
        ) : (
          <Text fz={12} align="center">
            Barcode N/A
          </Text>
        )}
        <Flex mt={"auto"} align={"center"} gap={"xs"}>
          <Image
            styles={{
              figure: {
                height: "100%",
              },
              imageWrapper: {
                height: "100%",
              },
            }}
            height={20}
            width={20}
            src={"#"}
          />
          <Text fz={10}>{product.brand.name}</Text>
        </Flex>
        <Group noWrap fz={rem(10)} fw={"500"} position="apart">
          {/* <Text>Unit : {product.stock_count}</Text> */}
          <Text>Price : {product.price?.selling_price ?? 0} ৳</Text>
        </Group>
        {productInCart ? (
          <Button
            size="xs"
            variant="danger"
            onClick={() => {
              removeCartProduct(product.sku);
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
              console.log(product, " from add to product ");
              const stock_count = product.stock_count;
              const unit_price = product.price.selling_price;
              const quantity = 1;
              const total_price = unit_price * quantity;
              const isVariationProduct = product.type === "variation";
              // const state = true;
              // if (state) {
              //   return;
              // }

              addToCart({
                type: product.type,
                name: product.name,
                quantity,
                discount: 0,
                discountType: "flat",
                product_id: isVariationProduct
                  ? (
                      product as unknown as { product_id: string }
                    ).product_id.toString()
                  : product.id.toString(),
                product_variation_id: isVariationProduct
                  ? product.id.toString()
                  : "",
                sku: product.sku,
                stock_count,
                total_price,
                unit_price,
              });
            }}
          >
            Add to cart
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default PosProductCard;
