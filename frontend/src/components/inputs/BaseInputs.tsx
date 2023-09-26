/* eslint-disable @typescript-eslint/no-explicit-any */
import ImgDropzone from "@/components/dropzones/ImgDropZone";
import { DescriptionEditor } from "@/components/products/fields/DescriptionEditor";
import { ProductFieldInputType } from "@/types/defaultTypes";
import {
    Button,
    Checkbox,
    ColorInput,
    FileButton,
    FileInput,
    Group,
    MultiSelect,
    NumberInput,
    Paper,
    Select,
    Stack,
    Text,
    TextInput,
    Textarea,
    rem,
} from "@mantine/core";
import { YearPicker } from "@mantine/dates";
import { UseFormReturnType } from "@mantine/form";
import { useState } from "react";

type InputType = {
    field: {
        name: string;
        label?: string;
        type: ProductFieldInputType;
        data?: any;
        validate?: any;
    };

    form: UseFormReturnType<any, (values: any) => void>;
};

export const fieldTypes: { [k in ProductFieldInputType]: k } = {
    checkbox: "checkbox",
    colorInput: "colorInput",
    dropZone: "dropZone",
    fileButton: "fileButton",
    fileInput: "fileInput",
    multiSelect: "multiSelect",
    number: "number",
    richText: "richText",
    select: "select",
    text: "text",
    textarea: "textarea",
    yearPicker: "yearPicker",
    null: "null",
};
const BaseInputs = ({ field, form }: InputType) => {
    let inputComponent: JSX.Element | null = null;

    const type = field.type;
    const isArr = Array.isArray(field.data);

    switch (type) {
        case "number":
            inputComponent = (
                <NumberInput
                    {...form.getInputProps(field.name)}
                    label={field.label}
                    placeholder={field.label}
                />
            );
            break;
        case "colorInput":
            inputComponent = (
                <ColorInput
                    placeholder="Choose color"
                    label={field.label}
                    {...form.getInputProps(field.name)}
                />
            );
            break;
        case "select":
            inputComponent = <CustomSelect field={field} form={form} />;
            break;
        case "richText":
            inputComponent = <DescriptionEditor />;
            break;
        case "dropZone":
            inputComponent = (
                <>
                    <Text align="center" my={rem(20)} size={"lg"} weight={600}>
                        {field.label}
                    </Text>
                    <ImgDropzone
                        onFileSave={(files) => {
                            console.log({ files });
                        }}
                    />
                </>
            );
            break;
        case "fileInput":
            inputComponent = (
                <FileInput
                    variant="filled"
                    {...form.getInputProps(field.name)}
                    accept="image/png,image/jpeg"
                    placeholder="Pick file"
                />
            );
            break;
        case "fileButton":
            inputComponent = <FileUploadButton field={field} form={form} />;
            break;
        case "checkbox":
            inputComponent = (
                <Checkbox
                    {...form.getInputProps(field.name, { type: "checkbox" })}
                    labelPosition="right"
                    label={field.label}
                />
            );
            break;
        case "textarea":
            inputComponent = (
                <Textarea
                    {...form.getInputProps(field.name)}
                    label={field.label}
                />
            );
            break;
        case "multiSelect":
            inputComponent = (
                <MultiSelect
                    {...form.getInputProps(field.name)}
                    clearButtonProps={{ "aria-label": "Clear selection" }}
                    clearable
                    data={isArr ? field.data : []}
                    label={field.label}
                    placeholder="Pick all that you like"
                />
            );
            break;
        case "yearPicker":
            inputComponent = <CustomYearPicker field={field} form={form} />;
            break;
        default:
            inputComponent = (
                <TextInput
                    {...form.getInputProps(field.name)}
                    label={field.label}
                    placeholder={field.label}
                />
            );
            break;
    }

    return <div>{inputComponent}</div>;
};
const FileUploadButton = ({ field, form }: InputType) => {
    // const [barcodeFile, setBarCodeFile] = useState<File | null>(null);
    const accessor = field.name.split(".");
    const file = accessor.reduce((acc, item) => {
        acc = acc ? acc[item] : form.values[item];
        return acc;
    }, null as null) as unknown as File;
    return (
        <Group spacing={"md"}>
            {/* onChange={setBarCodeFile} */}
            <FileButton
                {...form.getInputProps(field.name)}
                accept="image/png,image/jpeg"
            >
                {(props) => <Button {...props}>{field.label}</Button>}
            </FileButton>
            {file && (
                <Text size="sm" align="center" mt="sm">
                    {file.name}
                </Text>
            )}
        </Group>
    );
};
const CustomSelect = ({ field, form }: InputType) => {
    if (field.name === "category_id") {
        console.log(field.name, "from name custom select ");
        const dataTemp = field.data;
        console.log({ dataTemp });

        const data = [
            {
                group: "Frontend",
                items: [
                    { label: "React", value: "1" },
                    { label: "Angular", value: "2" },
                ],
            },
        ];
        return (
            <Select
                {...form.getInputProps(field.name)}
                label={field.label}
                placeholder={field.label}
                data={data}
            />
        );
    }
    return (
        <Select
            {...form.getInputProps(field.name)}
            label={field.label}
            placeholder={field.label}
            data={field.data ? field.data : []}
        />
    );
};
const CustomYearPicker = ({ field, form }: InputType) => {
    return (
        <Stack align="center">
            <Text align="center" my={rem(20)} size={"lg"} weight={600}>
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
};
export default BaseInputs;
