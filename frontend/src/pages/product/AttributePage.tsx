import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import {
  invalidateAttributeQuery,
  useAttributeQuery,
} from "@/queries/attributeQuery";
import { Attribute } from "@/types/defaultTypes";
import {
  ActionIcon,
  Text,
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
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { TbPencil, TbTrash } from "react-icons/tb";
import { z } from "zod";

const url = "attributes";
const validationSchema = z.object({
  name: z.string().min(1, "Attribute name cannot be empty"),
  priority: z.number(),
  attribute_values: z
    .object({
      name: z.string().min(1, "value cannot be empty"),
      id: z.string().nullable(),
    })
    .array(),
});
type AttributeFormType = z.infer<typeof validationSchema>;
const AttributePage = () => {
  const attrs = useAttributeQuery();
  const form = useCustomForm<AttributeFormType>({
    initialValues: {
      name: "My cool attribute",
      priority: 0,
      attribute_values: [],
    },
    validate: zodResolver(validationSchema),
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
        // @ts-expect-error stupid error
        message: JSON.stringify(error.data.message),
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
        // @ts-expect-error stupid error
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
  }, [selectedAttr]);
  const onDeleteAttrs = (attr: Attribute) => {
    if (!attr) return;
    modals.openConfirmModal({
      title: "Delete this color ?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this Attribute? This action is
          destructive.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { variant: "danger" },
      onCancel: () => {
        notifications.show({
          title: "Cancelled deleting Attribute",
          color: "gray",
          message: "",
        });
      },
      onConfirm: async () => {
        try {
          await axiosClient.v1.api.delete(`${url}/${attr.id}`).then((res) => {
            return res.data;
          });
          notifications.show({
            message: "Attribute deleted successfully",
            color: "green",
          });
        } catch (error) {
          notifications.show({
            // @ts-expect-error stupid error
            message: JSON.stringify(error.data.message),
            color: "red",
          });
        } finally {
          invalidateAttributeQuery();
          form.reset();
          setSelectedAttr(null);
        }
      },
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
  return (
    <BasicSection>
      <Grid h={"100%"}>
        <Grid.Col span={12} lg={7}>
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
                              <ActionIcon
                                onClick={() => {
                                  setSelectedAttr(attr);
                                }}
                                color="blue"
                                variant="outline"
                              >
                                <TbPencil />
                              </ActionIcon>
                              <ActionIcon
                                onClick={() => {
                                  onDeleteAttrs(attr);
                                }}
                                variant="outline"
                                color="red"
                              >
                                <TbTrash />
                              </ActionIcon>
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
        <Grid.Col span={12} lg={5}>
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
    </BasicSection>
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
                    <td>
                      <TextInput
                        {...form.getInputProps(
                          `attribute_values.${attrValueIndex}.name`
                        )}
                      />
                    </td>

                    <td>
                      <ActionIcon
                        onClick={() => {
                          onAttributeValueDelete(attrValue.id, attrValueIndex);
                        }}
                        variant="outline"
                        color="red"
                      >
                        <TbTrash />
                      </ActionIcon>
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
            variant="danger"
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
