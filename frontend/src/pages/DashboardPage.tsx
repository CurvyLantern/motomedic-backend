import { Grid, SimpleGrid, Stack, Tabs } from "@mantine/core";

import primaryBannerImg from "@/assets/banners/banner1.jpg";
import BannerImgSmall from "@/assets/banners/motomedic-banner.jpg";
import { OrderSummaryChart } from "@/components/charts/OrderSummaryChat";
import { OverviewChart } from "@/components/charts/OverviewChart";
import { ProductSellChart } from "@/components/charts/ProductSellChart";
import { StatsCell } from "@/components/stats/StatsCell";
import { Image } from "@mantine/core";
import { TbPhoto, TbSettings } from "react-icons/tb";
const mock = {
  data: [
    {
      title: "Revenue",
      value: "bdt 13000",
      diff: 34,
    },
    {
      title: "Profit",
      value: "bdt 4535",
      diff: -13,
    },
    {
      title: "Coupons usage",
      value: "7",
      diff: 18,
    },
    {
      title: "Product sold",
      value: "12",
      diff: 18,
    },
  ],
};

const DashboardPage = () => {
  return (
    <>
      <Stack spacing="xl">
        <Tabs variant="outline" defaultValue="reports">
          <Tabs.List>
            <Tabs.Tab value="reports" icon={<TbPhoto size="0.8rem" />}>
              Overview
            </Tabs.Tab>
            <Tabs.Tab value="overview" icon={<TbSettings size="0.8rem" />}>
              Reports
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="reports" pt="xs">
            <Stack>
              <Grid>
                <Grid.Col
                  span={12}
                  md={6}
                  lg={7}
                  orderLg={0}
                  order={1}
                  sx={{
                    display: "flex",
                  }}
                >
                  <SimpleGrid
                    sx={{
                      flex: 1,
                    }}
                    cols={1}
                    breakpoints={[
                      {
                        cols: 2,
                        minWidth: "sm",
                      },
                      {
                        cols: 2,
                        minWidth: "lg",
                      },
                    ]}
                  >
                    {mock.data.map((d, dIdx) => {
                      return (
                        <StatsCell
                          diff={d.diff}
                          title={d.title}
                          value={d.value}
                          key={dIdx}
                        />
                      );
                    })}
                  </SimpleGrid>
                </Grid.Col>
                <Grid.Col span={12} md={6} lg={5} order={0} orderLg={1}>
                  <Image
                    fit="contain"
                    sx={{
                      width: "100%",
                    }}
                    radius={"md"}
                    src={BannerImgSmall}
                    alt="primary banner of motomedic"
                  />
                </Grid.Col>
              </Grid>

              <SimpleGrid cols={1} breakpoints={[{ minWidth: "md", cols: 2 }]}>
                <ProductSellChart />
                <OrderSummaryChart />
              </SimpleGrid>
            </Stack>
          </Tabs.Panel>
          <Tabs.Panel value="overview" pt="xs">
            <Stack>
              <OverviewChart />
            </Stack>
          </Tabs.Panel>
        </Tabs>

        <SimpleGrid cols={1}>
          <Image
            fit="contain"
            sx={{
              width: "100%",
            }}
            radius={"md"}
            src={primaryBannerImg}
            alt="primary banner of motomedic"
          />
        </SimpleGrid>
      </Stack>
      {/* <SimpleTable />
            <PaginationTable /> */}
    </>
  );
};
export default DashboardPage;
