/* eslint-disable @typescript-eslint/no-explicit-any */
import CrudOptions, { CrudDeleteButton } from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import { useProductSearchByNameSkuId } from "@/hooks/useProductSearch";
import axiosClient from "@/lib/axios";
import {
  deleteServiceType,
  invalidateServiceTypesAllQuery,
  useServiceTypesAllQuery,
} from "@/queries/serviceTypeQuery";
import {
  Box,
  Button,
  Container,
  Divider,
  Flex,
  Grid,
  Group,
  Modal,
  NumberInput,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Textarea,
  Title,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useMemo, useState } from "react";
import { TbPlus } from "react-icons/tb";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
  price: z.number(),
  description: z.string(),
  serviceTypeProducts: z
    .object({ product_sku: z.string(), quantity: z.number() })
    .array(),
});
type FormValue = z.infer<typeof schema>;
const PackagePage = () => {
  const form = useCustomForm<FormValue>({
    initialValues: {
      name: "",
      price: 0,
      description: "",
      serviceTypeProducts: [],
    },
    validate: zodResolver(schema),
  });

  const servicePackages = useServiceTypesAllQuery();
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedPackage, setSelectedPackage] = useState<null | {
    id: string;
    name: string;
    price: string | number;
    description: string;
    service_type_products: {
      id: number | string;
      product_sku: string;
      quantity: number;
      description: string;
    }[];
  }>(null);
  const [modalType, setModalType] = useState<"view" | "edit">("view");

  const [serviceTypeProducts, setServiceTypeProducts] = useState([]);
  const [serviceTypeProductSelectInput, setServiceTypeProductSelectInput] =
    useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<
    { name: string; quantity: number; sku: string; unit_price: number }[]
  >([]);
  const { products, handleSearchInputChange, searchQuery } =
    useProductSearchByNameSkuId();

  const selectProductsData = useMemo(() => {
    return products
      ? products.map((p) => ({ label: p.name || "", value: p.sku || "" }))
      : [];
  }, [products]);

  const onSubmit = (values: typeof form.values) => {
    const data = {
      ...values,
      service_products: selectedProducts.map((p) => ({
        product_sku: p.sku,
        quantity: p.quantity,
      })),
    };
    axiosClient.v1.api
      .post("serviceTypes", data)
      .then((data) => {
        notifications.show({
          message: "Package added successfully",
          color: "green",
        });
        form.reset();
        setSelectedProducts([]);
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

  const selectedProductsSum = selectedProducts.reduce((acc, p) => {
    acc += p.unit_price * p.quantity;
    return acc;
  }, 0);

  return (
    <BasicSection>
      <Container>
        <Stack>
          <Tabs defaultValue={"view"}>
            <Tabs.List>
              <Tabs.Tab value="view">View Packages</Tabs.Tab>
              <Tabs.Tab value="create">Create Package</Tabs.Tab>
            </Tabs.List>

            <Tabs.Panel value="view">
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
                      <Table>
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Product Name</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedPackage?.service_type_products.map(
                            (prod, prodIdx) => {
                              return (
                                <tr key={prodIdx}>
                                  <td>{prodIdx + 1}</td>
                                  <td>{prod.product_sku}</td>
                                  <td>{prod.quantity}</td>
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </Table>
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
            </Tabs.Panel>
            <Tabs.Panel value="create">
              <Stack>
                <form onSubmit={form.onSubmit(onSubmit)}>
                  <BasicSection
                    title="Service packages"
                    headerRightElement={
                      <Button type="submit">
                        <TbPlus />
                      </Button>
                    }
                  >
                    <SimpleGrid cols={2}>
                      <BasicSection>
                        <Stack>
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
                        </Stack>
                      </BasicSection>
                      <BasicSection>
                        <Stack>
                          <Group>
                            <Select
                              sx={{
                                flex: 1,
                              }}
                              value={serviceTypeProductSelectInput}
                              nothingFound="No products"
                              placeholder="Type sku,name,or id to search product"
                              searchValue={searchQuery}
                              onChange={(v) => {
                                setServiceTypeProductSelectInput(v);
                                const p = products.find((p) => p.sku === v);
                                if (p) {
                                  if (
                                    selectedProducts.find(
                                      (sp) => sp.sku === p.sku
                                    )
                                  ) {
                                    return;
                                  }
                                  setSelectedProducts((prev) => [
                                    ...prev,
                                    {
                                      name: p.name ? p.name : "",
                                      sku: p.sku ? p.sku : "",
                                      quantity: 0,
                                      unit_price: p.price?.selling_price ?? 0,
                                    },
                                  ]);
                                  // form.insertListItem("serviceTypeProducts", {
                                  //   product_sku: p.sku,
                                  //   quantity: 0,
                                  // });
                                }
                              }}
                              onSearchChange={handleSearchInputChange}
                              data={selectProductsData}
                            />
                            <Button>Add</Button>
                          </Group>
                          <Table>
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Quantity</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {selectedProducts.map((p, idx) => {
                                return (
                                  <tr key={idx}>
                                    <td>
                                      <Text>{p.name}</Text>
                                    </td>
                                    <td
                                      style={{
                                        width: 150,
                                      }}
                                    >
                                      <NumberInput
                                        onChange={(v) => {
                                          setSelectedProducts((prev) => {
                                            prev[idx].quantity = Number(v);
                                            return [...prev];
                                          });
                                        }}
                                        sx={{ flex: 1 }}
                                      />
                                    </td>
                                    <td>
                                      <CrudDeleteButton
                                        onDelete={() => {
                                          if (
                                            serviceTypeProductSelectInput ===
                                            p.sku
                                          ) {
                                            setServiceTypeProductSelectInput(
                                              null
                                            );
                                          }
                                          setSelectedProducts((prev) => {
                                            const arr = prev.filter(
                                              (prod) => prod.sku !== p.sku
                                            );
                                            return arr;
                                          });
                                        }}
                                      />
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </Table>
                        </Stack>
                      </BasicSection>
                    </SimpleGrid>
                  </BasicSection>
                </form>
                <Stack>
                  <Box>Cost Estimation</Box>
                  <Stack spacing={"xs"}>
                    {selectedProducts.map((p, idx) => {
                      const sum = p.quantity * p.unit_price;
                      return (
                        <Group
                          sx={{
                            textAlign: "center",
                            borderBottom:
                              idx === selectedProducts.length - 1
                                ? 0
                                : "1px solid",
                          }}
                          grow
                          align="center"
                          key={p.sku}
                        >
                          {/* <Box sx={{ flex: 0 }}>{idx + 1}</Box> */}
                          <Box>{p.name}</Box>
                          <Box>
                            {p.quantity}pcs x {p.unit_price}৳
                          </Box>
                          <Box>{sum}৳</Box>
                        </Group>
                      );
                    })}
                    <Divider />
                    <Title order={4}>
                      Estimated Total Cost = {selectedProductsSum}৳
                    </Title>
                    <Group>
                      <Title order={4}>
                        Suggested Package Price = {selectedProductsSum * 1.5}৳
                      </Title>
                      <Text fz={"sm"}>[NB: 20% profit]</Text>
                    </Group>
                  </Stack>
                </Stack>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Stack>
      </Container>
    </BasicSection>
  );
};

export default PackagePage;
