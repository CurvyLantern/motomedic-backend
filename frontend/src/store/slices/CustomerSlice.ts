import { Product } from "@/types/defaultTypes";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// const randStr = () => {
//     const al = "abcdefghijklmnopqrstuvwxyz";

//     const len = Math.floor(Math.random() * (al.length - 5)) + 5;
//     let char = "";
//     for (let i = 0; i <= len; i++) {
//         char += al[Math.floor(Math.random() * al.length)];
//     }
//     return char;
// };
let id = 1;
class Customer {
    id: number;
    name: string;
    label: string;
    value: number;
    phone: number;
    email: string;
    address: string;

    constructor() {
        const _id = id++;
        const _name = `User-${_id}`;
        const _phone = Math.floor(Math.random() * 10000000 + 500000);

        this.id = _id;
        this.name = _name;
        this.label = _name;
        this.value = _id;
        this.phone = _phone;
        this.email = `${_name}@gmail.com`;
        this.address = "13 b north western housing";
    }
}
const temp = Array.from({ length: 100 }, () => new Customer());
export type OrderProduct = Product & {
    count: number;
};
type OrderService = Product & {
    count: number;
    price: number;
};
type Orders = {
    products: OrderProduct[];
    services: OrderService[];
};
type SelectedCustomer = {
    name: string;
    email: string;
    phone: string;
    address: string;
    value: string;
    orders: Orders;
};

export const CustomerSlice = createSlice({
    name: "BasicStore",
    initialState: {
        selectedCustomer: null as SelectedCustomer | null,
        // selectedCustomer: {
        //     address: "",
        //     email: "",
        //     name: "",
        //     phone: "",
        //     value: "",
        //     orders: {
        //         products: [],
        //         services: [],
        //     },
        // } as SelectedCustomer | null,
        customers: [...JSON.parse(JSON.stringify(temp))],
    },
    reducers: {
        // action.payload = {id,value}
        updateCustomerByIdOrValue: (state, action) => {
            const { id, value } = action.payload;
            const customer = state.customers.find((customer) => {
                if (id) {
                    return customer.id === id;
                } else if (value) {
                    return customer.value === value;
                }
            });
            if (customer) {
                state.selectedCustomer = {
                    ...JSON.parse(JSON.stringify(customer)),
                    orders: {
                        products: [],
                        services: [],
                    },
                };
            } else {
                state.selectedCustomer = null;
            }
        },

        addCustomOrderService: (state, action: PayloadAction<OrderService>) => {
            if (!state.selectedCustomer) {
                console.log(" customer is undefined ");
            }
            state.selectedCustomer?.orders.services.push(action.payload);
        },
        addCustomerOrderProduct: (
            state,
            action: PayloadAction<OrderService>
        ) => {
            state.selectedCustomer?.orders.products.push(action.payload);
        },

        updateCustomerOrderProduct: (
            state,
            action: PayloadAction<OrderProduct>
        ) => {
            const pid = action.payload.id;

            const idx = state.selectedCustomer.orders.products.findIndex(
                (p) => p.id === pid
            );
            if (idx < 0) {
                console.log({ idx });
                // console.log(state.selectedCustomer.orders.products, "products");
                console.log(state.selectedCustomer.orders.products, "products");

                state.selectedCustomer.orders.products.push(action.payload);
            } else {
                console.log({ idx });

                console.log({ pid });
                //     console.log(state.selectedCustomer.orders.products[idx], " products ");
                state.selectedCustomer.orders.products[idx].count =
                    action.payload.count;
            }

            // set(pid, action.payload);
        },
        updateCustomerOrderService: (
            state,
            action: PayloadAction<OrderService>
        ) => {
            const sid = action.payload.id;
            const idx = state.selectedCustomer?.orders.services.findIndex(
                (s) => s.id === sid
            );
            state.selectedCustomer.orders.services[idx] = action.payload;

            // set(sid, action.payload);
        },
    },
});

export const {
    updateCustomerByIdOrValue,
    updateCustomerOrderService,
    updateCustomerOrderProduct,
    addCustomOrderService,
    addCustomerOrderProduct,
} = CustomerSlice.actions;

export default CustomerSlice.reducer;
