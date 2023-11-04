import { useFlatProducts, useProductAllQuery } from "@/queries/productQuery";
import { Product } from "@/types/defaultTypes";
import { useDebouncedState } from "@mantine/hooks";
import { memo, useCallback, useEffect, useMemo, useState } from "react";

const paginateProducts = (
  initialProducts: Product[] | undefined,
  page: number,
  pageSize: number
) => {
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedProducts = initialProducts
    ? initialProducts.slice(startIndex, endIndex)
    : [];
  return paginatedProducts;
};
export const useProductPagination = (
  initialProducts?: Product[],
  _pageSize = 50,
  _page = 1
) => {
  const [page, setPage] = useState(_page);
  const [pageSize, setPageSize] = useState(_pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
  };

  // Use useMemo to compute paginatedProducts
  const paginatedProducts = useMemo(() => {
    return paginateProducts(initialProducts, page, pageSize);
  }, [page, pageSize, initialProducts]);

  const totalPageCount = useMemo(() => {
    if (initialProducts && initialProducts.length > 0) {
      return Math.ceil(initialProducts.length / pageSize);
    }
    return 0;
  }, [initialProducts, pageSize]);

  const returnObj = useMemo(
    () => ({
      currentPage: page,
      currentPageSize: pageSize,
      totalProducts: initialProducts ? initialProducts.length : 0,
      totalPageCount,
      paginatedProducts,
      handlePageChange,
      handlePageSizeChange,
    }),
    [page, pageSize, initialProducts, totalPageCount, paginatedProducts]
  );

  return returnObj;
};

export const useProductSearchByNameSkuId = () => {
  const productsAll = useFlatProducts();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useDebouncedState(
    searchQuery,
    500
  );

  useEffect(() => {
    setDebouncedSearchQuery(searchQuery);
  }, [searchQuery, setDebouncedSearchQuery]);

  const searchedProducts = useMemo(() => {
    const isQueryInValid = debouncedSearchQuery.trim() === "";
    if (!Array.isArray(productsAll)) return [];

    if (isQueryInValid) {
      // If the query is empty, return all products
      return productsAll;
    } else {
      const filteredProductsBySearch = productsAll.filter((product) => {
        const matchesSearch =
          product.name
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          product.sku
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase()) ||
          product.barcode
            ?.toLowerCase()
            .includes(debouncedSearchQuery.toLowerCase());

        return matchesSearch;
      });

      return filteredProductsBySearch;
    }
  }, [debouncedSearchQuery, productsAll]);

  const handleSearchInputChange = useCallback((query: string = "") => {
    setSearchQuery(query);
  }, []);
  return {
    products: searchedProducts,
    debouncedSearchQuery,
    searchQuery,
    handleSearchInputChange,
  };
};

export const useProductSearch = (categoryId = "", brandId = "") => {
  const {
    products: searchedProducts,
    searchQuery,
    debouncedSearchQuery,
    handleSearchInputChange,
  } = useProductSearchByNameSkuId();
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    setSearchLoading(true);
  }, [debouncedSearchQuery]);

  const productsByCategoryId = useMemo(() => {
    if (!categoryId) {
      return searchedProducts;
    }
    return searchedProducts?.filter(
      (product) =>
        String(product.category_id) === categoryId ||
        String(product.parent_category_id) === categoryId
    );
  }, [searchedProducts, categoryId]);

  const productsByBrandId = useMemo(() => {
    if (!brandId) {
      return productsByCategoryId;
    }
    return productsByCategoryId?.filter(
      (product) => String(product.brand_id) === brandId
    );
  }, [productsByCategoryId, brandId]);

  useEffect(() => {
    setTimeout(() => {
      setSearchLoading(false);
    }, 500);
  }, [productsByBrandId]);

  const paginatedProducts = useProductPagination(productsByBrandId);

  useEffect(() => {
    console.log(paginatedProducts, "changing every time");
  }, [paginatedProducts]);
  return {
    products: paginatedProducts,
    searchQuery,
    handleSearchInputChange,
    searchLoading,
  };
};
