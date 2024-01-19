import React, { useState } from 'react'
import { folioOptions, mfAmcOptions, purch_redempTraxTypeOptions, purch_redempTraxUnits_AmountOptions, schemeNameOptions, schemeOptionOptions } from '../utils/optionLists';
import PreFilledSelect from './common/PreFilledSelect';
import InputList from './common/InputList';
import RadioInput from './common/RadioInput';
import NumberInput from './common/NumberInput';
import TextAreaInput from './common/TextAreaInput';
import PrimaryButton from './common/PrimaryButton';

function PurchRedempForm({purchRedempData, onChange, onSelect}) {
  
  return (
    <fieldset className='relative px-3 pb-3 flex flex-wrap gap-x-16 gap-y-3 border border-gray-400 border-t-0'>
      {/* <legend>Purchase / Redemption</legend> */}
      <div className='grow shrink basis-72'>
        <RadioInput
          label='Transaction Type'
          name='purch_RedempTraxType'
          options={purch_redempTraxTypeOptions}
          selectedOption={purchRedempData.purch_RedempTraxType}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='purch_redempMfAmcName'
          label='MF (AMC) Name'
          options={mfAmcOptions}
          selectedOption={purchRedempData.purch_redempMfAmcName}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <InputList
          id='purch_redempSchemeName'
          label='Scheme Name for Purchase / Redemption'
          listName='purch_redemp-scheme-names'
          required={true}
          value={purchRedempData.purch_redempSchemeName}
          onChange={onChange}
          listOptions={schemeNameOptions}
        />
      </div>
      <div className='grow shrink basis-72'>
        <RadioInput
          label='Scheme Option'
          name='purch_redempSchemeOption'
          options={schemeOptionOptions}
          selectedOption={purchRedempData.purch_redempSchemeOption}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='purch_redempFolio'
          label='Folio'
          options={folioOptions}
          selectedOption={purchRedempData.purch_redempFolio}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='purch_redempTransactionUnits_Amount'
          label='Transaction Units / Amount'
          options={purch_redempTraxUnits_AmountOptions}
          selectedOption={purchRedempData.purch_redempTransactionUnits_Amount}
          onSelect={onSelect}
        />
      </div>
      <div className=' shrink basis-72'>
        <NumberInput
          id='purch_redempTransactionAmount'
          label='Transaction Amount'
          min={1}
          value={purchRedempData.purch_redempTransactionAmount}
          onChange={onChange}
        />
      </div>
      <div className="w-full">
      <div className='w-1/2'>
        <TextAreaInput
          id='purch_redempRemarksByEntryPerson'
          label='Remarks by Entry Person'
          rows={3}
          cols={5}
          minLength={3}
          maxLength={500}
          required={true}
          value={purchRedempData.purch_redempRemarksByEntryPerson}
          onChange={onChange}
        />
      </div>
      </div>
      <div className='absolute bottom-3 right-3'>
        <PrimaryButton text='Save' />
      </div>
    </fieldset>
  )
}

export default PurchRedempForm