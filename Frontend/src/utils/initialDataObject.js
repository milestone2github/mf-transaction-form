import getCurrentDate from "./getCurrentDate"

export const hollowSystematicObj = {
  systematicTraxType: 'SIP',
  systematicTraxFor: 'Registration',
  systematicSchemeName: '',
  systematicMfAmcName: '',
  systematicSourceScheme: '',
  systematicSchemeOption: '',
  systematicFolio: '',
  sip_swp_stpAmount: 1,
  tenureOfSip_swp_stp: 9999,
  sipPauseMonths: '',
  sip_stp_swpDate: getCurrentDate(),
  firstTransactionAmount: 1,
  systematicRemarksByEntryPerson: '',
  systematicPaymentMode: ''
}

export const hollowPurchRedempObj = {
  purch_RedempTraxType: '',
  purch_redempMfAmcName: '',
  purch_redempSchemeName: '',
  purch_redempSchemeOption: '',
  purch_redempFolio: '',
  purch_redempTransactionUnits_Amount: 'Amount Given in next question',
  purch_redempTransactionAmount: 1,
  purch_redempRemarksByEntryPerson: '',
  purch_redempPaymentMode: ''
}

export const hollowSwitchObj = {
  switchMfAmcName: '',
  switchFromScheme: '',
  switchToScheme: '',
  switchSchemeOption: '',
  switchFolio: '',
  switchTransactionUnits_Amount: 'Amount Given in next question',
  switchTransactionAmount: 1,
  switchRemarksByEntryPerson: '',
}
