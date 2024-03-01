import { createSlice } from '@reduxjs/toolkit'

const commonDataSlice = createSlice({
    name: 'commonData',
    initialState: {
        value: {
            email: '',
            transactionPreference: 'ASAP',
            registrant: '',
            panNumber: '',
            investorName: '',
            familyHead: ''
        }
    },
    reducers: {
        handleChange: (state, action) => {
            const { name, value } = action.payload;
            // Update the specific field in the state
            state.value[name] = value;
        },
        resetCommonData: (state) => {
            state.value = {
                email: '',
                transactionPreference: 'ASAP',
                registrant: '',
                panNumber: '',
                investorName: '',
                familyHead: ''
            }
        }
    }
})

export const { handleChange, resetCommonData } = commonDataSlice.actions;

export default commonDataSlice.reducer;