import { useForm } from "@mantine/form";
import { GetInputProps } from "@mantine/form/lib/types";

type CustomForm = typeof useForm;
const useCustomForm: CustomForm = (props) => {
    const form = useForm(props);
    const temp = form.getInputProps;
    form.getInputProps = (path) => {
        const values = temp(path) as ReturnType<typeof temp> & {
            name: string;
        };
        // console.log(path, "path");
        const name = path.toString();
        const newName = name.split(".");
        const firstPath = newName[0];
        const restOfThePaths = newName
            .slice(1)
            .map((i) => `[${i}]`)
            .join("");
        values.name = firstPath + restOfThePaths;
        return values;
    };
    return form;
};

export default useCustomForm;
