import { createSlice } from '@reduxjs/toolkit'
import { fetchAmcNameOptions, fetchFolioOptions, fetchInvestorData, fetchSchemeNameOptions } from '../Actions/OptionListsAction';

const optionListsSlice = createSlice({
  name: 'optionLists',
  initialState: {
    investorNameOptions: [],
    transactionPrefOptions: [
      'ASAP', 'Most Urgent', 'Next Working Day'
    ],
    sysTransactionForOptions: ['Registration', 'Cancellation'],
    sysTransactionForOptionsWithPause: ['Registration', 'Pause', 'Cancellation'],
    amcNameOptions: [],//test
    schemeNameOptions: [],//test
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
    switchTraxUnits_AmountOptions: ['Amount Given in next question', 'Long Term Units', 'Switch All Units', 'Units Mentioned in Remarks', 'Unlocked Units'],
    sysPaymentModeOptions: ['Netbanking', 'Mandate', 'Cheque', 'NEFT/RTGS', 'Zero Balance'],
    purchPaymentModeOptions: ['Netbanking', 'Mandate', 'Cheque', 'NEFT/RTGS']
  },
  extraReducers: (builder) => {
    builder.addCase(fetchInvestorData.fulfilled, (state, action) => {
      const investorOptions = action.payload.map(investor => {
        return ({
          name: investor['NAME'],
          pan: investor['PAN'],
          familyHead: investor['FAMILY HEAD'],
          email: investor['EMAIL'],
          iWellCode: investor['IWELL CODE']
        })
      })
      state.investorNameOptions = investorOptions;
    });

    builder.addCase(fetchAmcNameOptions.fulfilled, (state, action) => {
      let options = action.payload.map(item => (item["FUND NAME"]));
      state.amcNameOptions = options;
    });

    builder.addCase(fetchFolioOptions.fulfilled, (state, action) => {
      let folioOptions = action.payload.map(folio => ({
        folio: folio["FOLIO NO"],
        units: folio["UNITS"],
        holding: folio["HOLDING"],
        amount: folio["AUM"],
        bankDetail: folio["BANK NAME"].toUpperCase().split(' ').map(word => word[0]).join('') + ' ' + folio["ACCOUNT NO"].toString().slice(-4), 
      }));  
      state.folioOptionsWithNew = ['Create New Folio', ...folioOptions];
      state.folioOptions = folioOptions;
    });

    builder.addCase(fetchSchemeNameOptions.fulfilled, (state, action) => {
      let options = action.payload.map(item => (item['scheme_name']))
      state.schemeNameOptions = options;
    });
  }
})


export default optionListsSlice.reducer;