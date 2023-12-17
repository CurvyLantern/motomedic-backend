import { useEffect, useMemo, useState } from "react";
import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
  type MRT_ColumnFiltersState,
  type MRT_PaginationState,
  type MRT_SortingState,
} from "mantine-react-table";
import { useOrderQuery } from "@/queries/orderQuery";

type UserApiResponse = {
  data: Array<User>;
  meta: {
    totalRowCount: number;
  };
};

type User = {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  phoneNumber: string;
};

const Example = () => {
  //data and fetching state
  const [data, setData] = useState<User[]>([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefetching, setIsRefetching] = useState(false);
  const [rowCount, setRowCount] = useState(0);

  const orders = useOrderQuery("unpaid");

  const AllOrders = useMemo(() => {
    return orders && orders.data ? orders.data : [];
  }, [orders]);

  console.log({ AllOrders });

  const columns = useMemo<MRT_ColumnDef<any>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Order code",
      },

      {
        accessorKey: "customer.name",
        header: "Customer",
      },
      {
        accessorKey: "seller.name",
        header: "Seller",
      },
      {
        accessorKey: "payment_status",
        header: "Payment Status",
      },
      {
        accessorKey: "total_price",
        header: "Total Price",
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: AllOrders,
    // enableRowSelection: true,
    getRowId: (row) => row.id,
    initialState: { showColumnFilters: true },
    rowCount,
    state: {
      isLoading,
      showAlertBanner: isError,
      showProgressBars: isRefetching,
    },
    mantineToolbarAlertBannerProps: isError
      ? { color: "red", children: "Error loading data" }
      : undefined,
  });

  return <MantineReactTable table={table} />;
};

export default Example;
