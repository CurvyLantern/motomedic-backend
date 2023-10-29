import { SimpleGrid, ActionIcon, Box } from "@mantine/core";
import { TbEye, TbPencil, TbTrash } from "react-icons/tb";

type CrudOptions = {
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
};
const CrudOptions = ({ onDelete, onEdit, onView }: CrudOptions) => {
  return (
    <Box sx={{ gap: 5, display: "flex", alignItems: "center" }}>
      <CrudViewButton onView={onView} />
      <CrudEditButton onEdit={onEdit} />
      <CrudDeleteButton onDelete={onDelete} />
    </Box>
  );
};
export const CrudViewButton = ({ onView }: { onView: () => void }) => {
  return (
    <ActionIcon
      onClick={onView}
      fz={"md"}
      size={"md"}
      variant="filled"
      radius={"lg"}
      color={"orange"}
    >
      <TbEye />
    </ActionIcon>
  );
};
export const CrudEditButton = ({ onEdit }: { onEdit: () => void }) => {
  return (
    <ActionIcon
      onClick={onEdit}
      fz={"md"}
      size={"md"}
      variant="filled"
      radius={"lg"}
      color={"blue"}
    >
      <TbPencil />
    </ActionIcon>
  );
};

export const CrudDeleteButton = ({ onDelete }: { onDelete: () => void }) => {
  return (
    <ActionIcon
      onClick={onDelete}
      fz={"md"}
      size={"md"}
      variant="filled"
      radius={"lg"}
      color={"red"}
    >
      <TbTrash />
    </ActionIcon>
  );
};

export default CrudOptions;
