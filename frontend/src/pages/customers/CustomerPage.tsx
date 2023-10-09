import axiosClient from "@/lib/axios";
import { useCustomerQuery } from "@/queries/customerQuery";
import { Button, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";

const CustomerPage = () => {
  const customersPaginated = useCustomerQuery();
  const deleteCustomer = async (id: string) => {
    try {
      await axiosClient.v1.api
        .delete(`customers/${id}`)
        .then((res) => res.data);
      notifications.show({
        message: `Customer ID ${id} has been deleted`,
        color: "green",
      });
    } catch (error) {
      const axiosError = error as AxiosError;
      console.log(axiosError);
      notifications.show({
        message: axiosError.statusText,
        color: "red",
      });
    }
  };
  const tRows = customersPaginated ? (
    customersPaginated.data.map((customer, customerIdx) => {
      return (
        <tr key={customer.id}>
          <td>{customer.id}</td>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{customer.email}</td>
          <td>{customer.address}</td>
          <td>{customer.bike_info ? customer.bike_info : "Not found"}</td>
          <td>
            <Button
              onClick={() => {
                deleteCustomer(customer.id);
              }}
              variant="danger"
              compact
              size="xs"
            >
              Delete
            </Button>
          </td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={7}>No customers</td>
    </tr>
  );
  return (
    <div>
      <Table
        fontSize="md"
        withBorder
        withColumnBorders
        highlightOnHover
        striped
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Bike Info</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{tRows}</tbody>
      </Table>
    </div>
  );
};

export default CustomerPage;
