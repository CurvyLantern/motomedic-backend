import { createSlice } from "@reduxjs/toolkit";
import { Colors } from "./colors";
const ColorsWithValue = Colors.map((color) => {
  return {
    ...color,
    value: color.label.toLowerCase(),
  };
});
export const ColorSlice = createSlice({
  name: "BasicStore",
  initialState: {
    colors: [...ColorsWithValue],
  },
  reducers: {
    addColor: (state, action) => {
      state.colors.push(action.payload);
    },
    removeColor: (state, action) => {
      const idx = state.colors.findIndex(action.payload);
      state.colors.splice(idx, 1);
    },
  },
});

export const { addColor, removeColor } = ColorSlice.actions;

export default ColorSlice.reducer;
