import React, { useState } from 'react'
import { folioOptions, mfAmcOptions, schemeNameOptions, schemeOptionOptions, switchTraxUnits_AmountOptions } from '../utils/optionLists';
import RadioInput from './common/RadioInput';
import InputList from './common/InputList';
import PreFilledSelect from './common/PreFilledSelect';
import NumberInput from './common/NumberInput';
import TextAreaInput from './common/TextAreaInput';
import PrimaryButton from './common/PrimaryButton';

function SwitchForm({switchData, onChange, onSelect}) {
  
  return (
    <fieldset className='relative px-3 pb-3 flex flex-wrap gap-x-16 gap-y-3 border border-gray-400 border-t-0'>
      {/* <legend>Switch</legend> */}
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='switchMfAmcName'
          label='MF (AMC) Name'
          options={mfAmcOptions}
          selectedOption={switchData.switchMfAmcName}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <InputList
          id='switchFromScheme'
          label='From Scheme'
          listName='switch-from-schemes'
          required={true}
          value={switchData.switchFromScheme}
          onChange={onChange}
          listOptions={schemeNameOptions}
        />
      </div>
      <div className='grow shrink basis-72'>
        <InputList
          id='switchToScheme'
          label='To Scheme'
          listName='switch-to-schemes'
          required={true}
          value={switchData.switchToScheme}
          onChange={onChange}
          listOptions={schemeNameOptions}
        />
      </div>
      <div className='grow shrink basis-72'>
        <RadioInput
          label='Scheme Option'
          name='switchSchemeOption'
          options={schemeOptionOptions}
          selectedOption={switchData.switchSchemeOption}
          onChange={onChange}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='switchFolio'
          label='Folio'
          options={folioOptions}
          selectedOption={switchData.switchFolio}
          onSelect={onSelect}
        />
      </div>
      <div className='grow shrink basis-72'>
        <PreFilledSelect
          id='switchTransactionUnits_Amount'
          label='Transaction Units / Amount'
          options={switchTraxUnits_AmountOptions}
          selectedOption={switchData.switchTransactionUnits_Amount}
          onSelect={onSelect}
        />
      </div>
      <div className=' shrink basis-72'>
        <NumberInput
          id='switchTransactionAmount'
          label='Transaction Amount'
          min={1}
          value={switchData.switchTransactionAmount}
          onChange={onChange}
        />
      </div>
      <div className="w-full">
      <div className='w-1/2'>
        <TextAreaInput
          id='switchRemarksByEntryPerson'
          label='Remarks by Entry Person'
          rows={3}
          cols={5}
          minLength={3}
          maxLength={500}
          required={true}
          value={switchData.switchRemarksByEntryPerson}
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

export default SwitchForm