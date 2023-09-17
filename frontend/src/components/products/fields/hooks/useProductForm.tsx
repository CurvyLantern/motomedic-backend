import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { productFields } from "../fields";


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
        acc[item.name] = item.validate;
        return acc;
    }, {} as Record<string, z.AnyZodObject>);
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
