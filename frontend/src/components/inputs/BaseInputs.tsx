/* eslint-disable @typescript-eslint/no-explicit-any */
import ImgDropzone from "@/components/dropzones/ImgDropZone";
import {
  Box,
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
  FileInput,
  ColorInput,
  rem,
  Stack,
  Paper,
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
  fileInput: "fileInput",
  checkbox: "checkbox",
  textarea: "textarea",
  yearPicker: "yearPicker",
  colorInput: "colorInput",
} as const;

type InputType = {
  field: {
    name: string;
    label: string;
    type: (typeof fieldTypes)[keyof typeof fieldTypes];
    data?: any;
    validate?: any;
  };

  form: UseFormReturnType<any, (values: any) => void>;
};
const BaseInputs = ({ field, form }: InputType) => {
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
  if (field.type === fieldTypes.colorInput) {
    return (
      <div>
        <ColorInput
          placeholder="Choose color"
          label={field.label}
          {...form.getInputProps(field.name)}
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
        <Text
          align="center"
          my={rem(20)}
          size={"lg"}
          weight={600}>
          {field.label}
        </Text>
        <ImgDropzone
          onFileSave={(files) => {
            console.log({ files });
          }}
        />
      </div>
    );
  }
  if (field.type === fieldTypes.fileInput) {
    return (
      <div>
        <FileInput
          variant="filled"
          color="red"
          {...form.getInputProps(field.name)}
          accept="image/png,image/jpeg"
          placeholder="Pick file"
        />
      </div>
    );
  }
  if (field.type === fieldTypes.fileButton) {
    return (
      <FileUploadButton
        field={field}
        form={form}
      />
    );
  }
  if (field.type === fieldTypes.checkbox) {
    return (
      <div>
        <Checkbox
          {...form.getInputProps(field.name, { type: "checkbox" })}
          labelPosition="right"
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
      <Stack align="center">
        <Text
          align="center"
          my={rem(20)}
          size={"lg"}
          weight={600}>
          {field.label}
        </Text>
        <Paper shadow="sm">
          <YearPicker
            styles={(t) => ({
              calendar: {
                padding: t.spacing.md,
                border: "1px solid #00000022",
                borderRadius: t.other.radius.primary,
              },
              calendarHeaderLevel: {
                // color: t.white,
                fontWeight: 600,
              },
              calendarHeader: {
                // backgroundColor: t.colors.teal,
              },
              calendarHeaderControl: {
                backgroundColor: t.colors.orange[8],
                borderRadius: "50%",
                "&:hover": {
                  backgroundColor: t.colors.orange[7],
                },
              },
              pickerControl: {},
            })}
            {...form.getInputProps(field.name)}
            size="md"
          />
        </Paper>
      </Stack>
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
const FileUploadButton = ({ field, form }: InputType) => {
  // const [barcodeFile, setBarCodeFile] = useState<File | null>(null);
  // @ts-expect-error i do not know how to type this
  const file = form.getTransformedValues()[field.name];
  return (
    <Group spacing={"md"}>
      {/* onChange={setBarCodeFile} */}
      <FileButton
        {...form.getInputProps(field.name)}
        accept="image/png,image/jpeg">
        {(props) => <Button {...props}>{field.label}</Button>}
      </FileButton>
      {file && (
        <Text
          size="sm"
          align="center"
          mt="sm">
          {file.name}
        </Text>
      )}
    </Group>
  );
};
export default BaseInputs;
