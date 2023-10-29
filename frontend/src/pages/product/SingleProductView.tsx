import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { deleteProduct } from "@/queries/productQuery";
import { Product } from "@/types/defaultTypes";
import { Text, Box, Stack, Table, Button, SimpleGrid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";

const SingleProductView = () => {
  const navigate = useNavigate();
  const { productSku } = useParams();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: "Product Details",
  });
  const { data: productData } = useQuery<Product>({
    queryKey: ["get/products", productSku],
    queryFn: () => {
      return axiosClient.v1.api
        .get(`products/${productSku}`)
        .then((data) => data.data.product);
    },
  });
  return (
    <Box>
      <BasicSection maw={700} mx={"auto"} title="Product Details">
        {productData ? (
          <Stack>
            <Stack ref={printRef}>
              <Table withColumnBorders withBorder>
                <tbody>
                  <tr>
                    <th>ID</th>
                    <td>{productData.id}</td>
                  </tr>
                  <tr>
                    <th>SKU</th>
                    <td>{productData.sku}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{productData.name}</td>
                  </tr>
                  <tr>
                    <th>Description</th>
                    <td>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: productData.description,
                        }}
                      />
                    </td>
                  </tr>
                  <tr>
                    <th>Brand Name</th>
                    <td>{productData.brand.name}</td>
                  </tr>
                  <tr>
                    <th>Category Name</th>
                    <td>{productData.category.name}</td>
                  </tr>
                  <tr>
                    <th>Price</th>
                    <td>{productData.price}</td>
                  </tr>
                  <tr>
                    <th>Stock count</th>
                    <td>{productData.stock_count}</td>
                  </tr>
                </tbody>
              </Table>

              <Table withBorder withColumnBorders>
                <caption>
                  <Text tt={"uppercase"} fw={600} color="black">
                    Variations
                  </Text>
                </caption>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Attributes</th>
                    <th>Stock count</th>
                  </tr>
                </thead>
                <tbody>
                  {productData.variations.map((variation) => {
                    return (
                      <tr key={variation.id}>
                        <td>{variation.name}</td>
                        <td>{variation.price}</td>
                        <td>{variation.name}</td>
                        <td>{variation.stock_count}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </Stack>

            <SimpleGrid cols={3} aria-disabled={!productData}>
              <Button
                onClick={() => {
                  handlePrint();
                }}
              >
                Print
              </Button>
              <Button>Edit</Button>
              <Button
                variant="danger"
                onClick={() => {
                  const confirmed = window.confirm("Are you sure?");
                  if (confirmed) {
                    deleteProduct(productData.sku, () => {
                      navigate("/product/all");
                    });
                  }
                }}
              >
                Delete
              </Button>
            </SimpleGrid>
          </Stack>
        ) : (
          "Wrong product sku or product was not found"
        )}
      </BasicSection>
    </Box>
  );
};

export default SingleProductView;
