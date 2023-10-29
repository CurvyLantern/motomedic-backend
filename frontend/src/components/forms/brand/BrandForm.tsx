import useCustomForm from "@/hooks/useCustomForm";
import axiosClient from "@/lib/axios";
import { Brand } from "@/types/defaultTypes";
import dataToFormData from "@/utils/dataToFormdata";
import {
  Button,
  FileInput,
  SimpleGrid,
  Stack,
  TextInput,
  Textarea,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { AxiosError } from "axios";
import { z } from "zod";
type BrandFormProps = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  brand?: Brand;
  onSuccess?: () => void;
  onCancel?: () => void;
  submitUrl: string;
};

export const BrandForm = ({
  method = "POST",
  brand,
  onSuccess = () => {},
  onCancel = () => {},
  submitUrl = "",
}: BrandFormProps) => {
  const form = useCustomForm({
    initialValues: {
      name: brand?.name ? brand.name : "",
      description: brand?.description ? brand.description : "",
      image: null,
    },
    validate: zodResolver(
      z.object({
        name: z.string(),
        description: z.string(),
        image: z.any(),
      })
    ),
  });

  const submitForm = (values: typeof form.values) => {
    // const formData = dataToFormData({ data: values });
    // submitUrl, formData, {
    // // headers: {
    // //     "Content-Type": "multipart/form-data",
    // // },
    axiosClient.v1
      .api({
        method: method,
        url: submitUrl,
        data: values,
      })
      .then((res) => {
        const data = res.data;
        form.reset();
        onSuccess();
        return data;
      })
      .catch((error) => {
        const axiosError = error as AxiosError;
        // @ts-expect-error data is defined but not typed
        form.setErrors(axiosError.data.errors);
        throw axiosError;
      });
  };
  return (
    <form onSubmit={form.onSubmit(submitForm)}>
      <Stack>
        <TextInput
          placeholder="Brand Name"
          {...form.getInputProps("name")}
          label="Brand Name"
        />
        <Textarea
          placeholder="Brand Description"
          {...form.getInputProps("description")}
          label="Brand Description"
        />
        <FileInput
          {...form.getInputProps("image")}
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
            }}
          >
            Cancel
          </Button>
        </SimpleGrid>
      </Stack>
    </form>
  );
};
