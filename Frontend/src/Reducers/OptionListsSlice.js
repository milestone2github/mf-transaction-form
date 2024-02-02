import { createSlice } from '@reduxjs/toolkit'
import { fetchAmcNameOptions, fetchFolioOptions, fetchSchemeNameOptions } from '../Actions/OptionListsAction';

const optionListsSlice = createSlice({
  name: 'optionLists',
  initialState: {
    panOptions: [
      'Charu Negi',
      'Ishu Mavar',
      'Manjeet Kumar',
      'Nidhi Sharma',
      'Pramod Bhutani',
      'Sagar Maini',
      'Ved Prakash',
      'Vilakshan Bhutani',
      'Yatin Munjal',
    ],
    investorNameOptions: [
      'Charu Negi',
      'Ishu Mavar',
      'Manjeet Kumar',
      'Nidhi Sharma',
      'Pramod Bhutani',
      'Sagar Maini',
      'Ved Prakash',
      'Vilakshan Bhutani',
      'Yatin Munjal',
    ],
    transactionPrefOptions : [
      'ASAP', 'Date Given in Remarks', 'Most Urgent', 'Next Working Day'
    ],
    sysTransactionForOptions: ['Registration', 'Cancellation'],
    sysTransactionForOptionsWithPause: ['Registration', 'Pause', 'Cancellation'],
    amcNameOptions: ['axis', 'pnb'],//test
    schemeNameOptions: ['axis-scheme', 'pnb-scheme'],//test
    schemeOptionOptions: ['Growth', 'IDCW / Dividend'],
    sipPauseMonthsOptions: ['Not Applicable', '2 Months', '3 Months', 'Maximum Months'],
    sip_stp_swpDateOptions: [
      "",
      "1 to 10",
      "11 to 20",
      "21 to 30",
      "Call Client and take dates",
      "STP - SWP - at your confort Level"
    ],
    transactionTypeOptions: [
      'Capital Appreciation STP',
      'Capital Appreciation SWP',
      'SIP',
      'STP',
      'SWP'
    ],
    folioOptions: [],
    folioOptionsWithNew: ['Create New Folio'],
    purch_redempTraxTypeOptions: ['Purchase', 'Redemption'],
    purch_redempTraxUnits_AmountOptions: ['Amount Given in next question', 'Long Term Units', 'Redeem All Units', 'Units Mentioned in Remarks', 'Unlocked Units'],
    switchTraxUnits_AmountOptions: ['Amount Given in next question', 'Long Term Units', 'Switch All Units', 'Units Mentioned in Remarks', 'Unlocked Units']
  },
  reducers: {
    // updateSysTransactionFor: (state, action) => {
    //   const { options, index } = action.payload;
    //   console.log(options, index)
    //   state.sysTransactionForOptions[index] = options;
    // },
    // updateFolioOptions: (state, action) => {
    //   const { options, index } = action.payload;
    //   console.log(options, index)
    //   state.folioOptions[index] = options;
    // },
    // addSysOptionsInstance: (state) => {
    //   state.sysTransactionForOptions.push(['Registration', 'Pause', 'Cancellation']);

    //   let existingFolioOptions = [...state.folioOptions[0]]
    //   if (existingFolioOptions[0] === 'Create New Folio') {
    //     existingFolioOptions = existingFolioOptions.slice(1)
    //   }
    //   state.folioOptions.push(['Create New Folio', ...existingFolioOptions])
    // },
    // removeSysOptionsInstance: (state, action) => {
    //   const index = action.payload;
    //   if (index >= 0 && index < state.sysTransactionForOptions.length) {
    //     state.sysTransactionForOptions.splice(index, 1); // Remove the item at the specified index
    //     state.folioOptions.splice(index, 1); // Remove the item at the specified index
    //   }
    // },
    // addPurchRedempOptionsInstance: (state) => {
    //   let existingFolioOptions = [...state.folioOptions[0]]
    //   if (existingFolioOptions[0] === 'Create New Folio') {
    //     existingFolioOptions = existingFolioOptions.slice(1)
    //   }
    //   state.folioOptions.push(['Create New Folio', ...existingFolioOptions])
    // },
    // removePurchRedempOptionsInstance: (state, action) => {
    //   const index = action.payload;
    //   if (index >= 0 && index < state.folioOptions.length) {
    //     state.sysTransactionForOptions.splice(index, 1); // Remove the item at the specified index
    //     state.folioOptions.splice(index, 1); // Remove the item at the specified index
    //   }
    // },
    extraReducers: {
      [fetchAmcNameOptions.fulfilled]: (state, action) => {
        state.amcNameOptions = action.payload;
      },
      [fetchFolioOptions.fulfilled]: (state, action) => {
        state.folioOptions = action.payload;
        state.folioOptionsWithNew = [...state.folioOptionsWithNew, action.payload];
      },
      [fetchSchemeNameOptions.fulfilled]: (state, action) => {
        state.schemeNameOptions = action.payload;
      }
    }
  }
})

// export const { updateSysTransactionFor, updateFolioOptions, addSysOptionsInstance, removeSysOptionsInstance, addPurchRedempOptionsInstance, removePurchRedempOptionsInstance } = optionListsSlice.actions;

export default optionListsSlice.reducer;