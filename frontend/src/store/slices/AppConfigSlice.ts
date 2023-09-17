import { createSlice } from "@reduxjs/toolkit";

type ConfigState = {
  navHidden: boolean;
  drawerOpened: boolean;
};
const initialState: ConfigState = {
  navHidden: false,
  drawerOpened: false,
};
export const AppConfigSlice = createSlice({
  name: "AppConfig",
  initialState,
  reducers: {
    toggleNavState: (state) => {
      state.navHidden = !state.navHidden;
    },
    toggleDrawerState: (state) => {
      state.drawerOpened = !state.drawerOpened;
    },
  },
});

export const { toggleDrawerState, toggleNavState } = AppConfigSlice.actions;

export default AppConfigSlice.reducer;
