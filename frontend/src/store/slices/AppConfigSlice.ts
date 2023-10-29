import { createSlice } from "@reduxjs/toolkit";

type ConfigState = {
  navHidden: boolean;
  drawerOpened: boolean;
  customerDrawerOpened: boolean;
};
const initialState: ConfigState = {
  navHidden: false,
  drawerOpened: false,
  customerDrawerOpened: false,
};
export const AppConfigSlice = createSlice({
  name: "AppConfig",
  initialState,
  reducers: {
    toggleNavState: (state) => {
      state.navHidden = !state.navHidden;
    },
    closeNavState: (state) => {
      state.navHidden = true;
    },
    openNavState: (state) => {
      state.navHidden = false;
    },
    toggleDrawerState: (state) => {
      state.drawerOpened = !state.drawerOpened;
    },

    toggleCustomerDrawer: (state) => {
      state.customerDrawerOpened = !state.customerDrawerOpened;
    },
    openCustomerDrawer: (state) => {
      state.customerDrawerOpened = true;
    },
    closeCustomerDrawer: (state) => {
      state.customerDrawerOpened = false;
    },
  },
});

export const {
  toggleDrawerState,
  toggleNavState,
  closeNavState,
  openNavState,
  closeCustomerDrawer,
  openCustomerDrawer,
  toggleCustomerDrawer,
} = AppConfigSlice.actions;

export default AppConfigSlice.reducer;
