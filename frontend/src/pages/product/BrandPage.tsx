import { BrandForm } from "@/components/forms/brand/BrandForm";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import { useBrandQuery } from "@/queries/brandQuery";
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
import { notifications } from "@mantine/notifications";
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

const ViewBrands = () => {
    const { brands } = useBrandQuery();

    const editBrand = (brand: Brand) => {
        const { name, id } = brand;
        modals.open({
            title: `Edit brand ${name}`,
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
    const deleteBrand = (brand: Brand) => {
        const url = "brands";
        const confirm = window.confirm(
            "Are you sure you want to delete this ? " + brand.id
        );
        if (confirm) {
            //do something
            axiosClient.v1.api.delete(`${url}/${brand.id}`).then((res) => {
                notifications.show({
                    color: "green",
                    message: "Brand Deleted",
                });
                return res.data;
            });
        }
    };

    return (
        <div>
            <Group position="center" align="normal">
                {brands
                    ? brands.map((brand) => {
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
                                      <Image src={brand.image}></Image>
                                  </AspectRatio>
                                  <Text size="sm" weight={"bold"} mt={"auto"}>
                                      {brand.name}
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
                                          onClick={() => deleteBrand(brand)}
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
