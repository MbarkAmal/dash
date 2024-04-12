import { createSlice} from "@reduxjs/toolkit";

const productSlice = createSlice ({

    name : "products" , 
    initialState :{

        products: []
    },
    reducers: {
        getProduct : (state , action) => {
            state.products = action.payload.map(product => {
                return {id : product._id , productName : product.productName , price : product.price ,
                        weight : product.weight , stock : product.stock , category : product.category , 
                        photo: product.photo , createdAt : product.createdAt}
            
            })
        },

        deleteProduct : (state, action ) => {
            const id = action.payload.id;
            state.products = state.products.filter(p => p.id !==id )

        },

        updateProduct: (state, action )=> {
            const index = state.products.findIndex(p => p.id === action.payload.id)
            state.products[index] ={
                id : action.payload.id,
                productName : action.payload.productName,
                price : action.payload.price,
                weight : action.payload.weight,
                stock : action.payload.stock,
                category : action.payload.category,
                photo : action.payload.photo,
            }
        },

        addProduct : (state , action )=> {
            state.products.push(action.payload)
        },

        searchProduct : (state , action) => {
            state.searchResults = action.payload;
        }



    }

})
 
export const {getProduct , deleteProduct ,updateProduct ,addProduct , searchProduct} = productSlice.actions ;
export default productSlice.reducer ;