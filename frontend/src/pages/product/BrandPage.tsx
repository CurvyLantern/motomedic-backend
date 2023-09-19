import { BrandForm } from "@/components/forms/brand/BrandForm";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import {
    AspectRatio,
    Box,
    Button,
    Card,
    Group,
    Image,
    Stack,
    Tabs,
    Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { useQuery } from "@tanstack/react-query";

const BrandPage = () => {
    // const onCreate = (values) => {
    //   console.log(values, "values");
    // };
    return (
        <div>
            <Tabs defaultValue="view">
                <Stack>
                    <Tabs.List>
                        <Tabs.Tab value="view">View Brands</Tabs.Tab>
                        <Tabs.Tab value="create">Create Brand</Tabs.Tab>
                    </Tabs.List>

                    <Tabs.Panel value="view">
                        <Box maw={1100} mx="auto">
                            <ViewBrands />
                        </Box>
                    </Tabs.Panel>
                    <Tabs.Panel value="create">
                        <Box maw={600} mx="auto">
                            <BasicSection>
                                <BrandForm submitUrl="brands" />
                            </BasicSection>
                        </Box>
                    </Tabs.Panel>
                </Stack>
            </Tabs>
        </div>
    );
};

const useBrandsQuery = () => {
    const url = "brands";
    const { data: brands } = useQuery({
        queryKey: ["get/brands"],
        queryFn: async () => {
            return axiosClient.v1.api.get(url).then((res) => res.data);
        },
    });
    return {
        brands,
    };
};

const ViewBrands = () => {
    const { brands } = useBrandsQuery();
    console.log({ brands });
    const data = brands?.data;
    const hasData = Array.isArray(data);

    const editBrand = (brand: Brand) => {
        const { brand_name, id } = brand;
        modals.open({
            title: `Edit brand ${brand_name}`,
            centered: true,
            children: (
                <BrandForm
                    method="PUT"
                    submitUrl={`brands/${id}`}
                    brand={brand}
                    onCancel={() => {
                        modals.closeAll();
                    }}
                    onSuccess={() => {
                        modals.closeAll();
                    }}
                />
            ),
        });
    };
    const deleteBrand = (id: string | number) => {
        const confirm = window.confirm(
            "Are you sure you want to delete this ? " + id
        );
        if (confirm) {
            //do something
        }
    };

    return (
        <div>
            <Group position="center" align="normal">
                {hasData
                    ? data.map((brand) => {
                          const id = brand.id;
                          return (
                              <Card
                                  sx={{
                                      flex: 1,
                                      display: "flex",
                                      flexDirection: "column",
                                  }}
                                  key={id}
                                  miw={150}
                                  maw={200}
                              >
                                  <AspectRatio ratio={16 / 11}>
                                      <Image src={brand.img}></Image>
                                  </AspectRatio>
                                  <Text size="sm" weight={"bold"} mt={"auto"}>
                                      {brand.brandName}
                                  </Text>
                                  <Box
                                      sx={{
                                          display: "flex",
                                          gap: "5px",
                                          alignItems: "center",
                                          justifyContent: "center",
                                      }}
                                  >
                                      <Button
                                          size="xs"
                                          compact
                                          onClick={() => editBrand(brand)}
                                      >
                                          Edit
                                      </Button>
                                      <Button
                                          sx={(t) => ({
                                              backgroundColor: t.colors.red[8],
                                              "&:hover": {
                                                  backgroundColor:
                                                      t.colors.red[7],
                                              },
                                          })}
                                          size="xs"
                                          compact
                                          onClick={() => deleteBrand(id)}
                                      >
                                          Delete
                                      </Button>
                                  </Box>
                              </Card>
                          );
                      })
                    : "no brands to show, create one please"}
            </Group>
        </div>
    );
};

export default BrandPage;
