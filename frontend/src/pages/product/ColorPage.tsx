import axiosClient from "@/lib/axios";
import {
  Box,
  Button,
  ColorInput,
  Group,
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
import { TbEdit, TbTrash } from "react-icons/tb";
import { z } from "zod";
import BaseInputs, { fieldTypes } from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";

type MyColor = {
  name: string;
  code: string;
  id: string;
};

const useTableStyles = createStyles({
  th: {
    textTransform: "uppercase",
  },
});
const url = "v1/colors";
const fields = [
  {
    data: "",
    label: "Name",
    name: "name",
    type: fieldTypes.text,
  },
  {
    data: "",
    label: "color",
    name: "code",
    type: fieldTypes.colorInput,
  },
];
const ColorPage = () => {
  return (
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
  );
};

const CreateColors = () => {
  const form = useForm({
    initialValues: {
      name: "",
      code: "",
    },

    validate: {
      name: () => null,
      code: () => null,
    },
  });
  return (
    <BasicSection title="Create Category">
      <form
        onSubmit={form.onSubmit(async (values) => {
          console.log(values);
          await axiosClient.post(url, values).then((res) => res.data);
          notifications.show({
            title: "Color Created",
            message: "",
            color: "green",
          });
        })}>
        <Stack maw={500}>
          {fields.map((field, fieldIdx) => {
            return (
              <BaseInputs
                key={fieldIdx}
                field={field}
                form={form}
              />
            );
          })}
          <Button type="submit">Confirm</Button>
        </Stack>
      </form>
    </BasicSection>
  );
};
const ViewColors = () => {
  const { classes } = useTableStyles();
  const { data: colors, refetch } = useQuery<Array<MyColor>>({
    queryKey: ["colors"],
    queryFn: async () => {
      return axiosClient.get(url).then((res) => res.data.data);
    },
  });
  const mutation = useMutation({
    mutationFn: (color: MyColor) => {
      return axiosClient
        .put(`${url}/${color.id}`, {
          name: color.name,
          code: color.code,
        })
        .then((res) => {
          console.log(res.data);
          return res.data;
        });
    },
    onSuccess: () => {
      // qc.invalidateQueries({ queryKey: ["colors"] });
      refetch();
    },
  });
  const onEdit = (colorToUpdate: MyColor) => {
    mutation.mutate(colorToUpdate);
  };
  const onDelete = () => {
    refetch();
  };
  const tRows = colors
    ?.map((c) => ({ ...c, code: c.code[0] === "#" ? c.code.slice(1) : c.code }))
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
          }>
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
              }}></Box>
          </td>
          <td>
            <Group
              position="center"
              align="center">
              <EditColorModal
                onEdit={onEdit}
                color={colorItem}
              />
              <DeleteColorAction
                onDelete={onDelete}
                color={colorItem}
              />
            </Group>
          </td>
        </tr>
      );
    });
  return (
    <div>
      <Table
        withBorder
        withColumnBorders>
        <thead>
          <tr>
            <th className={classes.th}>Color name</th>
            <th className={classes.th}>Hex</th>
            <th className={classes.th}>RGB</th>
            <th
              className={classes.th}
              style={{ width: "10%" }}>
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

type DeleteColorType = {
  color: MyColor;
  onDelete: () => void;
};
const DeleteColorAction: React.FC<DeleteColorType> = ({ onDelete, color }) => {
  const showModal = () => {
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
          id: color.name,
          withCloseButton: true,
          autoClose: 3000,
          title: "Cancelled deleting color",
          color: "gray",
          message: "",
        });
      },
      onConfirm: async () => {
        try {
          await axiosClient
            .delete(`${url}/${color.id}`)
            .then((res) => res.data);
          onDelete();

          notifications.show({
            id: color.name,
            withCloseButton: true,
            autoClose: 3000,
            title: "Deleted color " + color.name,
            color: "red",
            message: "",
          });
        } catch (error) {
          console.error(error);
        }
      },
    });
  };
  return (
    <Button
      variant="danger"
      onClick={async () => {
        showModal();
      }}
      size="xs"
      compact
      w={30}
      h={30}
      radius={"100%"}>
      {/* Edit */}
      <TbTrash />
    </Button>
  );
};

type EditColorModalType = {
  color: MyColor;
  onEdit: (clr: MyColor) => void;
};
const EditColorModal: React.FC<EditColorModalType> = ({ onEdit, color }) => {
  const show = () =>
    modals.open({
      centered: true,
      title: "Edit This Color",
      children: (
        <>
          <EditColor
            onEdit={onEdit}
            color={color}
          />
        </>
      ),
    });

  return (
    <Button
      onClick={show}
      size="xs"
      compact
      w={30}
      h={30}
      radius={"100%"}>
      <TbEdit size={20} />
    </Button>
  );
};
type EditColorType = {
  color: MyColor;
  onEdit: (clr: MyColor) => void;
};
const EditColor: React.FC<EditColorType> = ({ onEdit, color }) => {
  const form = useForm({
    initialValues: {
      name: color.name,
      code: `#${color.code}`,
    },
    validate: zodResolver(
      z.object({
        name: z.string(),
        code: z.string(),
      })
    ),
  });
  return (
    <form
      onSubmit={form.onSubmit((values) => {
        onEdit({ id: color.id, code: values.code, name: values.name });
      })}>
      <Stack>
        {/*
                    name
                    color setter
                    action
                */}
        <TextInput
          {...form.getInputProps("name")}
          label="Color Name"
        />
        <ColorInput
          placeholder="Pick color"
          label="Your favorite color"
          {...form.getInputProps("code")}
        />
        <div>
          <Button type="submit">Confirm</Button>
        </div>
      </Stack>
    </form>
  );
};

export default ColorPage;
