import axiosClient from "@/lib/axios";
import {
  ActionIcon,
  Box,
  Button,
  ColorInput,
  Group,
  Modal,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  createStyles,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useMutation, useQuery } from "@tanstack/react-query";
import colorFn from "color";
import { TbEdit, TbPencil, TbTrash } from "react-icons/tb";
import { z } from "zod";
import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import { IdField, ProductFieldInputType } from "@/types/defaultTypes";
import { qc } from "@/providers/QueryProvider";
import { invalidateColorQuery, useColorQuery } from "@/queries/colorQuery";
import { useDisclosure } from "@mantine/hooks";
import useCustomForm from "@/hooks/useCustomForm";
import { useState } from "react";

type MyColor = {
  name: string;
  hexcode: string;
  id: IdField;
  [k: string]: unknown;
};

const useTableStyles = createStyles({
  th: {
    textTransform: "uppercase",
  },
});
const url = "colors";
const fields: {
  data: string;
  label: string;
  name: string;
  type: ProductFieldInputType;
}[] = [
  {
    data: "",
    label: "Name",
    name: "name",
    type: fieldTypes.text,
  },
  {
    data: "",
    label: "color",
    name: "hexcode",
    type: fieldTypes.colorInput,
  },
];
const ColorPage = () => {
  return (
    <BasicSection>
      <Tabs defaultValue="view">
        <Tabs.List>
          <Tabs.Tab value="view">View Colors</Tabs.Tab>
          <Tabs.Tab value="create">Create Color</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="view">
          <ViewColors />
        </Tabs.Panel>
        <Tabs.Panel value="create">
          <CreateColors />
        </Tabs.Panel>
      </Tabs>
    </BasicSection>
  );
};

const CreateColors = () => {
  const form = useForm({
    initialValues: {
      name: "",
      hexcode: "",
    },

    validate: {
      name: () => null,
      hexcode: () => null,
    },
  });
  return (
    <BasicSection title="Create Category">
      <form
        onSubmit={form.onSubmit(async (values) => {
          console.log(values);
          try {
            await axiosClient.v1.api.post(url, values).then((res) => res.data);
            notifications.show({
              message: "Color created successfully",
              color: "green",
            });
          } catch (error) {
            notifications.show({
              message: JSON.stringify(error.data.message),
              color: "red",
            });
          } finally {
            invalidateColorQuery();
          }
        })}
      >
        <Stack maw={500}>
          {fields.map((field, fieldIdx) => {
            return <BaseInputs key={fieldIdx} field={field} form={form} />;
          })}
          <Button type="submit">Confirm</Button>
        </Stack>
      </form>
    </BasicSection>
  );
};
const ViewColors = () => {
  const { classes } = useTableStyles();
  // const { data: colors, refetch } = useQuery<Array<MyColor>>({
  //   queryKey: ["colors"],
  //   queryFn: () => {
  //     return axiosClient.v1.api.get(url).then((res) => res.data);
  //   },
  // });
  const colors = useColorQuery();

  const onDelete = (color: MyColor) => {
    if (!color) return;
    modals.openConfirmModal({
      title: "Delete this color ?",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this color? This action is
          destructive.
        </Text>
      ),
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { variant: "danger" },
      onCancel: () => {
        notifications.show({
          title: "Cancelled deleting color",
          color: "gray",
          message: "",
        });
      },
      onConfirm: async () => {
        try {
          await axiosClient.v1.api
            .delete(`${url}/${color.id}`)
            .then((res) => res.data);
          notifications.show({
            message: "Color deleted successfully",
            color: "green",
          });
        } catch (error) {
          notifications.show({
            message: JSON.stringify(error.data.message),
            color: "red",
          });
        } finally {
          invalidateColorQuery();
        }
      },
    });
  };

  const tRows = colors?.data
    ?.map((c) => ({
      ...c,
      code: c.hexcode[0] === "#" ? c.hexcode.slice(1) : c.hexcode,
    }))
    .map((colorItem) => {
      const color = colorFn(`#${colorItem.code}`);
      const rgb = color.rgb().string();

      return (
        <tr
          key={colorItem.id}
          style={
            {
              // backgroundColor: `#${hex}`,
              // color: color.negate() as unknown as string,
            }
          }
        >
          <td style={{ textTransform: "capitalize" }}>{colorItem.name}</td>
          <td>#{colorItem.code}</td>
          <td>{rgb}</td>
          <td>
            <Box
              sx={{
                backgroundColor: `#${colorItem.code}`,
                height: 30,
                width: 30,
                border: "1px solid #cacaca",
                borderRadius: "50%",
                boxShadow: "0 0 5px #00000033",
              }}
            ></Box>
          </td>
          <td>
            <Group position="center" align="center">
              <ActionIcon
                onClick={() => {
                  setSelectedColorForEdit(colorItem);
                }}
                color="blue"
                variant="outline"
              >
                <TbPencil />
              </ActionIcon>
              <ActionIcon
                onClick={() => {
                  onDelete(colorItem);
                }}
                variant="outline"
                color="red"
              >
                <TbTrash />
              </ActionIcon>
              {/* <EditColorModal onEdit={onEdit} color={colorItem} />
              <DeleteColorAction onDelete={onDelete} color={colorItem} /> */}
            </Group>
          </td>
        </tr>
      );
    });
  const [selectedColorForEdit, setSelectedColorForEdit] =
    useState<MyColor | null>(null);
  const closeEditModal = () => {
    setSelectedColorForEdit(null);
  };
  return (
    <div>
      <Modal
        centered
        opened={Boolean(selectedColorForEdit)}
        onClose={closeEditModal}
      >
        {selectedColorForEdit ? (
          <Stack>
            <TextInput
              value={selectedColorForEdit.name}
              onChange={(evt) =>
                setSelectedColorForEdit({
                  ...selectedColorForEdit,
                  name: evt.currentTarget.value,
                })
              }
              label="Color Name"
            />
            <ColorInput
              placeholder="Pick color"
              label="Your favorite color"
              value={selectedColorForEdit.hexcode}
              onChange={(clr) =>
                setSelectedColorForEdit({
                  ...selectedColorForEdit,
                  hexcode: clr,
                })
              }
            />
            <div>
              <Button
                onClick={async () => {
                  try {
                    await axiosClient.v1.api
                      .put(
                        `${url}/${selectedColorForEdit.id}`,
                        selectedColorForEdit
                      )
                      .then((res) => {
                        console.log(res.data);
                        return res.data;
                      });
                    notifications.show({
                      message: `Color ID ${selectedColorForEdit.id} edited successfully`,
                      color: "green",
                    });
                    closeEditModal();
                  } catch (error) {
                    notifications.show({
                      message: JSON.stringify(error.data.message),
                      color: "red",
                    });
                  } finally {
                    invalidateColorQuery();
                  }
                }}
              >
                Confirm
              </Button>
            </div>
          </Stack>
        ) : null}
      </Modal>
      <Table withBorder withColumnBorders>
        <thead>
          <tr>
            <th className={classes.th}>Color name</th>
            <th className={classes.th}>Hex</th>
            <th className={classes.th}>RGB</th>
            <th className={classes.th} style={{ width: "10%" }}>
              Color
            </th>
            <th className={classes.th}> Actions</th>
          </tr>
        </thead>
        <tbody>{tRows}</tbody>
      </Table>
    </div>
  );
};

export default ColorPage;
