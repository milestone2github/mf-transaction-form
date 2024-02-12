import React, { useEffect } from 'react'
import EmailInput from './common/EmailInput'
import RadioInput from './common/RadioInput'
import InputList from './common/InputList'
import TextInput from './common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { handleChange } from '../Reducers/CommonDataSlice'
import { fetchInvestorData } from '../Actions/OptionListsAction'
import CustomInputDatalist from './common/CustomInputDatalist'

function Header({ handleSubmit, submitBtn }) {
  // get systematicData state from store
  const commonData = useSelector(state => state.commonData.value);

  // get optionLists state from store 
  const { 
    panOptions, 
    investorNameOptions, 
    transactionPrefOptions 
  } = useSelector(state => state.optionLists);

  // use useDispatch hook to use reducers 
  const dispatch = useDispatch();

  // effect to fetch investor data 
  useEffect(() => {
    dispatch(fetchInvestorData())
    .then((action) => {
      // This will log the action after it's been dispatched and processed
      console.log("Dispatched fetchInvestorData:", action);
    })
    .catch(error => {
      console.error("Error while fetching investor data:", error);
    });
  
  }, [])

  const handleNameChange = (event) => {
    const { name, value } = event.target;

    // if(investorNameOptions.includes(value)){
    let investorData = value.split('/').map(item => item.trim());
    if(investorData.length > 1) {
      dispatch(handleChange({name, value: investorData[0]}));
      dispatch(handleChange({name:'panNumber', value: investorData[1]}));
      dispatch(handleChange({name:'familyHead', value: investorData[2]}));
      return;
    }
    dispatch(handleChange({name, value: investorData[0]}));
  }

  const handlePanChange = (event) => {
    const { name, value } = event.target;

    // if(investorNameOptions.includes(value)){
    let investorData = value.split('/').map(item => item.trim());
    console.log(investorData)
    if(investorData.length > 1) {
      console.log('greater')
      dispatch(handleChange({name:'investorName', value: investorData[0]}));
      dispatch(handleChange({name, value: investorData[1]}));
      dispatch(handleChange({name:'familyHead', value: investorData[2]}));
      return;
    }
    dispatch(handleChange({name, value}))
  }

  
  // method to handle change in inputs 
  const handleInputChange = (event) => {
    const { name, value, dataset } = event.target;  
    console.log(event)  
    dispatch(handleChange({name, value}));
  }

  return (
    <div>
      <header>
      <h1 className='text-3xl text-primary-white py-2 bg-light-blue'>MF TRANSACTIONS</h1>
      </header>
      <form onSubmit={handleSubmit} className='flex flex-wrap gap-6 gap-y-8 mt-3'>
        {/* <legend></legend> */}
        {/* <div className='grow shrink w-80'>
          <EmailInput
            id='email'
            label='Email'
            required={true}
            value={commonData.email}
            onChange={handleInputChange}
            secondItem='@niveshonline.com'
          />
        </div> */}

        <div className='grow shrink basis-full'>
          <RadioInput
            label='Transaction Preference'
            name='transactionPreference'
            options={transactionPrefOptions}
            selectedOption={commonData.transactionPreference}
            onChange={handleInputChange}
          />
        </div>

        {/* <fieldset className='flex grow shrink gap-3 mt-3'> */}
          {/* <legend className='text-gray-800 text-sm text-left'>Investor Name</legend> */}
          <div className="w-80 grow shrink basis-72">
            <InputList
              id='investorName'
              label='Investor name'
              listName='investor-names'
              required={true}
              value={commonData.investorName}
              customHandleChange={handleNameChange}
              listOptions={investorNameOptions}
            />
          </div>
          {/* <div className="w-80">
            <TextInput
              id='investorLastName'
              label='Last Name (optional)'
              // placeHolder='Last Name'
              disable={true}
              value={commonData.investorLastName}
              onChange={handleInputChange}
            />
          </div> */}
        {/* </fieldset> */}

        <div className='grow shrink basis-72 w-80'>
          <InputList
            id='panNumber'
            label='PAN Number'
            listName='pan-numbers'
            placeHolder='XXXXXXXXXX'
            required={true}
            value={commonData.panNumber}
            customHandleChange={handlePanChange}
            listOptions={investorNameOptions}
          />
        </div>
        <div className='grow shrink basis-72 w-80'>
          <TextInput
            id='familyHead'
            label='Family Head'
            required={true}
            disable={true}
            value={commonData.familyHead}
            onChange={handleInputChange}
          />
        </div>
        
        <button ref={submitBtn} type='submit' className='hidden'>Submit</button>
      </form>
    </div>
  )
}

export default Header