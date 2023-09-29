import axiosClient from "@/lib/axios";
import { useMechanicQuery } from "@/queries/mechanicQuery";
import { Button, Table } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

const MechanicPage = () => {
  const mechanics = useMechanicQuery();
  console.log({ mechanics }, "from mechanics");
  const isArr = mechanics && Array.isArray(mechanics.data);
  const tRows = isArr
    ? mechanics.data.map((mechanic) => {
        return (
          <tr key={mechanic.id}>
            <th>{mechanic.id}</th>
            <th>{mechanic.name}</th>
            <th>{mechanic.phone}</th>
            <th>{mechanic.email}</th>
            <th>{mechanic.address}</th>
            <th>{mechanic.status}</th>
            <th>
              <Button compact size="xs">
                Details
              </Button>
            </th>
          </tr>
        );
      })
    : [];
  return (
    <div>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{tRows}</tbody>
      </Table>
    </div>
  );
};

export default MechanicPage;
