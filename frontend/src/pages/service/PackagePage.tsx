import CrudOptions from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  deleteServiceType,
  invalidateServiceTypesAllQuery,
  useServiceTypesAllQuery,
} from "@/queries/serviceTypeQuery";
import {
  Button,
  Container,
  Flex,
  Grid,
  Modal,
  NumberInput,
  SimpleGrid,
  Table,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { TbPlus } from "react-icons/tb";

const PackagePage = () => {
  const form = useCustomForm({
    initialValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  const servicePackages = useServiceTypesAllQuery();
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedPackage, setSelectedPackage] = useState<null | {
    id: string;
    name: string;
    price: string | number;
    description: string;
  }>(null);
  const [modalType, setModalType] = useState<"view" | "edit">("view");

  const onSubmit = (values: typeof form.values) => {
    axiosClient.v1.api
      .post("serviceTypes", values)
      .then((data) => {
        notifications.show({
          message: "Package added successfully",
          color: "green",
        });
        form.reset();
      })
      .catch((error) => {
        notifications.show({
          message: JSON.stringify(error.data.message),
          color: "red",
        });
      })
      .finally(() => {
        invalidateServiceTypesAllQuery();
      });
  };
  const onEditSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.currentTarget ?? undefined);
    const data = {};
    for (const [k, v] of formData.entries()) {
      data[k] = v;
    }
    if (!selectedPackage) return;
    console.log(selectedPackage, "selectedPackage");
    await axiosClient.v1.api
      .put(`serviceTypes/${selectedPackage.id}`, data)
      .then((data) => {
        notifications.show({
          message: "Service Updated successfully",
          color: "green",
        });
        closeModal();
        setSelectedPackage(null);
        return data;
      })
      .catch((error) => {
        notifications.show({
          message: JSON.stringify(error.data.message),
          color: "red",
        });
      })
      .finally(() => {
        invalidateServiceTypesAllQuery();
      });
  };

  return (
    <BasicSection>
      <Container>
        <Grid>
          <Grid.Col span={12} lg={7}>
            <BasicSection title="All Packages">
              <Modal opened={modalOpened} onClose={closeModal} centered>
                {modalType === "edit" ? (
                  <form onSubmit={onEditSubmit}>
                    <SimpleGrid cols={1}>
                      <TextInput
                        defaultValue={selectedPackage?.name}
                        name="name"
                        label="Package name"
                      />
                      <NumberInput
                        defaultValue={Number(selectedPackage?.price)}
                        name="price"
                        label="Package Price"
                      />
                      <Textarea
                        defaultValue={selectedPackage?.description}
                        name="description"
                        label="Package description"
                      />
                      <Button type="submit">Submit</Button>
                    </SimpleGrid>
                  </form>
                ) : (
                  <SimpleGrid cols={1}>
                    <Text>Package Name : {selectedPackage?.name}</Text>
                    <Text>Package price : {selectedPackage?.price}</Text>
                    <Text>
                      Package description : {selectedPackage?.description}
                    </Text>
                  </SimpleGrid>
                )}
              </Modal>
              <Table withBorder withColumnBorders>
                <thead>
                  <tr>
                    <th>Package Name</th>
                    <th>Package Price</th>
                    <th>Package Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {servicePackages?.data?.map((pkg) => {
                    return (
                      <tr key={pkg.id}>
                        <td>{pkg.name}</td>
                        <td>{pkg.price}</td>
                        <td>{pkg.description}</td>
                        <td>
                          <CrudOptions
                            onView={() => {
                              setSelectedPackage(pkg);
                              setModalType("view");
                              openModal();
                            }}
                            onEdit={() => {
                              setSelectedPackage(pkg);
                              setModalType("edit");
                              openModal();
                            }}
                            onDelete={() => {
                              deleteServiceType(pkg.id, () => {});
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </BasicSection>
          </Grid.Col>
          <Grid.Col span={12} lg={5}>
            <form onSubmit={form.onSubmit(onSubmit)}>
              <BasicSection
                title="Service packages"
                headerRightElement={
                  <Button type="submit">
                    <TbPlus />
                  </Button>
                }
              >
                <SimpleGrid cols={1}>
                  <TextInput
                    {...form.getInputProps("name")}
                    label="Package name"
                  />
                  <NumberInput
                    {...form.getInputProps("price")}
                    label="Package Price"
                  />
                  <Textarea
                    {...form.getInputProps("description")}
                    label="Package description"
                  />
                </SimpleGrid>
              </BasicSection>
            </form>
          </Grid.Col>
        </Grid>
      </Container>
    </BasicSection>
  );
};

export default PackagePage;
