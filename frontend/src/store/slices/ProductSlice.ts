import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export const ProductSlice = createSlice({
    name: "ProductStore",
    initialState: {
        variants: [
            {
                name: "v1",
                price: 0,
                sku: "",
                photo: null,
            },
        ],
        discountType: [
            {
                label: "Flat",
                value: "flat",
            },
            {
                label: "Percentage",
                value: "prcnt",
            },
        ],
        attributes: [
            {
                priority: 0,
                label: "Size",
                value: "size",
                childAttrs: [
                    { label: "M", value: "M" },
                    { label: "L", value: "L" },
                    { label: "XL", value: "XL" },
                ],
            },
            {
                priority: 1,
                label: "Fabric",
                value: "fabric",
                childAttrs: [
                    { label: "Silk", value: "silk" },
                    { label: "Lilen", value: "lilen" },
                ],
            },
        ],
    },
    reducers: {
        createVariant(
            state,
            action: PayloadAction<
                {
                    name: string;
                }[]
            >
        ) {
            console.log("hello there", action.payload);
            const _variantsWithData = action.payload.map((v) => ({
                name: v.name,
                price: 0,
                sku: "",
                photo: null,
            }));
            state.variants = _variantsWithData;
        },
    },
});

export const { createVariant } = ProductSlice.actions;

export default ProductSlice.reducer;
