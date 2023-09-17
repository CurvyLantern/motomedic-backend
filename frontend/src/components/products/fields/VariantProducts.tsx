import { useAppSelector } from "@/hooks/storeConnectors";
import {
  Table,
  Box,
  NumberInput,
  TextInput,
  FileInput,
  FileButton,
  Button,
} from "@mantine/core";

const VariantProducts = () => {
  const variants = useAppSelector((state) => state.product.variants);
  const ths = ["Variant Name", "price", "sku", "image"].map((label) => {
    return <th key={label}>{label}</th>;
  });
  const trows = variants.map((variant, variantIdx) => {
    // const variantEntries = Object.entries(variant);
    /*  {
        name: "v1",
        price: 0,
        sku: "",
        photo: null,
      }, */

    return (
      <tr key={variantIdx}>
        {/* {variantEntries.map((entry, entryIdx) => {
          return <td key={entryIdx}>{entry[1]}</td>;
        })} */}
        <td>{variant.name}</td>
        <td>
          <NumberInput defaultValue={variant.price}></NumberInput>
        </td>
        <td>
          <TextInput defaultValue={variant.sku}></TextInput>
        </td>
        <td>
          <FileButton onChange={() => {}}>
            {(props) => <Button {...props}>Upload</Button>}
          </FileButton>
        </td>
      </tr>
    );
  });
  return (
    <Box
      sx={(theme) => ({
        backgroundColor: theme.white,
      })}>
      <Table
        horizontalSpacing="xl"
        verticalSpacing="sm"
        highlightOnHover
        withBorder
        withColumnBorders>
        <thead>
          <tr>{ths}</tr>
        </thead>
        <tbody>{trows}</tbody>
      </Table>
    </Box>
  );
};

export default VariantProducts;
