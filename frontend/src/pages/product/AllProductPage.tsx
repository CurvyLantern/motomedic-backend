import { ProductCard } from "@/components/products/card/ProductCard";
import axiosClient from "@/lib/axios";
import { IdField, Product } from "@/types/defaultTypes";
import { SimpleGrid, Pagination, Stack, Center } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

const getPaginatedUrl = (n: number | string) => `products?page=${n}&perPage=50`;

const AllProductPage = () => {
    // const [products, setProducts] = useState<Array<Product>>([]);
    const [activePage, setPage] = useState(1);
    const url = getPaginatedUrl(activePage);
    const { data: products } = useQuery<{
        data: Array<Product & { id: IdField }>;
    }>({
        queryKey: ["products", url],
        queryFn: () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
    });
    console.log(products, "products");
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
        products && Array.isArray(products.data) && products.data.length > 0;
    return (
        <Stack>
            {/* <div>{JSON.stringify(products)}</div> */}
            <SimpleGrid cols={4}>
                {isArray
                    ? products.data.map((product) => {
                          return (
                              <ProductCard key={product.id} product={product} />
                          );
                      })
                    : null}
            </SimpleGrid>
            <div>{activePage}</div>
            <Center>
                <Pagination
                    value={activePage}
                    onChange={setPage}
                    total={10}
                    radius="md"
                />
            </Center>
        </Stack>
    );
};

export default AllProductPage;
