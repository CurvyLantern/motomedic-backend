import BasicSection from "@/components/sections/BasicSection";
import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import { Attribute, IdField } from "@/types/defaultTypes";
import {
    Badge,
    NumberInput,
    Button,
    Group,
    Grid,
    Table,
    Stack,
    SimpleGrid,
    TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { zodResolver } from "@mantine/form";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { qc } from "@/providers/QueryProvider";
import {
    invalidateAttributeQuery,
    useAttributeQuery,
} from "@/queries/attributeQuery";

const url = "attributes";
const AttributePage = () => {
    const attrs = useAttributeQuery();
    const onEditAttrs = (attr: Attribute) => {};
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
                                                      {attr.values.map(
                                                          (value) => {
                                                              return (
                                                                  <Badge
                                                                      key={
                                                                          value
                                                                      }
                                                                  >
                                                                      {value}
                                                                  </Badge>
                                                              );
                                                          }
                                                      )}
                                                  </td>
                                                  <td>
                                                      <Group>
                                                          <Button
                                                              compact
                                                              onClick={() => {
                                                                  onEditAttrs(
                                                                      attr
                                                                  );
                                                              }}
                                                          >
                                                              edit
                                                          </Button>
                                                          <Button
                                                              compact
                                                              onClick={() => {
                                                                  onDeleteAttrs(
                                                                      attr
                                                                  );
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
                        <CreateAttributeForm />
                    </BasicSection>
                </Grid.Col>
            </Grid>
        </>
    );
};
const CreateAttributeForm = () => {
    const attributeFormRef = useRef<HTMLFormElement>(null);

    const form = useCustomForm({
        initialValues: {
            name: "My cool attribute",
            priority: 0,
            attribute_values: [],
        },
        validate: zodResolver(
            z.object({
                name: z.string().min(1, "Attribute name cannot be empty"),
                priority: z.number(),
                attribute_values: z.array(
                    z.string().min(1, "value cannot be empty")
                ),
            })
        ),
    });
    const onCreateSubAttr = () => {
        form.insertListItem("attribute_values", "");
        console.log(form.values, "form values");
    };
    const onReset = () => {
        const confirm = window.confirm("Are you sure ?");
        if (confirm) {
            form.reset();
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
        <form ref={attributeFormRef} onSubmit={form.onSubmit(onCreate)}>
            <Stack>
                <TextInput
                    label="Attribute Name"
                    {...form.getInputProps("name")}
                />
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
                            form.values.attribute_values.map(
                                (attrValue, attrValueIndex) => {
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
                                                        `attribute_values.${attrValueIndex}`
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
                                                        // onDeleteSubField(
                                                        //     attrValue.id
                                                        // );
                                                        form.removeListItem(
                                                            "attribute_values",
                                                            attrValueIndex
                                                        );
                                                    }}
                                                    compact
                                                    size={"xs"}
                                                >
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    );
                                }
                            )
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
