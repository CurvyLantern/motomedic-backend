import { configureStore } from "@reduxjs/toolkit";
import AppConfigReducer from "./slices/AppConfigSlice";
import ProductSlice from "./slices/ProductSlice";
import ColorSlice from "./slices/ColorSlice";
import CustomerSlice from "./slices/CustomerSlice";
import ServiceSlice from "./slices/ServiceSlice";
import OrderSlice from "./slices/OrderSlice";

export const store = configureStore({
    reducer: {
        appConfig: AppConfigReducer,
        product: ProductSlice,
        color: ColorSlice,
        customer: CustomerSlice,
        service: ServiceSlice,
        order: OrderSlice,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
