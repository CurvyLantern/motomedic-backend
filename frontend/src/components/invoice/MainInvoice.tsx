import { Box } from "@mantine/core";
import { forwardRef } from "react";

export type TInvoiceProps = {
  text: string;
};

const Invoice = forwardRef<HTMLDivElement, TInvoiceProps>((props, ref) => {
  return (
    <Box
      sx={{
        display: "none",
        "@media print": {
          display: "block",
        },
      }}
      ref={ref}
    >
      {props.text}
    </Box>
  );
});

export default Invoice;
