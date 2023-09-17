import { AllProductFields } from "@/components/products/fields/AllProductFields";
import axiosClient from "@/lib/axios";
import { Stack } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";

const AddProductPage = () => {
  const { data } = useQuery({
    queryKey: ["test"],
    queryFn: async () => {
      return axiosClient.get("/v1/customers").then((res) => res.data);
    },
  });

  console.log(data, "from add product pag");
  return (
    <Stack>
      <h1>Create A Single Product</h1>
      <AllProductFields />
    </Stack>
  );
};

export default AddProductPage;
