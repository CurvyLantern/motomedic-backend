import CrudOptions from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import { deleteProduct, useProductAllQuery } from "@/queries/productQuery";
import { Button } from "@mantine/core";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";

const AllProductPage = () => {
  // const [products, setProducts] = useState<Array<Product>>([]);

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

  return (
    <>
      {/* <Stack h={"100%"}>

        <SimpleGrid spacing={"xs"} cols={3}>
          <ActionIcon
            fz={"sm"}
            size={"sm"}
            variant="filled"
            radius={"lg"}
            color={"orange"}
          >
            <TbEye />
          </ActionIcon>
          <ActionIcon
            fz={"sm"}
            size={"sm"}
            variant="filled"
            radius={"lg"}
            color={"blue"}
          >
            <TbPencil />
          </ActionIcon>
          <ActionIcon
            fz={"sm"}
            size={"sm"}
            variant="filled"
            radius={"lg"}
            color={"red"}
          >
            <TbTrash />
          </ActionIcon>
        </SimpleGrid>

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
      </Stack> */}

      <AllProductTable />
    </>
  );
};

const AllProductTable = () => {
  //should be memoized or stable
  const products = useProductAllQuery();
  const navigate = useNavigate();
  const columns = useMemo(
    () => [
      {
        accessorKey: "name", //access nested data with dot notation
        header: "Product Name",
        maxSize: 200,
      },
      {
        accessorKey: "category.name",
        header: "Category",
        maxSize: 100,
      },
      {
        accessorKey: "brand.name", //normal accessorKey
        header: "Brand",
        maxSize: 100,
      },
      {
        accessorKey: "price",
        header: "Price",
        maxSize: 150,
      },
      {
        accessorKey: "stock_count",
        header: "Stock",
        maxSize: 100,
      },
    ],
    []
  );
  const memoizedProducts = useMemo(() => {
    return products ? products : [];
  }, [products]);
  const table = useMantineReactTable({
    columns,
    data: memoizedProducts,
    enableRowActions: true,
    positionActionsColumn: "last",
    enablePagination: true,
    enableBottomToolbar: true,
    // paginationDisplayMode: "pages",
    mantineTableContainerProps: {
      sx: {
        minHeight: "500px",

        "& tbody > tr > td": {
          fontSize: 12,
        },
      },
    },

    displayColumnDefOptions: {
      "mrt-row-actions": {
        minSize: 150,
      },
    },

    mantineSearchTextInputProps: {
      placeholder: "Search using name,sku,barcode",
      sx: { minWidth: "300px" },
      variant: "outlined",
    },
    mantineTableProps: {
      sx: {
        tableLayout: "fixed",
      },
    },
    initialState: {
      showGlobalFilter: true,
      columnPinning: {
        right: ["mrt-row-actions"],
      },
    },
    renderRowActions: ({ row, table }) => {
      const originalRowData = row.original;
      return (
        <CrudOptions
          onDelete={() => {
            const confirmed = window.confirm("Are you sure?");
            if (confirmed) {
              deleteProduct(originalRowData.sku, () => {});
            }
          }}
          onEdit={() => {
            console.log({ originalRowData });
            navigate(`/product/${originalRowData.sku}/edit`);
          }}
          onView={() => {
            navigate(`/product/${originalRowData.sku}`);
          }}
        />
      );
    },
  });
  console.log(products ? products[0] : null, "single product");
  return (
    <BasicSection
      maw={"100%"}
      title="All products table"
      headerRightElement={
        <Button component={Link} to={"/product/add"}>
          Add Product
        </Button>
      }
    >
      <MantineReactTable table={table} />
    </BasicSection>
  );
};

export default AllProductPage;
