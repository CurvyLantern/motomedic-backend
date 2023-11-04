import { z } from "zod";

type CompWithChildren = React.FC<{ children?: React.ReactNode }>;
type TypedObject<T, V = undefined> = {
  [key in keyof T]: V extends undefined ? T[key] : V;
};
type IdField = string;
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

type ProductModels = {
  name: string;
  id: string;
  brands: Brand[];
};

type Brand = {
  id: IdField;
  name: string;
  description: string;
  image: string | null;
  product_models: ProductModels[];
};

type Product = {
  warranty: string;
  sku: string;
  name: string;
  parent_category_id: IdField;
  category_id: IdField;
  category: Category;
  brand_id: IdField;
  brand: Brand;
  model: string;
  color_id: IdField;
  material: string;
  year: string | number;
  weight: number | string;
  discount: number | string;
  description: string;
  active: boolean;
  image: File | null;
  barcode: string;
  status: "active" | "inactive";
  id: IdField;
  stock_count: number;
  variation_product: boolean;
  type: "product" | "variation";
  price: {
    id: string;
    buying_price: number;
    selling_price: number;
  };
  variations: {
    id: string;
    model_id: string;
    product_id: string;
    sku: string;
    price: {
      id: string;
      buying_price: number;
      selling_price: number;
    };
    product_model: {
      id: string;
      name: string;
    };
    color: {
      name: string;
      hexcode: string;
      id: string;
    };
    color_id: string;
    attribute_values: { id: string; name: string }[];
    type: "product" | "variation";
  }[];
};
type ProductVariation = {
  variation_enabled: boolean;
  variations: null;
};
type ProductFieldInputType =
  | "number"
  | "text"
  | "email"
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
  name: keyof Product | keyof ProductVariation;
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
  values: { name: string; id: IdField }[];
};
type Color = { id: IdField; name: string; hexcode: string };

type InventoryItemType = {
  id: string;
  sku: string;
  stock_count: string | number;
};
