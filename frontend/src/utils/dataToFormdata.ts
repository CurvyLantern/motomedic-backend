/* eslint-disable @typescript-eslint/no-explicit-any */
type DataToFormData = {
    data: any;
    parentKey?: string;
    formData?: FormData;
};
export default function dataToFormData({
    data,
    parentKey = "",
    formData = new FormData(),
}: DataToFormData): FormData {
    for (const key of Object.keys(data)) {
        const value = data[key];
        const currentKey = parentKey ? `${parentKey}[${key}]` : key;
        const notFileType = (v: unknown) => !(v instanceof File);
        if (Array.isArray(value)) {
            // If the value is an array, recursively call dataToFormData for each element
            if (value.length === 0) {
                console.log(value, " from 19");
                formData.append(currentKey, value);
            } else {
                value.forEach((item, index) => {
                    const arrayKey = `${currentKey}[${index}]`;
                    if (typeof item === "object" && notFileType(item)) {
                        dataToFormData({
                            formData,
                            data: item,
                            parentKey: arrayKey,
                        });
                    } else {
                        const _item =
                            typeof item === "boolean" ? Number(item) : item;
                        formData.append(arrayKey, _item);
                    }
                });
            }
        } else if (value && typeof value === "object" && notFileType(value)) {
            // If the value is an object, recursively call dataToFormData
            dataToFormData({ formData, data: value, parentKey: currentKey });
        } else {
            const _value = typeof value === "boolean" ? Number(value) : value;
            formData.append(currentKey, _value);
        }
    }
    return formData;
}
