import {
    ProductFieldType,
    ProductFieldValueType,
    TypedObject,
} from "@/types/defaultTypes";
import { z } from "zod";
import { fieldTypes } from "./ProductFields";
const productInputFields: ProductFieldType = {
    status: {
        label: "Product Status",
        type: "select",
        name: "status",
        data: [
            { label: "active", value: "1" },
            { label: "inactive", value: "0" },
        ],
        validate: z
            .string()
            .min(1, { message: "Product Status can not be empty" }),
    },
    name: {
        label: "Product Name",
        type: "text",
        name: "name",
        data: "",
        validate: z
            .string()
            .min(1, { message: "Product name can not be empty" }),
    },
    color_id: {
        label: "Product Color",
        type: "select",
        name: "color_id",
        data: [],
        validate: z.string().min(1, "Color need to be selected"),
    },
    active: {
        label: "Active",
        type: "checkbox",
        name: "active",
        data: true,
        validate: z.boolean(),
    },
    brand_id: {
        validate: z.string().min(1, "brand id is needed"),
        name: "brand_id",
        label: "Brand",
        type: "select",
        data: "",
    },
    category_id: {
        validate: z.string().min(1, "category id is needed"),
        label: "Category",
        type: "select",
        name: "category_id",
        data: "",
    },
    sku: {
        validate: z.string().min(1, "sku is needed"),
        name: "sku",
        label: "SKU",
        type: "text",
        data: "",
    },
    description: {
        validate: z
            .string()
            .min(1, "please give the product a nice description"),
        name: "description",
        label: "Description",
        type: "richText",
        data: '<h2 style="text-align: center;">Please Give a meaningfull description to the product</h2><ul><li>General text formatting: <strong>bold</strong>, <em>italic</em>, <u>underline</u>, <s>strike-through</s> </li><li>Headings (h1-h6)</li><li>Sub and super scripts (<sup>&lt;sup /&gt;</sup> and <sub>&lt;sub /&gt;</sub> tags)</li><li>Ordered and bullet lists</li><li>Text align&nbsp;</li></ul>',
    },
    material: {
        validate: z.string().nullable(),
        name: "material",
        label: "Material",
        type: "text",
        data: "",
    },
    discount: {
        validate: z.number().default(0),
        name: "discount",
        label: "Discount",
        type: "number",
        data: 10,
    },
    model: {
        validate: z.string().nullable(),
        name: "model",
        label: "Model",
        type: "text",
        data: "",
    },
    price: {
        validate: z.number().default(0),
        name: "price",
        label: "Price",
        type: "number",
        data: 10,
    },
    weight: {
        validate: z.string().nullable(),
        name: "weight",
        label: "Weight",
        type: "text",
        data: "",
    },
    year: {
        validate: z.string().nullable(),
        name: "year",
        label: "Year",
        type: "yearPicker",
        data: new Date().getFullYear().toLocaleString(),
    },
    image: {
        name: "image",
        label: "Product Image",
        data: null,
        type: "dropZone",
        validate: z.any().refine((file) => {
            return file instanceof File || !file;
        }, "Image is required"),
    },
    warranty: {
        name: "warranty",
        label: "Product Warranty",
        data: "",
        type: "text",
        validate: z.string().min(1, "warranty field is needed"),
    },
};
const _productFields = {
    basicInfo: [
        productInputFields.name,
        productInputFields.category_id,
        productInputFields.brand_id,
        productInputFields.color_id,
        // productInputFields.sku,
        productInputFields.model,
        productInputFields.weight,
        productInputFields.status,

        //
        // {
        //   validate: z.string(),
        //   name: "thumbImgId",
        //   label: "ThumbImg Id",
        //   type: .text,
        //   data: "",
        // },
        // {
        //   validate: z.string(),
        //   name: "shortDescription",
        //   label: "Short Description",
        //   type: .textarea,
        //   data: "",
        // },

        // {
        //   validate: z.number(),
        //   name: "note",
        //   label: "Note",
        //   type: .text,
        //   data: "",
        // },

        // {
        //   validate: z.number(),
        //   name: "rating",
        //   label: "Rating",
        //   type: .number,
        //   data: 0,
        // },
        // {
        //   validate: z.string(),
        //   name: "reviewsId",
        //   label: "Reviews Id",
        //   type: .number,
        //   data: 0,
        // },

        // {
        //   validate: z.string(),
        //   name: "attributesData",
        //   label: "Attributes Data",
        //   type: .text,
        //   data: "",
        // },
        // {
        //   validate: z.any(),
        //   name: "attributesData",
        //   label: "Attributes Data",
        //   type: .text,
        //   data: "",
        // },
        // {
        //   validate: z.string(),
        //   name: "attributeId",
        //   label: "Attributes Id",
        //   type: .number,
        //   data: 0,
        // },

        // {
        //   validate: z.number(),
        //   name: "manufacturerPartNumber",
        //   label: "Manufacturer PartNumber",
        //   type: .text,
        //   data: "",
        // },
        // {
        //   validate: z.string(),
        //   name: "productCreator",
        //   label: "Product Creator",
        //   type: .text,
        //   data: "",
        // },
    ],

    metaInfo: [],
    serviceInfo: [productInputFields.warranty],
    extraInfos: [
        // productInputFields.year,
    ],
    desc: [productInputFields.description],
    formals: [
        // {
        //     validate: z.number(),
        //     name: "tax",
        //     label: "Tax",
        //     type: .number,
        //     data: 0,
        // },
        {
            validate: z.string().nullable(),
            name: "barcode",
            label: "Barcode",
            type: "text",
            data: "",
        },

        {
            validate: z.any().refine((file) => {
                return file instanceof File || !file;
            }, "Image is required"),
            name: "qrcodeImg",
            label: "Upload qrcode image",
            type: "fileButton",
            data: null,
        },
    ],
    img: [productInputFields.image],

    seoTag: [
        // {
        //     validate: z.string(),
        //     name: "metaTitle",
        //     label: "Meta Title",
        //     type: .text,
        //     data: "",
        // },
        // {
        //     validate: z.string(),
        //     name: "tags",
        //     label: "Tags",
        //     type: .text,
        //     data: "",
        // },
        // {
        //     validate: z.string(),
        //     name: "metaDescription",
        //     label: "Meta Description",
        //     type: .textarea,
        //     data: "",
        // },
        // {
        //     validate: z.string(),
        //     name: "metaImg",
        //     label: "Meta Image",
        //     type: .fileButton,
        //     data: null,
        // },
    ],
    sellInfo: [
        productInputFields.price,
        productInputFields.discount,

        // {
        //     validate: z.string(),
        //     name: "discountType",
        //     label: "Discount Type",
        //     type: "select",
        //     data: "",
        // },
    ],
};

// type ProductVariationFields = Omit<ProductFieldValueType, 'data'> & {
//     data: unknown
// }
// ProductVariationFields[]
export type VariationField = {
    name: string;
    color_id: string;
    attribute_value_ids: string[];
    price: number;
    image: File | null;
};
export const productVariationFields = [
    {
        validate: z.boolean().default(false),
        name: "variation_enabled",
        label: "Enable Variations",
        type: "switch",
        data: false,
    },
    {
        validate: z
            .object({
                name: z.string().default("prod-x-xx-xxx"),
                color_id: z.string().min(1, "color has to be selected"),
                attribute_value_ids: z.array(z.string()),
                price: z.number().nonnegative("price cannot be negative"),
                image: z.any().refine((file) => {
                    return file instanceof File || !file;
                }, "Image is required"),
            })
            .array(),
        name: "variations",
        label: "Variations",
        type: "null",
        data: [
            {
                name: "prod-x-xx-xxx",
                color_id: "",
                attribute_value_ids: [],
                price: 100,
                image: null,
            },
        ],
    },
] as const;
export const productFields: TypedObject<typeof _productFields> = _productFields;
// TypedObject<typeof _productFields>
