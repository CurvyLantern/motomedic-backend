import { ProductFieldType, TypedObject } from "@/types/defaultTypes";
import { z } from "zod";
const productInputFields: ProductFieldType = {
    product_name: {
        label: "Product Name",
        type: "text",
        name: "product_name",
        data: "",
        validate: z
            .string()
            .min(1, { message: "Product name can not be empty" }),
    },
    active: {
        label: "Active",
        type: "checkbox",
        name: "active",
        data: true,
        validate: z.boolean(),
    },
    brand_id: {
        validate: z.string().nullable(),
        name: "brand_id",
        label: "Brand",
        type: "select",
        data: [
            { value: "1", label: "hero honda 1" },
            { value: "2", label: "hero honda 2" },
            { value: "3", label: "hero honda 3" },
            { value: "4", label: "hero honda 4" },
        ],
    },
    category_id: {
        validate: z.string().nullable(),
        label: "Category",
        type: "select",
        name: "category_id",
        data: [
            { value: "1", label: "hero honda 1" },
            { value: "2", label: "hero honda 2" },
            { value: "3", label: "hero honda 3" },
            { value: "4", label: "hero honda 4" },
        ],
    },
    sku: {
        validate: z.string(),
        name: "sku",
        label: "SKU",
        type: "text",
        data: "",
    },
    color_id: {
        validate: z.string(),
        name: "color_id",
        label: "Color",
        type: "select",
        data: [],
    },
    description: {
        validate: z.string(),
        name: "description",
        label: "Description",
        type: "richText",
        data: "",
    },
    material: {
        validate: z.string(),
        name: "material",
        label: "Material",
        type: "text",
        data: "",
    },
    discount: {
        validate: z.number(),
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
        validate: z.number(),
        name: "price",
        label: "Price",
        type: "number",
        data: 10,
    },
    weight: {
        validate: z.string(),
        name: "weight",
        label: "Weight",
        type: "text",
        data: "",
    },
    year: {
        validate: z.string(),
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
        validate: z.custom((file) => file instanceof File),
    },
    warranty: {
        name: 'warranty',
        label: 'Product Warranty',
        data: '',
        type: 'text',
        validate: z.string()
    }
};
const _productFields = {
    basicInfo: [
        productInputFields.product_name,
        productInputFields.category_id,
        productInputFields.brand_id,
        productInputFields.sku,
        productInputFields.model,
        productInputFields.color_id,
        productInputFields.weight,

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
            validate: z.string(),
            name: "barcode",
            label: "Barcode",
            type: "text",
            data: "",
        },

        {
            validate: z.custom<File>((file) => file instanceof File),
            name: "qrcodeImg",
            label: "Upload qrcode image",
            type: "fileButton",
            data: null,
        },
    ],
    img: [productInputFields.image],
    variation: [
        {
            validate: z.string(),
            name: "colors",
            label: "Colors",
            type: "multiSelect",
            data: [],
        },
        {
            validate: z.string(),
            name: "attrs",
            label: "Attributes",
            type: "multiSelect",
            data: [],
        },
        {
            validate: z.string(),
            name: "size",
            label: "Size",
            type: "multiSelect",
            data: [],
        },
    ],
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

        {
            validate: z.string(),
            name: "discountType",
            label: "Discount Type",
            type: "select",
            data: [
                { value: "1", label: "flat" },
                { value: "2", label: "prcnt" },
            ],
        },
    ],
};

export const productFields: TypedObject<typeof _productFields> = _productFields;
// TypedObject<typeof _productFields>
