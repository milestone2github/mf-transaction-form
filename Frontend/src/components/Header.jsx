import React from 'react'
import EmailInput from './common/EmailInput'
import RadioInput from './common/RadioInput'
import InputList from './common/InputList'
import TextInput from './common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { handleChange } from '../Reducers/CommonDataSlice'

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

  // method to handle change in inputs 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    dispatch(handleChange({name, value}));
  }

  return (
    <div>
      <header>
      <h1 className='text-3xl text-primary-white py-2 bg-light-blue'>MF TRANSACTIONS</h1>
      </header>
      <form onSubmit={handleSubmit} className='flex flex-col gap-3 mt-3'>
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

        <div className='grow shrink'>
          <RadioInput
            label='Transaction Preference'
            name='transactionPreference'
            options={transactionPrefOptions}
            selectedOption={commonData.transactionPreference}
            onChange={handleInputChange}
          />
        </div>

        <fieldset className='flex grow shrink gap-3 mt-3'>
          <legend className='text-gray-800 text-sm text-left'>Investor Name</legend>
          <div className="w-80">
            <InputList
              id='investorFirstName'
              label='First Name'
              listName='investor-names'
              required={true}
              value={commonData.investorFirstName}
              onChange={handleInputChange}
              listOptions={investorNameOptions}
            />
          </div>
          <div className="w-80">
            <TextInput
              id='investorLastName'
              label='Last Name (optional)'
              // placeHolder='Last Name'
              disable={true}
              value={commonData.investorLastName}
              onChange={handleInputChange}
            />
          </div>
        </fieldset>

        <div className='grow shrink w-80 mt-2'>
          <InputList
            id='panNumber'
            label='PAN Number'
            listName='pan-numbers'
            placeHolder='XXXXXXXXXX'
            required={true}
            value={commonData.panNumber}
            onChange={handleInputChange}
            listOptions={panOptions}
          />
        </div>
        <div className='grow shrink w-80'>
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