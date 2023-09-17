export const serviceData = {
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
  userService: {
    ph: "service type",
    label: "Service Type",
    fieldType: "select",
    required: true,
    serviceTypes: [
      { value: "job_paint", label: "paint job" },
      { value: "", label: "modification" },
      { value: "svelte", label: "repair" },
    ],
  },
  userJob: {
    ph: "Job number",
    label: "Job No",
    fieldType: "text",
    required: true,
  },
  userProblem: {
    ph: "Please enter the job details",
    label: "Problem Details",
    fieldType: "textbox",
    required: true,
  },
  userPackage: {
    ph: "Please select a package from the list",
    label: "Available Packages",
    fieldType: "select",
    required: true,
    data: [
      {
        label: "Basic Package",
        value: "pkg-basic",
      },
      {
        label: "Tire Change",
        value: "pkg-tire-change",
      },
      {
        label: "Paint Job",
        value: "pkg-paint-job",
      },
    ],
  },
};
