import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoggedIn: false, //make it false
    userData: null,
  },
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload
    }
  }
})

export const { setLoggedIn, setUser } = userSlice.actions;

export default userSlice.reducer;