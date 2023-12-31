import { useInventoryQuery } from "@/queries/inventoryQuery";
import { Badge, Button, Table } from "@mantine/core";
import { modals } from "@mantine/modals";

const INVENTORY_COLUMNS = ["ID", "SKU", "Stock_count"];
const AllInventoryPage = () => {
    const inventoryData = useInventoryQuery();
    console.log({ inventoryData });
    const isArr = Array.isArray(inventoryData);
    const tRows = isArr
        ? inventoryData.map((inventoryItem) => {
              return (
                  <tr key={inventoryItem.id}>
                      <td>{inventoryItem.id}</td>
                      <td>{inventoryItem.sku}</td>
                      <td>
                          <Badge variant="filled">
                              {inventoryItem.stock_count}
                          </Badge>
                      </td>
                      {/* <td>
                          <Button.Group>
                              <Button>details</Button>
                          </Button.Group>
                      </td> */}
                  </tr>
              );
          })
        : [];

    return (
        <div>
            <Table withBorder withColumnBorders>
                <thead>
                    <tr>
                        {INVENTORY_COLUMNS.map((thContent) => {
                            return <th key={thContent}>{thContent}</th>;
                        })}
                    </tr>
                </thead>
                <tbody>{tRows}</tbody>
            </Table>
        </div>
    );
};

export default AllInventoryPage;
