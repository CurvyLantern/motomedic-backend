import { fieldTypes } from "@/components/inputs/BaseInputs";

export const userConfig = {
  userName: {
    label: "Name of customer",
    ph: "Please enter customer name",
    fieldType: fieldTypes.text,
    required: true,
  },
  userPhone: {
    label: "Phone Number",
    ph: "Please enter customer name",
    fieldType: fieldTypes.number,
    required: true,
  },
  userEmail: {
    label: "Email of customer",
    ph: "Please enter customer name",
    fieldType: fieldTypes.email,
    required: false,
  },
  bikeInfo: {
    ph: "Please enter customer name",
    label: "Bike Info",
    fieldType: fieldTypes.textarea,
    required: false,
  },
  userAddress: {
    ph: "Please enter customer name",
    label: "Address of customer",
    fieldType: fieldTypes.textarea,
    required: false,
  },
};
