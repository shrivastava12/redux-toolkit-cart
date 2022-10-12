import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import cartItems from '../../cartItems';
import axios from 'axios';

const url =  'https://course-api.com/react-useReducer-cart-project';

const initialState = {
    cartItems:[],
    amount:4,
    total:0,
    isLoading:true
}

export const getCartItems = createAsyncThunk('cart/getCartItems',async(name,thunkAPI) => {
    try{
        console.log(thunkAPI.getState()) // To get the state of whole application
        const res =  await axios.get(url);
        return res.data;
    }catch(e){
        return thunkAPI.rejectWithValue('Something went wrong');
    }
})
const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        clearCart:(state) => {  
            state.cartItems = []
        }, 
        removeItem:(state,action) => {
           const itemId = action.payload;
           state.cartItems = state.cartItems.filter((item) => item.id !== itemId)
        },
        increase:(state,action) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload.id)
            cartItem.amount =  cartItem.amount + 1;
        },
        decrease:(state,action) => {
            const cartItem = state.cartItems.find((item) => item.id === action.payload.id)
            cartItem.amount =  cartItem.amount - 1;
        },
        calculateTotal:(state) => {
            let amount = 0;
            let total = 0;
            state.cartItems.forEach((item) => {
                amount += item.amount;
                total += item.amount * item.price;                
            });
            state.amount =  amount;
            state.total = total;
        }
    },
    extraReducers:{
        [getCartItems.pending]:(state) => {
            state.isLoading = true
        },
        [getCartItems.fulfilled]:(state,action) => {
            state.isLoading = false
            state.cartItems = action.payload
        },
        [getCartItems.rejected]:(state) => {
            state.isLoading = false
        }
    }
})
export const {clearCart,removeItem,increase,decrease,calculateTotal} = cartSlice.actions;
export default cartSlice.reducer;

// console.log(cartSlice);