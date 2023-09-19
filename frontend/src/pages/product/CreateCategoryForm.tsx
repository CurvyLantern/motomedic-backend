import BaseInputs from "@/components/inputs/BaseInputs";
import BasicSection from "@/components/sections/BasicSection";
import axiosClient from "@/lib/axios";
import objToFormdata from "@/utils/dataToFormdata";
import { Button } from "@mantine/core";
import { useForm } from "@mantine/form";
import { FormValue, fields } from "./CategoryPage";

export const CreateCategoryForm = () => {
    const form = useForm<FormValue>({
        initialValues: fields.reduce((acc, item) => {
            // @ts-expect-error dont want to define type for this
            acc[item.name] = item.data;
            return acc;
        }, {} as FormValue),

        validate: {
            categoryName: () => null,
            description: () => null,
            img: () => null,
            //   parentCategoryId: () => null,
        },
    });
    const onCreate = async (values: {
        categoryName: string;
        description: string;
        img: File | null;
    }) => {
        const url = "v1/category";
        console.log(values);
        const resBody = {
            categoryName: values.categoryName,
            description: values.description,
            img: values.img,
        };

        console.log(resBody, " from file ");
        // //@ts-ignore
        // data.img = [data.img];
        const formData = new FormData();
        objToFormdata(formData, values);
        // if (values.img) {
        //   formData.append("img", values.img);
        // }
        // formData.append("categoryName", values.categoryName);
        // formData.append("description", values.description);
        for (const pair of formData.entries()) {
            console.log(pair[0] + ", " + pair[1]);
        }
        // console.log(JSON.stringify(formData.entries()), "from onCreate");
        try {
            /*
          {
              headers: {
                // "content-type": "multipart/form-data",
              },
            }
          */
            const res = await axiosClient.v1.api
                .post(url, resBody, {
                    headers: {
                        "content-type": "multipart/form-data",
                    },
                })
                .then((res) => res.data);
            console.log(res, "from on create");
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <BasicSection title="Create Category">
            <form
                onSubmit={form.onSubmit((values) => {
                    onCreate(values);
                })}
            >
                <Grid>
                    {fields.map((field, fieldIdx) => {
                        return (
                            <BaseInputs
                                key={fieldIdx}
                                field={field}
                                form={form}
                            />
                        );
                    })}
                    <Button type="submit">Confirm</Button>
                </Grid>
            </form>
        </BasicSection>
    );
};
