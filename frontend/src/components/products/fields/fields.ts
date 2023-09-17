import { fieldTypes } from "@/components/inputs/BaseInputs";
import { z } from "zod";

const _productFields = {
  basicInfo: [
    {
      label: "Product Name",
      type: "text",
      name: "productName",
      data: "",
      validate: z.string().min(1, { message: "Product name can not be empty" }),
    },
    {
      validate: z.string().nullable(),
      label: "Category",
      type: fieldTypes.select,
      name: "cateogryId",
      data: [
        { value: "1", label: "hero honda 1" },
        { value: "2", label: "hero honda 2" },
        { value: "3", label: "hero honda 3" },
        { value: "4", label: "hero honda 4" },
      ],
    },
    {
      validate: z.string().nullable(),
      name: "brandId",
      label: "Brand",
      type: fieldTypes.select,
      data: [
        { value: "1", label: "hero honda 1" },
        { value: "2", label: "hero honda 2" },
        { value: "3", label: "hero honda 3" },
        { value: "4", label: "hero honda 4" },
      ],
    },
    {
      validate: z.string(),
      name: "sku",
      label: "SKU",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string().nullable(),
      name: "model",
      label: "Model",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "color",
      label: "Color",
      type: fieldTypes.select,
      data: [],
    },

    {
      validate: z.string(),
      name: "material",
      label: "Material",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "compatibility",
      label: "Compatibility",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "condition",
      label: "Condition",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "weight",
      label: "Weight",
      type: fieldTypes.text,
      data: "",
    },

    //
    // {
    //   validate: z.string(),
    //   name: "thumbImgId",
    //   label: "ThumbImg Id",
    //   type: fieldTypes.text,
    //   data: "",
    // },
    // {
    //   validate: z.string(),
    //   name: "shortDescription",
    //   label: "Short Description",
    //   type: fieldTypes.textarea,
    //   data: "",
    // },

    // {
    //   validate: z.number(),
    //   name: "note",
    //   label: "Note",
    //   type: fieldTypes.text,
    //   data: "",
    // },

    // {
    //   validate: z.number(),
    //   name: "rating",
    //   label: "Rating",
    //   type: fieldTypes.number,
    //   data: 0,
    // },
    // {
    //   validate: z.string(),
    //   name: "reviewsId",
    //   label: "Reviews Id",
    //   type: fieldTypes.number,
    //   data: 0,
    // },

    // {
    //   validate: z.string(),
    //   name: "attributesData",
    //   label: "Attributes Data",
    //   type: fieldTypes.text,
    //   data: "",
    // },
    // {
    //   validate: z.any(),
    //   name: "attributesData",
    //   label: "Attributes Data",
    //   type: fieldTypes.text,
    //   data: "",
    // },
    // {
    //   validate: z.string(),
    //   name: "attributeId",
    //   label: "Attributes Id",
    //   type: fieldTypes.number,
    //   data: 0,
    // },

    // {
    //   validate: z.number(),
    //   name: "manufacturerPartNumber",
    //   label: "Manufacturer PartNumber",
    //   type: fieldTypes.text,
    //   data: "",
    // },
    // {
    //   validate: z.string(),
    //   name: "productCreator",
    //   label: "Product Creator",
    //   type: fieldTypes.text,
    //   data: "",
    // },
  ],

  metaInfo: [
    {
      validate: z.number(),
      name: "productType",
      label: "Product Type",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "manufacturer",
      label: "Manufacturer",
      type: fieldTypes.text,
      data: "",
    },
  ],
  serviceInfo: [
    {
      validate: z.string(),
      name: "installationMethod",
      label: "Installation Method",
      type: fieldTypes.textarea,
      data: "",
    },
    {
      validate: z.number(),
      name: "warranty",
      label: "Warranty in month",
      type: fieldTypes.number,
      data: 6,
    },
  ],
  extraInfos: [
    {
      validate: z.string(),
      name: "year",
      label: "Year",
      type: fieldTypes.yearPicker,
      data: new Date().getFullYear().toLocaleString(),
    },
    {
      validate: z.string(),
      name: "availability",
      label: "Available",
      type: fieldTypes.checkbox,
      data: true,
    },
    {
      validate: z.boolean(),
      name: "status",
      label: "Status",
      type: fieldTypes.checkbox,
      data: true,
    },
  ],
  desc: [
    {
      validate: z.string(),
      name: "longDescription",
      label: "Long Description",
      type: "richText",
      data: "",
    },
  ],
  formals: [
    {
      validate: z.boolean(),
      name: "refundable",
      label: "Refundable",
      type: fieldTypes.checkbox,
      data: false,
    },
    {
      validate: z.number(),
      name: "tax",
      label: "Tax",
      type: fieldTypes.number,
      data: 0,
    },
    {
      validate: z.string(),
      name: "barcode",
      label: "Barcode",
      type: fieldTypes.text,
      data: "",
    },

    {
      validate: z.custom<File>((file) => file instanceof File),
      name: "qrcodeImg",
      label: "Upload qrcode image",
      type: fieldTypes.fileButton,
      data: null,
    },
  ],
  img: [
    {
      validate: z.custom<FileList>((file) => file instanceof File),
      name: "thumbnail",
      label: "Select Thumbnail Image",
      type: fieldTypes.fileButton,
      data: null,
    },
    {
      validate: z.custom<FileList>((file) => file instanceof File),
      name: "primaryImg",
      label: "Primary Image",
      type: "dropZone",
      data: null,
    },
  ],
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
      type: fieldTypes.multiSelect,
      data: [],
    },
    {
      validate: z.string(),
      name: "size",
      label: "Size",
      type: fieldTypes.multiSelect,
      data: [],
    },
  ],
  seoTag: [
    {
      validate: z.string(),
      name: "metaTitle",
      label: "Meta Title",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "tags",
      label: "Tags",
      type: fieldTypes.text,
      data: "",
    },
    {
      validate: z.string(),
      name: "metaDescription",
      label: "Meta Description",
      type: fieldTypes.textarea,
      data: "",
    },
    {
      validate: z.string(),
      name: "metaImg",
      label: "Meta Image",
      type: fieldTypes.fileButton,
      data: null,
    },
  ],
  sellInfo: [
    {
      validate: z.number(),
      name: "quantity",
      label: "Quantity",
      type: fieldTypes.number,
      data: 10,
    },
    {
      validate: z.number(),
      name: "price",
      label: "Price",
      type: fieldTypes.number,
      data: 10,
    },
    {
      validate: z.number(),
      name: "discount",
      label: "Discount",
      type: fieldTypes.number,
      data: 10,
    },

    {
      validate: z.string(),
      name: "discountType",
      label: "Discount Type",
      type: fieldTypes.select,
      data: [
        { value: "1", label: "flat" },
        { value: "2", label: "prcnt" },
      ],
    },
  ],
};

export const productFields: TypedObject<typeof _productFields> = _productFields;
