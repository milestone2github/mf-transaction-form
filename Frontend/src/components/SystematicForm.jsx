import React, { useState } from 'react'
import RadioInput from './common/RadioInput'
import InputList from './common/InputList'
import TextInput from './common/TextInput'
import PreFilledSelect from './common/PreFilledSelect'
import NumberInput from './common/NumberInput'
import TextAreaInput from './common/TextAreaInput'
import { folioOptions, mfAmcOptions, schemeNameOptions, schemeOptionOptions, sipPauseMonthsOptions, sip_stp_swpDateOptions, transactionOptions, transactionTypeOptions } from '../utils/optionLists'
import PrimaryButton from './common/PrimaryButton'


function SystematicForm({systematicData, onChange, onSelect}) {

  return (
    <fieldset className='relative px-3 pb-3 flex flex-wrap gap-x-16 gap-y-3 border border-gray-400 border-t-0'>
      {/* <legend>Systematic</legend> */}
      <div className='grow shrink basis-72'>
        <RadioInput
          label='Transaction For'
          name='systematicTraxFor'
          options={transactionOptions}
          selectedOption={systematicData.systematicTraxFor}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='systematicTraxType'
          label='Transaction Type'
          options={transactionTypeOptions}
          selectedOption={systematicData.systematicTraxType}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='systematicMfAmcName'
          label='MF (AMC) Name'
          options={mfAmcOptions}
          selectedOption={systematicData.systematicMfAmcName}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <InputList
          id='systematicSchemeName'
          label='Scheme Name (Target Scheme)'
          listName='systematic-scheme-names'
          required={true}
          value={systematicData.systematicSchemeName}
          onChange={onChange}
          listOptions={schemeNameOptions}
        />
      </div>
      <div className='grow shrink basis-72'>
        <TextInput
          id='systematicSourceScheme'
          label='Source Scheme in case of STP (optional)'
          value={systematicData.systematicSourceScheme}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <RadioInput
          label='Scheme Option'
          name='systematicSchemeOption'
          options={schemeOptionOptions}
          selectedOption={systematicData.systematicSchemeOption}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='systematicFolio'
          label='Folio'
          options={folioOptions}
          selectedOption={systematicData.systematicFolio}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <NumberInput
          id='sip_swp_stpAmount'
          label='SIP / SWP / STP Amount'
          min={1}
          required={true}
          value={systematicData.sip_swp_stpAmount}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <NumberInput
          id='tenureOfSip_swp_stp'
          label='Tenure of SIP / SWP / STP'
          min={1}
          value={systematicData.tenureOfSip_swp_stp}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='sipPauseMonths'
          label='SIP Pause Months'
          options={sipPauseMonthsOptions}
          selectedOption={systematicData.sipPauseMonths}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='sip_stp_swpDate'
          label='SIP / SWP / STP Date'
          options={sip_stp_swpDateOptions}
          selectedOption={systematicData.sip_stp_swpDate}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <NumberInput
          id='firstTransactionAmount'
          label='First Transaction Amount'
          min={1}
          required={true}
          value={systematicData.firstTransactionAmount}
          onChange={onChange}
        />
      </div>
      <div className='shrink w-1/2'>
        <TextAreaInput
          id='systematicRemarksByEntryPerson'
          label='Remarks by Entry Person'
          rows={3}
          cols={5}
          minLength={3}
          maxLength={500}
          required={true}
          value={systematicData.systematicRemarksByEntryPerson}
          onChange={onChange}
        />
      </div>
      <div className='absolute bottom-3 right-3'>
        <PrimaryButton text='Save' />
      </div>
    </fieldset>
  )
}

export default SystematicForm