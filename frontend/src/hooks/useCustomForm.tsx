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
        values.name = path.toString();
        return values;
    };
    return form;
};

export default useCustomForm;
