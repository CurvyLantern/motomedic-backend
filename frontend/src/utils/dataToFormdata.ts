/* eslint-disable @typescript-eslint/no-explicit-any */
export default function dataToFormData(
    formData: FormData,
    data: any,
    parentKey: string = ""
): void {
    for (const key of Object.keys(data)) {
        const value = data[key];
        const currentKey = parentKey ? `${parentKey}[${key}]` : key;

        console.log(!value, "currentKey");

        if (Array.isArray(value)) {
            // If the value is an array, recursively call dataToFormData for each element
            value.forEach((item, index) => {
                const arrayKey = `${currentKey}[${index}]`;
                if (typeof item === "object") {
                    dataToFormData(formData, item, arrayKey);
                } else {
                    formData.append(arrayKey, item);
                }
            });
        } else if (value && typeof value === "object") {
            // If the value is an object, recursively call dataToFormData
            dataToFormData(formData, value, currentKey);
        } else {
            // Otherwise, append the value to the formData
            formData.append(currentKey, value);
        }
    }
}
