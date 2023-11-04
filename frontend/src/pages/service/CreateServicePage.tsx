/* eslint-disable @typescript-eslint/no-explicit-any */
import ScrollWrapper2 from "@/components/scrollWrapper/ScrollWrapper2";
import BasicSection from "@/components/sections/BasicSection";
import { ServiceFieldWrapper } from "@/components/service/fields/ServiceField";
import WithCustomerLayout, {
  SelectCustomerButton,
} from "@/layouts/WithCustomerLayout";
import {
  ThemeIcon,
  Textarea,
  Grid,
  Select,
  List,
  TextInput,
  Button,
  Box,
  Stack,
  Center,
  Table,
  Tabs,
  ActionIcon,
  Flex,
  Drawer,
  Modal,
  SelectItem,
} from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { useMemo, useState } from "react";
import {
  TbPlus,
  TbShoppingCart,
  TbTrash,
  TbUserCog,
  TbX,
} from "react-icons/tb";
import { FaPlus } from "react-icons/fa6";
import PosPage from "../pos/PosPage";
import BaseDrawer from "@/components/drawer/BaseDrawer";
import { useMechanicQuery } from "@/queries/mechanicQuery";
import { useServiceTypesAllQuery } from "@/queries/serviceTypeQuery";

const CreateServicePage = () => {
  return (
    <WithCustomerLayout>
      {/* <ServiceFieldWrapper /> */}
      <ServicePage2 />
    </WithCustomerLayout>
  );
};

const ServicePage2 = () => {
  const [allProblemDetails, allProblemDetailsHandler] = useListState<string>();
  const [packageInputValue, setPackageInputValue] = useState("");

  const servicePackages = useServiceTypesAllQuery();
  const selectDataServicePackages = useMemo(() => {
    return servicePackages && servicePackages.data
      ? servicePackages.data.map((v) => ({
          label: v.name,
          value: v.id.toString(),
        }))
      : [];
  }, [servicePackages]);

  const onConfirm = () => {
    const data = {
      problem: allProblemDetails,
      packageInputValue,
      selectedPackage: servicePackages?.data?.find(
        (p) => p.id.toString() === packageInputValue
      ),
    };

    console.log(data, "data");
  };

  return (
    <Grid h={"100%"}>
      <Grid.Col
        span={12}
        lg={6}
        sx={{ display: "flex", flexDirection: "column", gap: 5 }}
      >
        <ServiceInfo
          packageInputValue={packageInputValue}
          onChangePackageInput={(v) => setPackageInputValue(v)}
          selectPackageData={selectDataServicePackages}
          onEnterProblemDetail={allProblemDetailsHandler.append}
        />

        <ServiceDetails
          onConfirm={onConfirm}
          allProblemDetails={allProblemDetails}
          onProblemDelete={(idx: number) => {
            allProblemDetailsHandler.remove(idx);
          }}
        />
      </Grid.Col>
      <Grid.Col span={12} lg={6}>
        <AllServicesTab />
      </Grid.Col>
    </Grid>
  );
};

