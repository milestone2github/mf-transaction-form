import React from 'react'
import EmailInput from './common/EmailInput'
import RadioInput from './common/RadioInput'
import InputList from './common/InputList'
import TextInput from './common/TextInput'
import { doneByOptions, transactionPrefOptions } from '../utils/optionLists'

function Header({ commonData, onChange }) {

  return (
    <div>
      <h1 className='text-3xl text-primary-white py-2 bg-light-blue'>MF TRANSACTIONS</h1>
      <fieldset className='flex flex-col gap-3 mt-3'>
        {/* <legend></legend> */}
        {/* <div className='grow shrink w-80'>
          <EmailInput
            id='email'
            label='Email'
            required={true}
            value={commonData.email}
            onChange={onChange}
            secondItem='@niveshonline.com'
          />
        </div> */}

        <div className='grow shrink'>
          <RadioInput
            label='Transaction Preference'
            name='transactionPreference'
            options={transactionPrefOptions}
            selectedOption={commonData.transactionPreference}
            onChange={onChange}
            secondItem='@niveshonline.com'
          />
        </div>

        {/* <div className='grow shrink w-80 mt-2'>
          <InputList
            id='registrant'
            label='Entry done by'
            listName='done-by-members'
            required={true}
            value={commonData.registrant}
            onChange={onChange}
            listOptions={doneByOptions}
          />
        </div> */}
        <div className='grow shrink w-80'>
          <TextInput
            id='panNumber'
            label='PAN Number'
            placeHolder='XXXXXXXXXX'
            required={true}
            value={commonData.panNumber}
            onChange={onChange}
          />
        </div>
        <fieldset className='flex grow shrink gap-3'>
          <legend className='text-gray-800 text-sm text-left'>Investor Name</legend>
          <div className="w-80">
            <TextInput
              id='investorFirstName'
              label='First Name'
              // placeHolder='First Name'
              required={true}
              value={commonData.investorFirstName}
              onChange={onChange}
            />
          </div>
          <div className="w-80">
            <TextInput
              id='investorLastName'
              label='Last Name (optional)'
              // placeHolder='Last Name'
              value={commonData.investorLastName}
              onChange={onChange}
            />
          </div>
        </fieldset>

      </fieldset>
    </div>
  )
}

export default Header