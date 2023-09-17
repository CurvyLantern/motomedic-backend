import ImgDropzone from "@/components/dropzones/ImgDropZone";
import {
  Button,
  Checkbox,
  FileButton,
  Group,
  MultiSelect,
  NumberInput,
  Select,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { YearPicker } from "@mantine/dates";
import { useState } from "react";
import { DescriptionEditor } from "@/components/products/fields/DescriptionEditor";

export const fieldTypes = {
  number: "number",
  text: "text",
  multiSelect: "multiSelect",
  select: "select",
  dropZone: "dropZone",
  richText: "richText",
  fileButton: "fileButton",
  checkbox: "checkbox",
  textarea: "textarea",
  yearPicker: "yearPicker",
} as const;

type ProductFieldType = {
  field: {
    name: string;
    label: string;
    type: (typeof fieldTypes)[keyof typeof fieldTypes];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
  };
  form: UseFormReturnType<object, (values: object) => void>;
};
const ProductFields = ({ field, form }: ProductFieldType) => {
  const [barcodeFile, setBarCodeFile] = useState<File | null>(null);
  if (field.type === fieldTypes.number) {
    return (
      <div>
        <NumberInput
          {...form.getInputProps(field.name)}
          label={field.label}
          placeholder={field.label}
        />
      </div>
    );
  }
  if (field.type === fieldTypes.select) {
    return (
      <div>
        <Select
          {...form.getInputProps(field.name)}
          label={field.label}
          placeholder={field.label}
          data={field.data ? field.data : []}
        />
      </div>
    );
  }
  if (field.type === fieldTypes.richText) {
    return (
      <div>
        <DescriptionEditor />
      </div>
    );
  }
  if (field.type === fieldTypes.dropZone) {
    return (
      <div>
        <ImgDropzone
          onFileSave={(files) => {
            console.log({ files });
          }}
        />
      </div>
    );
  }
  if (field.type === fieldTypes.fileButton) {
    return (
      <Group spacing={"md"}>
        <FileButton
          {...form.getInputProps(field.name)}
          onChange={setBarCodeFile}
          accept="image/png,image/jpeg">
          {(props) => <Button {...props}>{field.label}</Button>}
        </FileButton>
        {barcodeFile && (
          <Text
            size="sm"
            align="center"
            mt="sm">
            Picked file: {barcodeFile.name}
          </Text>
        )}
      </Group>
    );
  }
  if (field.type === fieldTypes.checkbox) {
    return (
      <div>
        <Checkbox
          {...form.getInputProps(field.name)}
          labelPosition="left"
          label={field.label}
        />
      </div>
    );
  }
  if (field.type === fieldTypes.textarea) {
    return (
      <div>
        <Textarea
          {...form.getInputProps(field.name)}
          label={field.label}
        />
      </div>
    );
  }

  if (field.type === fieldTypes.multiSelect) {
    const isArr = Array.isArray(field.data);
    return (
      <div>
        <MultiSelect
          {...form.getInputProps(field.name)}
          clearButtonProps={{ "aria-label": "Clear selection" }}
          clearable
          data={isArr ? field.data : []}
          label={field.label}
          placeholder="Pick all that you like"
        />
      </div>
    );
  }
  if (field.type === fieldTypes.yearPicker) {
    /*
        value={value}
                    onChange={setValue}

        */
    return (
      <div>
        <YearPicker {...form.getInputProps(field.name)} />
      </div>
    );
  }
  return (
    <div>
      <TextInput
        {...form.getInputProps(field.name)}
        label={field.label}
        placeholder={field.label}
      />
    </div>
  );
};

export default ProductFields;
