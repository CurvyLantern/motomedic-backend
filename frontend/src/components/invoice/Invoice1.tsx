import { Box, Container, Group, Table, createStyles, rem } from "@mantine/core";
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
    info: {
        fontSize: rem(12),
    },
    id: {
        fontWeight: 600,
    },
    calculate: {
        display: " flex",
        gap: rem(10),
    },
    calculateLeftLabel: {
        textAlign: "right",
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
const dt = { prcnt: "%", flat: "bdt" };
const mock = {
    orders: [
        {
            label: "Spare Part 1",
            unitPrice: 10,
            unitCount: 10,
        },
        {
            label: "Spare Part 2",
            unitPrice: 20,
            unitCount: 5,
        },
        {
            label: "Spare Part 3",
            unitPrice: 3,
            unitCount: 200,
        },
    ],
    discount: 50,
    discountType: dt.prcnt,
    tax: 5,
};
const Invoice1 = forwardRef((props, ref) => {
    const { classes, cx } = useInvoiceStyles();
    const ORDER = mock.orders.map((order, orderIdx) => {
        return {
            id: orderIdx + 1,
            label: order.label,
            unitCount: order.unitCount,
            unitPrice: order.unitPrice,
            price: order.unitCount * order.unitPrice,
        };
    });
    const subTotal = ORDER.reduce((sum, order) => {
        sum += order.price;
        return sum;
    }, 0);

    const tax = Math.abs(mock.tax);
    const discountType = mock.discountType;

    let discount = Math.abs(mock.discount);
    let discountAmount = 0;
    if (discountType === dt.prcnt) {
        discount = Math.min(discount, 100);
        discountAmount = subTotal * discount * 0.01;
    } else {
        discount = Math.min(discount, subTotal);
        discountAmount = subTotal - discount;
    }

    const totalAfterDiscount = subTotal - discountAmount;

    const taxAmount = totalAfterDiscount * tax * 0.01;
    const total = totalAfterDiscount + taxAmount;

    return (
        <div {...props} className={classes.parent}>
            <Box
                h={"100%"}
                p="sm"
                sx={{ display: "flex", border: "0px solid #000" }}
            >
                <Box sx={(t) => ({ flex: 1, boxShadow: t.shadows.sm })}>
                    {/* invoice header */}
                    <Box bg={"blue"}>
                        <Container
                            sx={(t) => ({
                                color: "white",
                                paddingBlock: t.spacing.md,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            })}
                        >
                            {/* logo */}
                            <Box
                                sx={{
                                    fontSize: 30,
                                }}
                            >
                                INVOICE
                            </Box>

                            {/* store info */}
                            <div className={classes.storeInfo}>
                                <p>MotoMedic</p>
                                <p>016029009</p>
                                <p>motomedic@gmail.com</p>
                                <p>Dhaka</p>
                            </div>
                        </Container>
                    </Box>
                    {/* invoice user section */}
                    <Box py={"md"}>
                        <Container
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            {/* user info*/}
                            <div className={classes.user}>
                                <p>Mr Tormuz Khan</p>
                                <p>0160910930</p>
                                <p>tormuz@gmail.com</p>
                            </div>
                            {/* invoice info */}
                            <div className={classes.storeInfo}>
                                <p className={classes.id}>
                                    Invoice ID : #ajdkadkj
                                </p>
                                <p>Date : {new Date().toDateString()}</p>
                                <p>Payment Method : Cash</p>
                            </div>
                        </Container>
                    </Box>
                    {/* invoice contents */}
                    <Box py="md">
                        <Container>
                            <Table
                                verticalSpacing="2px"
                                horizontalSpacing="xs"
                                fontSize="xs"
                            >
                                <thead>
                                    <tr>
                                        <th style={{ width: "10%" }}>#</th>
                                        <th>Item & Description</th>
                                        <th style={{ width: "20%" }}>Amout</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {ORDER.map((order) => {
                                        return (
                                            <tr key={order.id}>
                                                <td>{order.id}</td>
                                                <td>{order.label}</td>
                                                <td>
                                                    <div>
                                                        <p
                                                            className={
                                                                classes.amount
                                                            }
                                                        >
                                                            {order.price} bdt
                                                        </p>
                                                        <p
                                                            className={
                                                                classes.amountInfo
                                                            }
                                                        >
                                                            {order.unitCount}{" "}
                                                            pcs *{" "}
                                                            {order.unitPrice}{" "}
                                                            bdt
                                                        </p>
                                                    </div>
                                                </td>
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
                                        <th>
                                            <p>{subTotal} bdt</p>
                                            <p>
                                                {discount} {discountType}
                                            </p>
                                            <p>{tax} %</p>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th
                                            style={{
                                                textAlign: "right",
                                                fontSize: rem(15),
                                            }}
                                            colSpan={2}
                                        >
                                            Total
                                        </th>
                                        <th>{total} bdt</th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Container>
                    </Box>
                    {/* invoice footer */}
                    <Box>
                        <Container>
                            <Group
                                position="apart"
                                py={"xl"}
                                align="flex-start"
                            >
                                <div>
                                    <p>Payment Information</p>
                                    <p className={classes.info}>Paid By Cash</p>
                                </div>
                                <div>
                                    <p>Seller Information</p>
                                    <p className={classes.info}>
                                        Milton Mahmud
                                    </p>
                                    <p className={cx(classes.info, classes.id)}>
                                        Seller ID : #aksjdkajd
                                    </p>
                                </div>
                            </Group>
                        </Container>
                    </Box>
                </Box>
            </Box>
        </div>
    );
});

export default Invoice1;
