import { z } from "zod";

type CompWithChildren = React.FC<{ children?: React.ReactNode }>;
type TypedObject<T, V = undefined> = {
    [key in keyof T]: V extends undefined ? T[key] : V;
};
type User = {
    id: number | string;
    name: string;
    email: string;
};
type Product = {
    warranty: string;
    sku: string;
    product_name: string;
    category_id: string | number;
    brand_id: string | number;
    model: string;
    color_id: string | number;
    material: string;
    year: string | number;
    weight: number | string;
    price: number | string;
    discount: number | string;
    description: string;
    active: boolean;
    image: File | null;
};
type ProductFieldInputType =
    | "number"
    | "text"
    | "multiSelect"
    | "select"
    | "dropZone"
    | "richText"
    | "fileButton"
    | "fileInput"
    | "checkbox"
    | "textarea"
    | "yearPicker"
    | "colorInput"
    | "null";
type ProductFieldDataType =
    | File
    | null
    | boolean
    | number
    | string
    | { label: string; value: string }[];
type ProductFieldValueType = {
    label: string;
    type: ProductFieldInputType;
    name: keyof Product;
    data: ProductFieldDataType;
    validate: z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodObject;
};

type ProductFieldType = {
    [K in keyof Product]: ProductFieldValueType;
};
