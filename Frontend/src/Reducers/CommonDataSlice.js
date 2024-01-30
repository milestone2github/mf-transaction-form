import { createSlice } from '@reduxjs/toolkit'

const commonDataSlice = createSlice({
    name: 'commonData',
    initialState: {
        value: {
            email: '',
            transactionPreference: 'ASAP',
            registrant: '',
            panNumber: '',
            investorFirstName: '',
            investorLastName: '',
            familyHead: ''
        }
    },
    reducers: {
        handleChange: (state, action) => {
            const { name, value } = action.payload;
            // Update the specific field in the state
            state.value[name] = value;
        },
    }
})

export const { handleChange } = commonDataSlice.actions;

export default commonDataSlice.reducer;