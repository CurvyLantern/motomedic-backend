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
        const notFileType =(v : unknown) => !(v instanceof File)
        if (Array.isArray(value)) {
            // If the value is an array, recursively call dataToFormData for each element
            value.forEach((item, index) => {
                const arrayKey = `${currentKey}[${index}]`;
                if (typeof item === "object" && notFileType(item)) {
                    dataToFormData({
                        formData,
                        data: item,
                        parentKey: arrayKey,
                    });
                } else {
                    formData.append(arrayKey, item);
                }
            });
        } else if (value && typeof value === "object" && notFileType(value)) {
            // If the value is an object, recursively call dataToFormData
            dataToFormData({ formData, data: value, parentKey: currentKey });
        } else {
            // Otherwise, append the value to the formData
            formData.append(currentKey, value);
        }
    }
    return formData;
}
