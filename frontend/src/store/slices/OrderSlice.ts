import { createSlice } from "@reduxjs/toolkit";

export const OrderSlice = createSlice({
    name: "OrderStore",
    initialState: {
        orders: [],
    },
    reducers: {
        addOrder: (state, action) => {
            console.log(action.payload, " from add order ");
            state.orders.push(action.payload);
        },
    },
});

export const { addOrder } = OrderSlice.actions;

export default OrderSlice.reducer;
