import Invoice1 from "@/components/invoice/Invoice1";
import { useAppSelector } from "@/hooks/storeConnectors";
import { Button, Stack, Box } from "@mantine/core";
const CreateBillingPage = () => {
    const orders = useAppSelector((s) => s.order.orders);

    return (
        <div>
            <Stack>
                <Button
                    onClick={() => {
                        console.clear();
                        console.log({ orders });
                    }}
                >
                    Press me to debug
                </Button>
                <Box sx={{ position: "relative" }}>
                    <Invoice1 />
                </Box>
            </Stack>
        </div>
    );
};

export default CreateBillingPage;
