import {
  Box,
  Center,
  Grid,
  Pagination,
  Select,
  Stack,
  Text,
  TextInput,
  rem,
} from "@mantine/core";

import {
  usePosProductSearch,
  useProductSearch,
} from "@/hooks/useProductSearch";
import {
  useBrandSelectData,
  useCategorySelectData,
} from "@/utils/selectFieldsData";
import { useState } from "react";
import ScrollWrapper2 from "../scrollWrapper/ScrollWrapper2";

import { TbCactus } from "react-icons/tb";

import PosProductCard from "./PosProductCard";
const PosProductView = () => {
  const categoryForSelectInput = useCategorySelectData();
  const brandSelectData = useBrandSelectData();
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [selectedBrandId, setSelectedBrandId] = useState("");
  const { products, handleSearchInputChange, searchQuery, searchLoading } =
    usePosProductSearch(selectedCategoryId, selectedBrandId);

  // const brands = useBrandQuery();

  // const brandsForSelectInput = useMemo(() => {
  //   return brands && Array.isArray(brands.data) && brands.data.length > 0
  //     ? brands.data.map((brand) => ({
  //         ...brand,
  //         label: brand.name,
  //         value: String(brand.id),
  //       }))
  //     : [];
  // }, [brands]);

  // const [cartProducts, setCartProducts] = useState<Array<TCartProduct>>([]);

  // const removeFromCart = (sku: string) => {
  //   setCartProducts((cps) => {
  //     const withoutProduct = cps.filter((cp) => cp.sku !== sku);
  //     console.log({ withoutProduct });
  //     return withoutProduct;
  //   });
  // };
  const { paginatedProducts } = products;
  const hasProducts =
    Array.isArray(paginatedProducts) && paginatedProducts.length > 0;
  return (
    <Stack h={"100%"} sx={{ flex: 1 }} spacing={"xs"}>
      {/* Product choose option */}

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
            data={brandSelectData}
          />
        </Grid.Col>
      </Grid>
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <ScrollWrapper2>
          <Stack h={"100%"}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: rem(12),
                flexWrap: "wrap",
              }}
            >
              {hasProducts ? (
                paginatedProducts.map((product) => {
                  return <PosProductCard key={product.sku} product={product} />;
                })
              ) : (
                <NoProductsFound />
              )}
            </Box>

            <Center mt={"auto"}>
              <Pagination
                total={products.totalPageCount}
                value={products?.currentPage}
                onChange={products?.handlePageChange}
              />
            </Center>
          </Stack>
        </ScrollWrapper2>
      </Box>
    </Stack>
  );
};

const NoProductsFound = () => {
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

export default PosProductView;
