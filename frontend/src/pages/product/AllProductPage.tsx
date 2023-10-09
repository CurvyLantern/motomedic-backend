import { ProductCard } from "@/components/products/card/ProductCard";
import { useProductPagination } from "@/hooks/useProductSearch";
import axiosClient from "@/lib/axios";
import { useProductAllQuery } from "@/queries/productQuery";
import { IdField, Product } from "@/types/defaultTypes";
import {
  Text,
  SimpleGrid,
  Pagination,
  Stack,
  Center,
  Box,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { TbCactus, TbShadow } from "react-icons/tb";

const getPaginatedUrl = (n: number | string) => `products?page=${n}&perPage=50`;

const AllProductPage = () => {
  // const [products, setProducts] = useState<Array<Product>>([]);
  const [activePage, setPage] = useState(1);
  const url = getPaginatedUrl(activePage);
  const products = useProductAllQuery();
  const {
    paginatedProducts,
    currentPage,
    currentPageSize,
    handlePageChange,
    totalPageCount,
  } = useProductPagination(products, 100);
  // useEffect(() => {
  //   const controller = new AbortController();
  //   const url = getPaginatedUrl(activePage);
  //   const fetcher = () => {
  //     return axiosClient.get(url, { signal: controller.signal }).then((res) => {
  //       const products = res.data.data.products.data;
  //       console.log(products, "from useEffect");
  //       setProducts(products);
  //     });
  //   };

  //   fetcher();

  //   return () => {
  //     controller.abort();
  //   };
  // }, [activePage]);
  const isArray =
    paginatedProducts &&
    Array.isArray(paginatedProducts) &&
    paginatedProducts.length > 0;
  return (
    <Stack h={"100%"}>
      {/* <div>{JSON.stringify(products)}</div> */}

      {isArray ? (
        <SimpleGrid cols={4}>
          {paginatedProducts.map((product) => {
            return <ProductCard key={product.id} product={product} />;
          })}
        </SimpleGrid>
      ) : (
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
      )}

      <Center>
        <Pagination
          value={currentPage}
          onChange={handlePageChange}
          total={totalPageCount}
          radius="md"
        />
      </Center>
    </Stack>
  );
};

export default AllProductPage;