const AllServicesTab = () => {
  const [posDrawerOpened, { close: closePosDrawer, open: openPosDrawer }] =
    useDisclosure(false);
  const [
    mechanicModalOpened,
    { close: closeMechanicModal, open: openMechanicModal },
  ] = useDisclosure(false);

  const mechanics = useMechanicQuery();
  console.log(mechanics, " mechanics");

  const onProductAdd = () => {
    openPosDrawer();
  };

  const onMechanicAdd = () => {
    openMechanicModal();
  };

  const onDone = () => {};
  return (
    <>
      <BasicSection title="Services">
        <Tabs defaultValue="waiting">
          <Tabs.List>
            <Tabs.Tab value="waiting">Waiting</Tabs.Tab>
            <Tabs.Tab value="running">Running</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="waiting">
            <ServiceListTable
              type="waiting"
              onProductAdd={onProductAdd}
              onMechanicAdd={onMechanicAdd}
              onDone={onDone}
              rowData={Array(2).fill(0)}
            />
          </Tabs.Panel>
          <Tabs.Panel value="running">
            <ServiceListTable
              type="running"
              onProductAdd={onProductAdd}
              onMechanicAdd={onMechanicAdd}
              onDone={onDone}
              rowData={Array(2).fill(0)}
            />
          </Tabs.Panel>
        </Tabs>
      </BasicSection>
      <Modal centered opened={mechanicModalOpened} onClose={closeMechanicModal}>
        <Table>
          <thead>
            <tr>
              <th>SL</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {mechanics?.data?.map((mechanic, mechanicIdx) => {
              return (
                <tr key={mechanic.id}>
                  <td>{mechanicIdx + 1}</td>
                  <td>{mechanic.name}</td>
                  <td>{mechanic.phone}</td>
                  <td>{mechanic.status}</td>
                  <td>
                    <Button compact size="xs">
                      Assign
                    </Button>
                  </td>
                  <td></td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Modal>
      <BaseDrawer
        position="top"
        opened={posDrawerOpened}
        onClose={closePosDrawer}
        size={"100%"}
      >
        <PosPage />
      </BaseDrawer>
      {/* <Drawer

      >
        <Drawer.Header>
          <Drawer.CloseButton variant="danger">
            <TbX />
          </Drawer.CloseButton>
        </Drawer.Header>
      </Drawer> */}
    </>
  );
};

const ServiceListTable = ({
  onProductAdd,
  onMechanicAdd,
  onDone,
  type,
  rowData,
}: {
  rowData: Array<any>;
  onProductAdd: () => void;
  onMechanicAdd: () => void;
  onDone: () => void;
  type: "waiting" | "running";
}) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Elapsed Time</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {rowData.map((rowItem, rowIndex) => {
          return (
            <tr key={rowIndex}>
              <td>{rowIndex + 1}</td>
              <td>{0}</td>
              <td>{type}</td>
              <td style={{ color: "white" }}>
                <Center
                  sx={(theme) => ({
                    width: "100%",
                    gap: theme.spacing.sm,
                  })}
                >
                  <ActionIcon onClick={onProductAdd} variant="gradient">
                    <TbShoppingCart />
                  </ActionIcon>
                  <ActionIcon onClick={onMechanicAdd} variant="gradient">
                    <TbUserCog />
                  </ActionIcon>
                  <Button onClick={onDone} compact size="xs" variant="gradient">
                    Done
                  </Button>
                </Center>
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

const ServiceDetails = ({
  allProblemDetails,
  onProblemDelete,
  onConfirm,
}: {
  allProblemDetails: string[];
  onProblemDelete: (idx: number) => void;
  onConfirm: () => void;
}) => {
  const confirmDisabled = allProblemDetails.length <= 0;
  return (
    <BasicSection
      title="Problems"
      mih={300}
      headerRightElement={
        <Button disabled={confirmDisabled} onClick={onConfirm}>
          Confirm
        </Button>
      }
    >
      <ScrollWrapper2>
        <Stack px={"xs"} spacing={"xs"}>
          {allProblemDetails.length > 0 ? (
            allProblemDetails.map((detail, detailIdx) => {
              return (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",

                    justifyContent: "space-between",
                    textTransform: "capitalize",

                    fontSize: 12,
                    fontWeight: 500,
                  }}
                  key={detailIdx}
                >
                  <p>{detail}</p>
                  <Button
                    onClick={() => {
                      onProblemDelete(detailIdx);
                    }}
                    variant="danger"
                    compact
                    size="xs"
                  >
                    <TbTrash />
                  </Button>
                </Box>
              );
            })
          ) : (
            <Center>Nothing here</Center>
          )}
        </Stack>
      </ScrollWrapper2>
    </BasicSection>
  );
};

const ServiceInfo = ({
  onEnterProblemDetail,
  selectPackageData,
  onChangePackageInput,
  packageInputValue,
}: {
  packageInputValue: string;
  onChangePackageInput: (v: string) => void;
  selectPackageData: SelectItem[];
  onEnterProblemDetail: (detail: string) => void;
}) => {
  const [problemDetailsInput, setProblemDetailsInput] = useState("");
  const onEnterDetails = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!problemDetailsInput) return;
    onEnterProblemDetail(problemDetailsInput);
    setProblemDetailsInput("");
  };

  return (
    <BasicSection
      title="Service Info"
      headerRightElement={<SelectCustomerButton />}
    >
      <Select
        label="Service Type"
        data={selectPackageData}
        value={packageInputValue}
        onChange={(v) => onChangePackageInput(v ? v : "")}
      />
      <form onSubmit={onEnterDetails}>
        <TextInput
          label="Problem Details"
          placeholder="Enter Problem Details one by one"
          value={problemDetailsInput}
          onChange={(evt) => setProblemDetailsInput(evt.currentTarget.value)}
        />
      </form>
    </BasicSection>
  );
};

export default CreateServicePage;
