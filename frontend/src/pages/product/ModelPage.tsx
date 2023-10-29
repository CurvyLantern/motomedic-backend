import CrudOptions, { CrudDeleteButton } from "@/components/common/CrudOptions";
import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import { useBrandQuery } from "@/queries/brandQuery";
import {
  invalidateProductModelQuery,
  useProductModelQuery,
} from "@/queries/productModelQuery";
import { ProductModels } from "@/types/defaultTypes";
import { useBrandSelectData } from "@/utils/selectFieldsData";
import {
  Text,
  Box,
  Button,
  Grid,
  Modal,
  MultiSelect,
  Stack,
  Table,
  Tabs,
  Title,
  TextInput,
  Flex,
  rem,
  SimpleGrid,
} from "@mantine/core";
import { zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";

const validationSchema = z.object({
  names: z.string().min(1).array(),
  brand_ids: z.string().min(1).array(),
});
type modelFormType = z.infer<typeof validationSchema>;
const ModelPage = () => {
  return (
    <div>
      <Tabs
        defaultValue={"create"}
        variant="pills"
        styles={(theme) => ({
          tab: {
            ...theme.fn.focusStyles(),
            backgroundColor:
              theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
            color:
              theme.colorScheme === "dark"
                ? theme.colors.dark[0]
                : theme.colors.gray[9],
            border: `${rem(1)} solid ${
              theme.colorScheme === "dark"
                ? theme.colors.dark[6]
                : theme.colors.gray[4]
            }`,
            padding: `${theme.spacing.xs} ${theme.spacing.md}`,
            cursor: "pointer",
            fontSize: theme.fontSizes.sm,
            display: "flex",
            alignItems: "center",

            "&:disabled": {
              opacity: 0.5,
              cursor: "not-allowed",
            },

            "&:not(:first-of-type)": {
              borderLeft: 0,
            },

            "&:first-of-type": {
              borderTopLeftRadius: theme.radius.md,
              borderBottomLeftRadius: theme.radius.md,
            },

            "&:last-of-type": {
              borderTopRightRadius: theme.radius.md,
              borderBottomRightRadius: theme.radius.md,
            },

            "&[data-active]": {
              backgroundColor: theme.colors.blue[7],
              borderColor: theme.colors.blue[7],
              color: theme.white,
            },
          },

          tabIcon: {
            marginRight: theme.spacing.xs,
            display: "flex",
            alignItems: "center",
          },

          tabsList: {
            paddingTop: theme.spacing.xs,
            paddingBottom: theme.spacing.xs,
          },
        })}
      >
        <Tabs.List grow position="center">
          <Tabs.Tab value="create">Create Model</Tabs.Tab>
          <Tabs.Tab value="view">View Model</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="create">
          <CreateModel />
        </Tabs.Panel>
        <Tabs.Panel value="view">
          <ViewModel />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
};

const editModalValidationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand_ids: z.string().min(1, "Id cannot be empty").array().nullable(),
});
type editFormType = z.infer<typeof editModalValidationSchema>;
const ViewModel = () => {
  const editForm = useCustomForm<editFormType>({
    initialValues: {
      name: "",
      brand_ids: [],
    },
    validate: zodResolver(editModalValidationSchema),
  });
  const productModels = useProductModelQuery();
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedModel, setSelectedModel] = useState<ProductModels | null>(
    null
  );
  const [modalType, setModalType] = useState<"view" | "edit">("view");
  const onView = (model: ProductModels) => {
    setSelectedModel(model);
    setModalType("view");
    openModal();
  };
  const onEdit = (model: ProductModels) => {
    setSelectedModel(model);
    editForm.setFieldValue("name", model.name);
    setModalType("edit");

    openModal();
  };
  const onDelete = (model: ProductModels) => {
    axiosClient.v1.api
      .delete(`productModels/${model.id}`)
      .then((data) => {
        console.log(data, "response from server");
        notifications.show({
          message: "ProductModel deleted successfully",
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          message: JSON.stringify(error.data.message),
          color: "red",
        });
      })
      .finally(() => {
        invalidateProductModelQuery();
      });
  };

  const brandsSelect = useBrandSelectData();
  const filteredBrandsSelected = useMemo(() => {
    if (brandsSelect && selectedModel) {
      return brandsSelect?.filter(
        (brand) =>
          !selectedModel?.brands.find((selB) => {
            return selB.id.toString() === brand.value;
          })
      );
    }
    return [];
  }, [brandsSelect, selectedModel]);

  const onEditSubmit = (values: typeof editForm.values) => {
    console.log(values, "edit values");
  };

  const onProductModelBrandDelete = (mid: string, bid: string) => {
    axiosClient.v1.api
      .delete(`productModels/${mid}/brand/${bid}`)
      .then((res) => {
        console.log(res.data, "response from server");

        notifications.show({
          message: "Brand Deleted successfully",
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          message: JSON.stringify(error.data.message),
          color: "red",
        });
      })
      .finally(() => {
        invalidateProductModelQuery();
      });
  };

  const onUpdateName = (mid: string | null) => {
    if (!mid) return;
    axiosClient.v1.api
      .put(`productModels/${mid}`, {
        name: editForm.values.name,
      })
      .then((data) => {
        console.log(data, "from server");
        notifications.show({
          message: "Name Changed successfully",
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          message: JSON.stringify(error.data.message),
          color: "red",
        });
      })
      .finally(() => {
        invalidateProductModelQuery();
      });
  };

  const onSaveNewBrand = (mid: string | null) => {
    if (!mid) return;
    axiosClient.v1.api
      .put(`productModels/${mid}`, {
        brand_ids: editForm.values.brand_ids,
      })
      .then((data) => {
        console.log(data, "from server");
        notifications.show({
          message: "Brands added successfully",
          color: "green",
        });
      })
      .catch((error) => {
        notifications.show({
          message: JSON.stringify(error.data.message),
          color: "red",
        });
      })
      .finally(() => {
        invalidateProductModelQuery();
      });
  };

  return (
    <>
      <Modal
        centered
        opened={modalOpened}
        onClose={() => {
          closeModal();
        }}
      >
        {modalType === "view" ? (
          <Stack>
            <Title order={5}>Product Model Info</Title>
            <Text>ID : {selectedModel?.id}</Text>
            <Text>Name : {selectedModel?.name}</Text>
            <Text>Associated Brands :</Text>
            <Table>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Brand Name</th>
                </tr>
              </thead>
              <tbody>
                {selectedModel?.brands?.map((brand, brandIdx) => {
                  return (
                    <tr key={brand.id}>
                      <td>{brandIdx + 1}</td>
                      <td>{brand.name}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Stack>
        ) : null}
        {modalType === "edit" ? (
          <Stack>
            <Flex justify={"space-between"}>
              <Title order={5}>Edit Product Model</Title>
            </Flex>
            <Flex align={"center"} gap={"lg"}>
              <Text>Name :</Text>
              <TextInput {...editForm.getInputProps("name")} />
              <Button
                onClick={() =>
                  onUpdateName(
                    selectedModel && selectedModel.id ? selectedModel.id : null
                  )
                }
              >
                Save
              </Button>
            </Flex>
            <Text>Associated Brands :</Text>
            <Table>
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Brand Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {selectedModel?.brands?.map((brand, brandIdx) => {
                  return (
                    <tr key={brand.id}>
                      <td>{brandIdx + 1}</td>
                      <td>{brand.name}</td>
                      <td>
                        <CrudDeleteButton
                          onDelete={() => {
                            const confirmed = window.confirm("Are you sure ? ");
                            if (confirmed) {
                              onProductModelBrandDelete(
                                selectedModel.id,
                                brand.id
                              );
                            }
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <Text>Associate New Brands :</Text>
            <MultiSelect
              {...editForm.getInputProps("brand_ids")}
              data={filteredBrandsSelected ? filteredBrandsSelected : []}
              limit={20}
              searchable
              placeholder="Select brands"
              label="Which brands do this model belong to?"
            />
            <Button
              disabled={
                editForm.values.brand_ids
                  ? editForm.values.brand_ids.length <= 0
                  : true
              }
              onClick={() => onSaveNewBrand(selectedModel.id)}
            >
              Save new brands
            </Button>
          </Stack>
        ) : null}
      </Modal>
      <Table>
        <thead>
          <tr>
            <th>SL</th>
            <th>Model Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {productModels?.data?.map((model, modelIdx) => {
            return (
              <tr>
                <td>{modelIdx + 1}</td>
                <td>{model.name}</td>
                <td>
                  <CrudOptions
                    onDelete={() => {
                      onDelete(model);
                    }}
                    onEdit={() => {
                      onEdit(model);
                    }}
                    onView={() => onView(model)}
                  />
                </td>
              </tr>
            );
          })}
          <tr></tr>
        </tbody>
      </Table>
    </>
  );
};

const CreateModel = () => {
  const form = useCustomForm<modelFormType>({
    initialValues: {
      names: [],
      brand_ids: [],
    },
    validate: zodResolver(validationSchema),
  });
  const brands = useBrandQuery();
  const brandsSelect = useBrandSelectData();
  const filteredBrands = useMemo(() => {
    if (form.values.brand_ids.length > 0 && form.values.brand_ids) {
      const selectedBrands = form.values.brand_ids.map((id) =>
        brands?.data.find((b) => b.id.toString() === id)
      );
      const headerData = selectedBrands.map((b) => b?.name);
      const maxLength = Math.max(
        ...selectedBrands.map((b) => (b ? b.product_models.length : 0))
      );
      const rowData = [];
      for (let i = 0; i <= maxLength; i++) {
        const temp: Array<ProductModels | null> = [];
        selectedBrands.forEach((b) => {
          if (b) {
            const exists = b.product_models[i];
            temp.push(exists ? exists : null);
          }
        });
        rowData.push(temp);
      }
      return {
        headerData,
        rowData,
      };
    } else {
      return {
        headerData: [],
        rowData: [],
      };
    }
  }, [form.values.brand_ids, brands]);

  const onSubmit = (values: typeof form.values) => {
    console.log(values, "values");
    try {
      axiosClient.v1.api.post("productModels", values).then((res) => res.data);
      notifications.show({
        message: "Created model successfully",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        // @ts-expect-error error is not typed;
        message: JSON.stringify(error.data.message),
        color: "red",
      });
    } finally {
      invalidateProductModelQuery();
    }
  };
  return (
    <BasicSection title="Create a model">
      <Grid>
        <Grid.Col span={12}>
          <form onSubmit={form.onSubmit(onSubmit)}>
            <SimpleGrid
              cols={1}
              breakpoints={[{ minWidth: "md", cols: 2, spacing: "md" }]}
            >
              <MultiSelect
                data={[]}
                label="Model Names"
                searchable
                creatable
                getCreateLabel={(query) => `+ Create ${query}`}
                onCreate={(query) => {
                  form.insertListItem(
                    "names",
                    query.trim().toUpperCase().split(" ").join("-")
                  );
                  return query;
                }}
              />
              <MultiSelect
                {...form.getInputProps("brand_ids")}
                data={brandsSelect ? brandsSelect : []}
                limit={20}
                searchable
                placeholder="Select brands"
                label="Which Brands do this model belong to?"
              />

              <Box>
                <Button type="submit">Submit</Button>
              </Box>
            </SimpleGrid>
          </form>
        </Grid.Col>
        <Grid.Col span={12}>
          <Table
            withColumnBorders
            withBorder
            // @ts-expect-error stupid error
            sx={{
              "&  th, &  td": {
                textAlign: "center !important",
              },
            }}
          >
            <thead>
              <tr>
                <th>SL</th>
                {filteredBrands.headerData.map((brandName) => (
                  <th key={brandName}>{brandName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredBrands.rowData.map((modelArr, modelArrIdx) => {
                return (
                  <tr key={modelArrIdx}>
                    <td>{modelArrIdx + 1}</td>
                    {modelArr.map((model, modelIdx) => {
                      return <td key={modelIdx}>{model ? model.name : "-"}</td>;
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Grid.Col>
      </Grid>
    </BasicSection>
  );
};

export default ModelPage;
