import { Table } from "@mantine/core";

const CustomerPage = () => {
  const customers = Array.from({ length: 100 }, (v, k) => k + 1);
  const tRows = customers.map((customer, customerIdx) => {
    return (
      <tr key={customerIdx}>
        <td>{customerIdx + 1}</td>
        <td>Name</td>
        <td>Phone</td>
        <td>Email</td>
        <td>Address</td>
        <td>Bike Info</td>
        <td>Actions</td>
      </tr>
    );
  });
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
