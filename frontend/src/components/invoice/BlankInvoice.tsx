import {
  Box,
  Container,
  Group,
  Stack,
  Table,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { forwardRef } from "react";

const useInvoiceStyles = createStyles((t) => ({
  storeInfo: {
    fontSize: rem(12),
  },
  user: {
    fontSize: rem(14),
  },
  amount: {
    fontWeight: 600,
    fontSize: rem(12),
    color: t.colors.dark[3],
  },
  amountInfo: {
    fontSize: rem(10),
    fontWeight: 600,
    color: t.colors.dark[1],
  },
  th: {
    textAlign: "initial",
    fontSize: rem(12),
    fontWeight: 600,
  },
  calculate: {
    display: " flex",
    gap: rem(10),
  },
  calculateLeftLabel: {
    textAlign: "left",
    verticalAlign: "middle",
  },
  parent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
}));

const BlankInvoice = forwardRef((props, ref) => {
  const currencySymbol = "৳";

  const { classes, cx } = useInvoiceStyles();

  const orderItems = Array.from({ length: 5 }, (v, k) => k);

  return (
    <Box
      p={"xs"}
      {...props}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
      }}
      ref={ref}
    >
      <Box
        sx={(t) => ({
          maxWidth: "800px",
          height: "100%",
          border: "0px solid #000",
          boxShadow: t.shadows.sm,
          display: "flex",
          flexDirection: "column",
        })}
      >
        {/* invoice header */}
        <Box
          sx={(t) => ({
            width: "100%",
            backgroundColor: t.colors.blue,
            color: t.white,
            padding: t.spacing.sm,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          })}
        >
          {/* logo */}
          <Text
            sx={{
              fontSize: 30,
              fontWeight: "bold",
            }}
          >
            MotoMedic
          </Text>

          {/* store info */}
          <Box className={classes.storeInfo}>
            <p>MotoMedic</p>
            <p>016029009</p>
            <p>motomedic@gmail.com</p>
            <p>Dhaka</p>
          </Box>
        </Box>
        {/* invoice user section */}

        <Group
          noWrap
          py={"xs"}
          px={"md"}
          align="flex-start"
          position="apart"
          sx={{
            width: "100%",
          }}
        >
          {/* user info*/}

          <Box sx={{ minWidth: 0 }}>
            <InfoTable
              rowArray={[
                { content: "", title: "Customer" },
                { content: "", title: "Phone" },
                { content: "", title: "Email" },
              ]}
            />
          </Box>

          <Box sx={{ flexShrink: 0 }}>
            <InfoTable
              rowArray={[
                { content: "", title: "Date" },
                { content: "", title: "Invoice ID" },
                { content: "", title: "Seller ID" },
                { content: "", title: "Payment Method" },
              ]}
            />
          </Box>
        </Group>

        {/* invoice contents */}
        <Box sx={{ flex: 1 }}>
          <Table
            withBorder
            withColumnBorders
            style={{ height: "100%" }}
            verticalSpacing="2px"
            horizontalSpacing="xs"
            fontSize="xs"
          >
            <thead>
              <tr>
                <th style={{ width: "10%" }}>#</th>
                <th>Item & Description</th>
                <th style={{ width: "20%" }}>Amount</th>
              </tr>
            </thead>
            <tbody style={{ height: "100%" }}>
              {orderItems.map((_, idx) => {
                return (
                  <tr style={{ border: "none" }} key={idx}>
                    <td
                      style={{ borderBottom: "none", borderTop: "none" }}
                    ></td>
                    <td
                      style={{ borderBottom: "none", borderTop: "none" }}
                    ></td>
                    <td
                      style={{ borderBottom: "none", borderTop: "none" }}
                    ></td>
                  </tr>
                );
              })}

              {/* total row */}
            </tbody>
            <tfoot>
              <tr>
                <th
                  style={{
                    textAlign: "right",
                  }}
                  colSpan={2}
                >
                  <p>Subtotal</p>
                  <p>Discount</p>
                  <p>Tax</p>
                </th>
                <th
                  style={{
                    textAlign: "left",
                  }}
                >
                  <p></p>
                  <p></p>
                  <p></p>
                </th>
              </tr>
              <tr>
                <th
                  colSpan={2}
                  style={{
                    fontSize: rem(13),
                  }}
                >
                  <Box
                    sx={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Text fw={600}>
                      <Text span transform="uppercase">
                        In words :
                      </Text>{" "}
                    </Text>
                    <Text>Total</Text>
                  </Box>
                </th>
                <th></th>
              </tr>
            </tfoot>
          </Table>
        </Box>
        {/* invoice footer */}
        <Container fluid sx={{ width: "100%", marginTop: "auto" }}>
          <Group noWrap pt={40} pb={15} position="apart" align="flex-start">
            <Stack spacing={0} sx={{ width: "35%", alignSelf: "flex-end" }}>
              {/* <Text className={classes.info}>Paid By Cash</Text> */}
              <Box h={2} bg={"black"}></Box>
              <Text fw={"bold"} fz={"xs"} pt={"sm"} align="center">
                Customer's Signature
              </Text>
            </Stack>

            <Stack spacing={0} sx={{ width: "35%", alignSelf: "flex-end" }}>
              {/* <Text className={classes.info}>Paid By Cash</Text> */}
              <Box h={2} bg={"black"}></Box>
              <Text fw={"bold"} fz={"xs"} pt={"sm"} align="center">
                Authorised's Signature
              </Text>
            </Stack>
          </Group>
        </Container>
      </Box>
    </Box>
  );
});

const InfoTable = ({
  rowArray,
}: {
  rowArray: { title: string; content: string }[];
}) => {
  return (
    <table style={{ width: "100%" }}>
      <tbody>
        {rowArray.map((row) => (
          <tr key={row.title}>
            <th
              align="justify"
              style={{
                verticalAlign: "top",
                fontSize: 10,
                fontWeight: "bold",
                width: "max-content",
                whiteSpace: "nowrap",
              }}
            >
              {row.title}
            </th>
            <td
              style={{
                minWidth: "16px",
                verticalAlign: "top",
                textAlign: "center",
                fontSize: 10,
                fontWeight: "bold",
              }}
            >
              :
            </td>
            <td style={{ verticalAlign: "top" }}>
              {" "}
              <Text sx={{ fontSize: 10, minWidth: 100 }}> {row.content}</Text>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default BlankInvoice;
