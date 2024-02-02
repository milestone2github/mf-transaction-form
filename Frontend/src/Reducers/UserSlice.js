import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoading: false,
    isLoggedIn: true, //make it false while deployment
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