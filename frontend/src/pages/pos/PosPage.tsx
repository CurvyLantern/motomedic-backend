import BasicSection from "@/components/sections/BasicSection";

import WithCustomerLayout from "@/layouts/WithCustomerLayout";
import { Grid } from "@mantine/core";

import PosCart from "@/components/pos/PosCart";
import PosProductView from "@/components/pos/PosProductView";

const PosPage = () => {
  return (
    <WithCustomerLayout>
      <BasicSection sx={{ padding: 0 }}>
        <Grid h={"100%"} m={0} gutter={"xs"}>
          <Grid.Col
            span={12}
            lg={8}
            h={"100%"}
            mih={500}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <PosProductView />
          </Grid.Col>
          {/* <MediaQuery smallerThan={"md"} styles={{ display: "none" }}> */}
          <Grid.Col
            span={12}
            lg={4}
            h={"100%"}
            mih={500}
            sx={{ display: "flex", flexDirection: "column" }}
          >
            <PosCart />
          </Grid.Col>
          {/* </MediaQuery> */}
        </Grid>
      </BasicSection>
    </WithCustomerLayout>
  );
};
export default PosPage;
