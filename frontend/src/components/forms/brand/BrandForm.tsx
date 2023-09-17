import axiosClient from "@/lib/axios";
import {
  Button,
  FileInput,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
type BrandFormProps = {
  brand?: Brand;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitUrl: string;
};

const brandFormValidationSchema = z.object({
  brandName: z.string(),
  description: z.string(),
  img: z.custom((file) => file instanceof File),
});
export const BrandForm = ({
  brand,
  onSuccess = () => {},
  onCancel = () => {},
  submitUrl = "",
}: BrandFormProps) => {
  const brandName = brand?.brandName ? brand.brandName : "My Cool Brand";
  const description = brand?.description
    ? brand.description
    : "My Brand is very cool";
  const img = null;
  const form = useForm({
    initialValues: {
      brandName,
      description,
      img,
    },
    validate: zodResolver(brandFormValidationSchema),
  });

  const submitForm = (values: unknown) => {
    const formData = new FormData();
    formData.append("brandName", values.brandName);
    formData.append("description", values.description);
    formData.append("img", values.img);
    axiosClient
      .post(submitUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        const data = res.data;
        console.log({ data });
        form.reset();
        onSuccess();
      })
      .catch((error) => {
        throw error;
      });
  };
  return (
    <form onSubmit={form.onSubmit(submitForm)}>
      <Stack>
        <TextInput
          {...form.getInputProps("brandName")}
          label="Brand Name"
        />
        <Textarea
          {...form.getInputProps("description")}
          label="Brand Description"
        />
        <FileInput
          {...form.getInputProps("img")}
          label="Upload files"
          placeholder="Upload files"
          accept="image/png,image/jpeg"
        />

        <SimpleGrid cols={2}>
          <Button type="submit">Confirm</Button>
          <Button
            sx={(t) => ({
              backgroundColor: t.colors.red[8],
              "&:hover": {
                backgroundColor: t.colors.red[7],
              },
            })}
            type="button"
            onClick={() => {
              onCancel();
            }}>
            Cancel
          </Button>
        </SimpleGrid>
      </Stack>
    </form>
  );
};
