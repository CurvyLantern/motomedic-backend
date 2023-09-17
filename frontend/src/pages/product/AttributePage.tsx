import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import {
  Button,
  Group,
  Grid,
  Table,
  Stack,
  SimpleGrid,
  TextInput,
} from "@mantine/core";
import { useQueries, useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
const url = "v1/product-attribute/all";
const AttributePage = () => {
  const onEditAttrs = (id: number) => {};
  const onDeleteAttrs = (id: number) => {};
  const { data: attrs } = useQuery({
    queryKey: ["attribute"],
    queryFn: async () => {
      return axiosClient.get(url).then((res) => res.data);
    },
    refetchInterval: 20,
  });
  return (
    <>
      <Grid>
        <Grid.Col span={7}>
          <BasicSection title="All Attributes">
            <Table
              withBorder
              withColumnBorders>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Values</th>
                  <th style={{ width: "20%" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {attrs.map((attr) => {
                  return (
                    <tr key={attr.id}>
                      <td>{attr.name}</td>
                      <td>Attr 1</td>
                      <td>
                        <Group>
                          <Button
                            compact
                            onClick={() => {
                              onEditAttrs(0);
                            }}>
                            edit
                          </Button>
                          <Button
                            compact
                            onClick={() => {
                              onDeleteAttrs(0);
                            }}>
                            delete
                          </Button>
                        </Group>
                      </td>
                    </tr>
                  );
                })}
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
  const [subAttrs, setSubAttrs] = useState<
    Array<{ id: number; name: string; value: string }>
  >([]);
  const subIdRef = useRef(0);
  const onCreateSubAttr = () => {
    setSubAttrs((p) => [
      ...p,
      { id: subIdRef.current++, name: "name", value: "value" },
    ]);
  };
  const onReset = () => {
    const confirm = window.confirm("Are you sure ?");
    if (confirm) {
      setSubAttrs([]);
    }
  };
  const onDeleteSubField = (id: number) => {
    setSubAttrs((p) => {
      return p.filter((item) => item.id !== id);
    });
  };
  const onSubFieldChange = ({
    value = "",
    id = 0,
    propertyName = "name",
  }: {
    value: string;
    id: number;
    propertyName: string;
  }) => {
    setSubAttrs((p) => {
      const _subAttr = p.find((item) => item.id === id);
      if (_subAttr) {
        // @ts-expect-error ecpect error at line 102 attribute page
        _subAttr[propertyName] = value;
      }
      return [...p];
    });
  };
  useEffect(() => {
    console.log(subAttrs, "subAttrs");
  }, [subAttrs]);
  return (
    <form>
      <Stack>
        <TextInput label="Attribute Name" />
        <Button
          onClick={() => {
            onCreateSubAttr();
          }}>
          Add Attribute Values
        </Button>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Value</th>
              <th style={{ width: "10%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {subAttrs.length <= 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    textAlign: "center",
                    verticalAlign: "middle",
                  }}>
                  No Sub Attributes
                </td>
              </tr>
            ) : (
              subAttrs.map((attr) => {
                return (
                  <tr key={attr.id}>
                    <td>
                      <TextInput
                        onChange={(v) => {
                          onSubFieldChange({
                            value: v.currentTarget.value,
                            id: attr.id,
                            propertyName: "name",
                          });
                        }}
                      />
                    </td>
                    <td>
                      <TextInput
                        onChange={(v) => {
                          onSubFieldChange({
                            value: v.currentTarget.value,
                            id: attr.id,
                            propertyName: "value",
                          });
                        }}
                      />
                    </td>
                    <td>
                      <Button
                        onClick={() => {
                          onDeleteSubField(attr.id);
                        }}
                        compact
                        size={"xs"}>
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
          <Button disabled={subAttrs.length <= 0}>Save</Button>
          <Button
            disabled={subAttrs.length <= 0}
            onClick={() => {
              onReset();
            }}>
            Reset
          </Button>
        </SimpleGrid>
      </Stack>
    </form>
  );
};

export default AttributePage;
