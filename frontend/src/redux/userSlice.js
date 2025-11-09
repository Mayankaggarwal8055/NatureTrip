import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import verifyUser from "../API/verifyUser";

export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
    const response = await verifyUser();
    return response.user || null;
});

const initialState = {
    user: null,
    isAuthenticated: false
}


const userSlice =  createSlice({
    name:'user',
    initialState,
    reducers:{
        setuser:(state,action)=>{  // in this line initial state is named as state & in createasyncthunk that returned response.user is name as action.payload 
            state.user = action.payload;
            state.isAuthenticated = !!action.payload
        }
    },

    extraReducers: (builder) => {
    builder
      
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        
      })
      .addCase(fetchUser.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        
      });
  },
})


export const { setuser } = userSlice.actions;

export default userSlice.reducer