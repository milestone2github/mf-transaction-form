import { createAsyncThunk } from "@reduxjs/toolkit";
const baseUrl = 'http://localhost:5000/api'

// Async thunk for fetching AMC name options
export const fetchInvestorData = createAsyncThunk(
  'optionLists/fetchInvestorData',
  async () => {
    try {
      const response = await fetch(`${baseUrl}/investors`, {
        method: 'GET'
      }); 
      const data = await response.json();
      console.log('investor data:', data)
      if(!response.ok) {
        throw new Error('Unable to fetch investor data')
      }
      return data; 
    } catch (error) {
      console.log(error)
    }
  }
);

// Async thunk for fetching AMC name options
export const fetchAmcNameOptions = createAsyncThunk(
  'optionLists/fetchAmcNameOptions',
  async () => {
    try {
      const response = await fetch(`${baseUrl}/amc-names`, {
        method: 'GET'
      }); 
      const data = await response.json();
      if(!response.ok) {
        throw new Error('Unable to fetch AMC names')
      }
      return data; 
    } catch (error) {
      console.log(error)
    }
  }
);

// Async thunk for fetching Folio Options
export const fetchFolioOptions = createAsyncThunk(
  'optionLists/fetchFolioOptions',
  async () => {
    try {
      const response = await fetch(`${baseUrl}/folios`, {
        method: 'GET'
      }); 
      const data = await response.json();
      if(!response.ok) {
        throw new Error('Unable to fetch Folios')
      }
      return data; 
    } catch (error) {
      console.log(error)
    }
  }
);

// Async thunk for fetching Folio Options
export const fetchSchemeNameOptions = createAsyncThunk(
  'optionLists/fetchSchemeNameOptions',
  async () => {
    try {
      const response = await fetch(`${baseUrl}/scheme-names`, {
        method: 'GET'
      }); 
      const data = await response.json();
      if(!response.ok) {
        throw new Error('Unable to fetch Scheme names')
      }
      return data; 
    } catch (error) {
      console.log(error)
    }
  }
);