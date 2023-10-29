import { useAppSelector } from "@/hooks/storeConnectors";
import { Stack, Table } from "@mantine/core";
import { Box, Text } from "@mantine/core";
import BasicSection from "../sections/BasicSection";

export const SelectedCustomerInfo = () => {
  const selectedCustomer = useAppSelector(
    (state) => state.customer.selectedCustomer
  );

  return (
    <Box>
      <Text align="center" sx={{ textTransform: "uppercase", fontWeight: 600 }}>
        Customer Profile
      </Text>
      <BasicSection
        sx={(theme) => ({
          color: "black",
          backgroundColor: "white",
          height: "100%",
        })}
      >
        <Table>
          {selectedCustomer ? (
            <tbody>
              <tr>
                <th>Name :</th>
                <td>{selectedCustomer.name}</td>
              </tr>
              <tr>
                <th>Phone :</th>
                <td>{selectedCustomer.phone}</td>
              </tr>
              <tr>
                <th>Email :</th>
                <td>{selectedCustomer.email}</td>
              </tr>
              <tr>
                <th>Address :</th>
                <td>{selectedCustomer.address}</td>
              </tr>
              <tr>
                <th>Bike Info :</th>
                <td>{selectedCustomer.bike_info}</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td rowSpan={5} colSpan={1}>
                  Select Customer to see data
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </BasicSection>
    </Box>
  );
};
