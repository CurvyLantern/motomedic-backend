import { createSlice } from "@reduxjs/toolkit";

export const ServiceSlice = createSlice({
  name: "ServiceStore",
  initialState: {
    serviceTypes: [
      {
        label: "Paint Job",
        value: "paint-job",
      },
    ],
  },
  reducers: {
    addType: (state, action) => {
      state.serviceTypes.push(action.payload);
    },
    removeType: (state, action) => {
      const idx = state.serviceTypes.findIndex(action.payload);
      state.serviceTypes.splice(idx, 1);
    },
  },
});

export const { addType, removeType } = ServiceSlice.actions;

export default ServiceSlice.reducer;
