export const userConfig = {
  userName: {
    label: "Name of customer",
    ph: "Please enter customer name",
    fieldType: "text",
    required: true,
  },
  userPhone: {
    label: "Phone Number",
    ph: "Please enter customer name",

    fieldType: "number",
    required: true,
  },
  userEmail: {
    label: "Email of customer",
    ph: "Please enter customer name",
    fieldType: "email",
    required: false,
  },
  bikeInfo: {
    ph: "Please enter customer name",
    label: "Bike Info",
    fieldType: "textbox",
    required: true,
  },
  checkCustomer: {
    ph: "Please enter customer name",
    label: "Find Customer",
    fieldType: "select",
    required: false,
    options: [
      { value: "lavlu", label: "Lavlu Mia" },
      { value: "mohsin", label: "Mohsin Mia 420" },
      { value: "chakladar", label: "Chakladar 69" },
      { value: "ronju", label: "Ronju Komlachor" },
    ],
  },
  userAddress: {
    ph: "Please enter customer name",
    label: "Address of customer",
    fieldType: "textbox",
    required: true,
  },
};
