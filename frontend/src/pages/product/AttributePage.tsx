import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  invalidateAttributeQuery,
  useAttributeQuery,
} from "@/queries/attributeQuery";
import { Attribute } from "@/types/defaultTypes";
import {
  Badge,
  Button,
  Grid,
  Group,
  NumberInput,
  SimpleGrid,
  Stack,
  Table,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";

const url = "attributes";
const AttributePage = () => {
  const attrs = useAttributeQuery();
  const form = useCustomForm<{
    name: string;
    priority: number;
    attribute_values: { name: string; id: string | null }[];
  }>({
    initialValues: {
      name: "My cool attribute",
      priority: 0,
      attribute_values: [],
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(1, "Attribute name cannot be empty"),
        priority: z.number(),
        attribute_values: z
          .object({
            name: z.string().min(1, "value cannot be empty"),
            id: z.string().nullable(),
          })
          .array(),
      })
    ),
  });
  const [selectedAttr, setSelectedAttr] = useState<Attribute | null>(null);

  const onEditAttrs = async (attr: Attribute) => {
    try {
      await axiosClient.v1.api
        .put(`attributes/${attr.id}`, form.values)
        .then((res) => res.data);
      notifications.show({
        message: "Attribute updated",
        color: "green",
      });
      form.reset();
      setSelectedAttr(null);
      invalidateAttributeQuery();
    } catch (error) {
      notifications.show({
        message: error.data.message,
        color: "red",
      });
      console.error(error);
    }
  };

  const onAttributeValueDelete = async (id: string | number) => {
    try {
      await axiosClient.v1.api
        .delete(`attributeValues/${id}`)
        .then((res) => res.data);
      notifications.show({
        message: "Attribute value deleted",
        color: "green",
      });
      invalidateAttributeQuery();
    } catch (error) {
      notifications.show({
        message: error.data.message,
        color: "red",
      });
    }
  };

  useEffect(() => {
    if (selectedAttr) {
      form.reset();
      const attribute_values = selectedAttr.values.map((a) => ({
        name: a.name,
        id: String(a.id),
      }));
      form.setValues({
        name: selectedAttr.name,
        priority: selectedAttr.priority,
        attribute_values,
      });

      console.log(
        {
          name: selectedAttr.name,
          priority: selectedAttr.priority,
          attribute_values,
        },
        "test"
      );
    }

    return () => {};
  }, [selectedAttr]);

  const onDeleteAttrs = (attr: Attribute) => {
    axiosClient.v1.api
      .delete(`${url}/${attr.id}`)
      .then((res) => {
        notifications.show({
          message: "Attribute deleted successfully",
          color: "green",
        });
        invalidateAttributeQuery();

        return res.data;
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const onReset = () => {
    const confirm = window.confirm("Are you sure ?");
    if (confirm) {
      form.reset();
      setSelectedAttr(null);
    }
  };
  const onCreate = async (values: typeof form.values) => {
    try {
      const data = await axiosClient.v1.api
        .post(url, values)
        .then((res) => res.data);

      notifications.show({
        message: "Attribute created successfully",
        color: "green",
      });
      form.reset();
      invalidateAttributeQuery();
    } catch (error) {
      console.error(error);
    }
  };
  console.log(attrs, "attrs from fetch");
  return (
    <>
      <Grid>
        <Grid.Col span={7}>
          <BasicSection title="All Attributes">
            <Table withBorder withColumnBorders>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Priority</th>
                  <th>Values</th>
                  <th style={{ width: "20%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attrs
                  ? attrs.map((attr) => {
                      return (
                        <tr key={attr.id}>
                          <td>{attr.name}</td>
                          <td>{attr.priority}</td>
                          <td>
                            {attr.values.map((value) => {
                              return <Badge key={value.id}>{value.name}</Badge>;
                            })}
                          </td>
                          <td>
                            <Group>
                              <Button
                                compact
                                onClick={() => {
                                  setSelectedAttr(attr);
                                }}
                              >
                                edit
                              </Button>
                              <Button
                                compact
                                onClick={() => {
                                  const confirmed =
                                    window.confirm("Are you sure?");
                                  if (confirmed) {
                                    onDeleteAttrs(attr);
                                    form.reset();
                                    setSelectedAttr(null);
                                  }
                                }}
                              >
                                delete
                              </Button>
                            </Group>
                          </td>
                        </tr>
                      );
                    })
                  : null}
              </tbody>
            </Table>
          </BasicSection>
        </Grid.Col>
        <Grid.Col span={5}>
          <BasicSection title={"Create Attribute"}>
            <CreateAttributeForm
              onAttributeValueDelete={(id: number | string, index: number) => {
                if (selectedAttr) {
                  const confirmed = window.confirm("Are you sure ?");
                  if (confirmed) {
                    onAttributeValueDelete(id);
                    form.removeListItem("attribute_values", index);
                  }
                } else {
                  form.removeListItem("attribute_values", index);
                }
              }}
              form={form}
              onReset={onReset}
              onSave={(values) => {
                if (selectedAttr) {
                  onEditAttrs(selectedAttr);
                } else {
                  setSelectedAttr(null);
                  onCreate(values);
                }
              }}
            />
          </BasicSection>
        </Grid.Col>
      </Grid>
    </>
  );
};
const CreateAttributeForm = ({
  form,
  onSave,
  onReset,
  onAttributeValueDelete,
}: {
  onAttributeValueDelete: (id: number | string, index: number) => void;
  onSave: (values: unknown) => void;
  onReset: () => void;
  form: UseFormReturnType<{
    name: string;
    priority: number;
    attribute_values: { name: string; id: string | null }[];
  }>;
}) => {
  const attributeFormRef = useRef<HTMLFormElement>(null);

  const onCreateSubAttr = () => {
    form.insertListItem("attribute_values", { name: "", id: null });
    console.log(form.values, "form values");
  };

  return (
    <form ref={attributeFormRef} onSubmit={form.onSubmit(onSave)}>
      <Stack>
        <TextInput label="Attribute Name" {...form.getInputProps("name")} />
        <NumberInput
          label="Attribute Priority"
          placeholder="set zero for normal priority"
          {...form.getInputProps("priority")}
        />
        <Button
          onClick={() => {
            onCreateSubAttr();
          }}
        >
          Add Attribute Values
        </Button>
        <Table>
          <thead>
            <tr>
              <th>Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {form.values.attribute_values.length <= 0 ? (
              <tr>
                <td
                  colSpan={2}
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}
                >
                  No Sub Attributes
                </td>
              </tr>
            ) : (
              form.values.attribute_values.map((attrValue, attrValueIndex) => {
                return (
                  <tr key={attrValueIndex}>
                    {/* <td>
                                                <TextInput
                                                    onChange={(v) => {
                                                        onSubFieldChange({
                                                            value: v
                                                                .currentTarget
                                                                .value,
                                                            id: attrValue.id,
                                                            propertyName:
                                                                "name",
                                                        });
                                                    }}
                                                />
                                            </td> */}
                    <td>
                      <TextInput
                        {...form.getInputProps(
                          `attribute_values.${attrValueIndex}.name`
                        )}
                      />
                    </td>
                    {/* <td>
                                                <TextInput
                                                    onChange={(v) => {
                                                        onSubFieldChange({
                                                            value: v
                                                                .currentTarget
                                                                .value,
                                                            id: attrValue.id,
                                                            propertyName:
                                                                "value",
                                                        });
                                                    }}
                                                />
                                            </td> */}
                    <td>
                      <Button
                        onClick={() => {
                          onAttributeValueDelete(attrValue.id, attrValueIndex);
                        }}
                        compact
                        size={"xs"}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        <SimpleGrid cols={2}>
          <Button
            type="submit"
            disabled={form.values.attribute_values.length <= 0}
          >
            Save
          </Button>
          <Button
            type="button"
            disabled={form.values.attribute_values.length <= 0}
            onClick={() => {
              onReset();
            }}
          >
            Reset
          </Button>
        </SimpleGrid>
      </Stack>
    </form>
  );
};

export default AttributePage;
