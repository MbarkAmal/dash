import { createSlice} from '@reduxjs/toolkit';

const orderSlice = createSlice ({
    name : "orders",
    initialState: {

        orders: []
    },

    reducers: {
        getOrder : (state , action ) => {
            state.orders= action.payload
            },

        deleteOrder : (state, action ) => {
            const id = action.payload.id;
            state.orders = state.orders.filter( o => o.id !==id)
        },

        fetchLastCustomerOrder : (state , action) => {
            state.orders[0]=action.payload 
        },

    }
})

export const {getOrder , deleteOrder,fetchLastCustomerOrder} = orderSlice.actions;
export default orderSlice.reducer ;