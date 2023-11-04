import CrudOptions from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { useCustomerQuery } from "@/queries/customerQuery";
import { Button, Table } from "@mantine/core";
import { notifications } from "@mantine/notifications";

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
      notifications.show({
        // @ts-expect-error error message
        message: JSON.stringify(error.data.message),
        color: "red",
      });
    }
  };
  const tRows = customersPaginated ? (
    customersPaginated.data.map((customer, customerIdx) => {
      return (
        <tr key={customer.id}>
          <td>{customerIdx + 1}</td>
          <td>{customer.name}</td>
          <td>{customer.phone}</td>
          <td>{customer.email}</td>
          <td>{customer.address}</td>
          <td>{customer.bike_info ? customer.bike_info : "Not found"}</td>
          <td>
            <CrudOptions
              onView={() => {}}
              onEdit={() => {}}
              onDelete={() => {
                deleteCustomer(customer.id);
              }}
            />
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
    <BasicSection title="Customers">
      <Table
        fontSize="md"
        withBorder
        withColumnBorders
        highlightOnHover
        striped
      >
        <thead>
          <tr>
            <th>SL</th>
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
    </BasicSection>
  );
};

export default CustomerPage;
