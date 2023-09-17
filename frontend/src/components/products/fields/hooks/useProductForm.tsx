import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { productFields } from "../fields";

// const options = {
//   cateogryId: {},
//   brandId: {},
//   sku: {},
//   model: {},
//   color: {},
//   tags: {},
//   material: {},
//   size: {},
//   year: {},
//   compitibility: {},
//   condition: {},
//   weight: {},
//   quantity: {},
//   price: {},
//   discount: {},
//   discountType: {},
//   primaryImg: {},
//   thumbImgId: {},
//   shortDescription: {},
//   availability: {},
//   note: {},
//   longDescription: {},
//   installationMethod: {},
//   warranty: {},
//   manufacturerPartNumber: {},
//   rating: {},
//   reviewsId: {},
//   status: {},
//   productType: {},
//   attributesData: {},
//   attributeId: {},
//   manufacturer: {},
//   productCreator: { validate: z.string() },
// };
// const productFormSchema = z.object({});
// minQty: z
//     .number()
//     .positive({ message: "min quantity can not be negative" }),
// barcode: z.string().nullable(),
// barcodeImg: z.any(),
// refundable: z.boolean(),
// description: z.string(),
// tax: z.number(),
// productImg: z.any(),
// colors: z.string(),
// attrs: z.string(),
// metaTitle: z.string(),
// metaDescription: z.string(),
// metaImg: z.any(),
const initialValues = Object.values(productFields)
  .flat(1)
  .reduce((acc, item) => {
    //@ts-expect-error don't need typescript help here
    acc[item.name] = item.data;
    return acc;
  }, {});
console.log({ initialValues });

const validation = Object.values(productFields)
  .flat(1)
  .reduce((acc, item) => {
    //@ts-expect-error don't need typescript help here
    acc[item.name] = item.validate;
    return acc;
  }, {});
const productSchema = z.object(validation);
export const useProductForm = () => {
  const form = useForm({
    validate: zodResolver(productSchema),
    initialValues: {
      ...initialValues,
    },
  });
  return form;
};
