import { z } from "zod";

type CompWithChildren = React.FC<{ children?: React.ReactNode }>;
type TypedObject<T, V = undefined> = {
    [key in keyof T]: V extends undefined ? T[key] : V;
};
type IdField = string | number;
type SelectInputItem = {
    value: string;
    label: string;
    group?: string;
};

type User = {
    id: IdField;
    name: string;
    email: string;
};

type Category = {
    id: IdField;
    name: string;
    image?: string;
    parent_category_id?: string | number;
};
type CategoryWithSubCateogry = Category & {
    sub_categories: Array<Category>;
};

type Brand = {
    id: IdField;
    name: string;
    description: string;
    image: string | null;
};

type Product = {
    warranty: string;
    sku: string;
    product_name: string;
    category_id: IdField;
    brand_id: IdField;
    model: string;
    // color_id: IdField;
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
    | "switch"
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

type Variation = {
    name: string;
    image: File | null;
    price: number;
    colorCode: string;
};

type Attribute = {
    id: IdField;
    priority: number;
    name: string;
    values: string[];
};
type Color = { id: IdField; name: string; hexcode: string };
