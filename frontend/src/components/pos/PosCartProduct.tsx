/* eslint-disable @typescript-eslint/no-explicit-any */

import { IdField } from "@/types/defaultTypes";
import {
  Badge,
  Box,
  Button,
  Group,
  NumberInput,
  Popover,
  Select,
  SimpleGrid,
  Stack,
  Text,
  rem,
} from "@mantine/core";

import { TbDotsVertical } from "react-icons/tb";
import PosCartNumberInput from "./PosCartNumberInput";
import { useState } from "react";
import { usePosContext } from "./PosContext";
import { getPercentage } from "./PosCart";
import { useCustomInputStyles } from "./customInput.styles";
import { useDisclosure } from "@mantine/hooks";

export type TCartProductDiscount = "percent" | "flat";
export type TCartProduct = {
  name: string;
  product_id: IdField | null;
  product_variation_id: IdField | null;
  sku: string;
  quantity: number;
  stock_count: number;
  total_price: number;
  unit_price: number;
  discount: number;
  discountType: TCartProductDiscount;
  type: "product" | "variation";
};
export type TPosCartProductProps = {
  cartProduct: TCartProduct;
};
const PosCartProduct = ({ cartProduct }: TPosCartProductProps) => {
  const { classes } = useCustomInputStyles();
  const [popoverOpened, { open: openPopover, close: closePopover }] =
    useDisclosure(false);
  const { removeCartProduct, setCartProducts } = usePosContext();

  const max = cartProduct.stock_count;
  const totalPrice = cartProduct.total_price;
  const cartProductName =
    cartProduct.name && typeof cartProduct.name === "string"
      ? cartProduct.name.substring(0, 12)
      : "Name not found";

  const [productDiscount, setProductDiscount] = useState(cartProduct.discount);
  const [productDiscountType, setProductDiscountType] =
    useState<TCartProductDiscount>(cartProduct.discountType);

  const onDiscountUpdates = (updatedDiscount: number) => {
    setCartProducts((prev) => {
      const desiredCp = prev.find((p) => p.sku === cartProduct.sku);
      if (desiredCp) {
        desiredCp.discount = updatedDiscount;
        return [...prev];
      } else {
        return prev;
      }
    });
  };

  const onDiscountTypeUpdates = (type: TCartProductDiscount) => {
    setCartProducts((prev) => {
      const desiredCp = prev.find((p) => p.sku === cartProduct.sku);
      if (desiredCp) {
        desiredCp.discountType = type;
        return [...prev];
      } else {
        return prev;
      }
    });
  };
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.fn.lighten(
          // theme.other.colors.primary.background,
          theme.colors.yellow[5],
          0.8
        ),
        borderRadius: theme.other.radius.primary,
        boxShadow: theme.shadows.sm,
        border: `1px solid black`,
      })}
      key={cartProduct.sku}
      py={5}
      px={5}
    >
      <Group>
        <PosCartNumberInput
          defaultValue={cartProduct.quantity}
          max={max}
          min={1}
          onUpdate={(quantity) => {
            setCartProducts((prev) => {
              const desiredCp = prev.find((p) => p.sku === cartProduct.sku);
              if (desiredCp) {
                desiredCp.quantity = quantity;
                const baseTotal = desiredCp.quantity * desiredCp.unit_price;
                if (productDiscountType === "flat") {
                  desiredCp.total_price = baseTotal - desiredCp.discount;
                } else {
                  const discountPrice = getPercentage(
                    desiredCp.discount,
                    baseTotal
                  );
                  desiredCp.total_price = baseTotal - discountPrice;
                }
                return [...prev];
              } else {
                return prev;
              }
            });
          }}
        />
        <Stack spacing={2} fw={"500"}>
          <Text mr={"auto"}>{cartProductName}</Text>
          <Text fz={10} mr={"auto"}>
            Unit Price : {cartProduct.unit_price ?? 0} ৳
          </Text>
          <Text fz={10} mr={"auto"}>
            Discount: {cartProduct.discount ?? 0}{" "}
            {cartProduct.discountType === "flat" ? "৳" : "%"}
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
          {totalPrice.toFixed(2)}
        </Badge>
        <Box>
          <Popover
            opened={popoverOpened}
            onClose={closePopover}
            trapFocus
            withArrow
          >
            <Popover.Target>
              <Button
                onClick={openPopover}
                sx={{
                  borderRadius: "100%",
                  width: "30px",
                  height: "30px",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                size="xs"
                variant="outline"
                bg={"white"}
              >
                <TbDotsVertical />
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
              <Stack>
                <Box>
                  Discount
                  <Group>
                    <Box sx={{ flex: 2, width: 100 }}>
                      <NumberInput
                        classNames={classes}
                        hideControls
                        placeholder="Discount"
                        defaultValue={cartProduct.discount}
                        onChange={(v) => {
                          onDiscountUpdates(Number(v));
                        }}
                      />
                    </Box>
                    <Select
                      allowDeselect={false}
                      clearable={false}
                      searchable={false}
                      sx={{ flex: 1 }}
                      classNames={classes}
                      defaultValue={cartProduct.discountType}
                      onChange={(v) =>
                        onDiscountTypeUpdates(v as TCartProductDiscount)
                      }
                      data={["flat", "percent"]}
                    />
                  </Group>
                </Box>
                <SimpleGrid cols={2}>
                  <Button onClick={closePopover} variant="success">
                    OK
                  </Button>
                  <Button
                    onClick={() => {
                      const confirm = window.confirm("Are you sure ?");
                      if (confirm) {
                        removeCartProduct(cartProduct.sku);
                      }
                    }}
                    variant="danger"
                  >
                    Remove
                  </Button>
                </SimpleGrid>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Box>
      </Group>
    </Box>
  );
};

export default PosCartProduct;
