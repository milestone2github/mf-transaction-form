import React, { useState } from 'react'
import RadioInput from './common/RadioInput'
import InputList from './common/InputList'
import TextInput from './common/TextInput'
import PreFilledSelect from './common/PreFilledSelect'
import NumberInput from './common/NumberInput'
import TextAreaInput from './common/TextAreaInput'
import { folioOptions, mfAmcOptions, schemeNameOptions, schemeOptionOptions, sipPauseMonthsOptions, sip_stp_swpDateOptions, transactionOptions, transactionTypeOptions } from '../utils/optionLists'
import PrimaryButton from './common/PrimaryButton'
import AddButton from './common/AddButton'
import Badge from './common/Badge'
import CloseButton from './common/CloseButton'


function SystematicForm({ systematicData, handleChange, handleSelect, handleSubmit, count, handleAdd, handleRemove }) {

  return (
    <form onSubmit={handleSubmit} className='relative -mt-[33px] px-3 py-4 flex flex-col gap-y-8 border border-gray-400 '>
      <div className='basis-full flex justify-between'>
        <Badge text={'Transactions'} count={count} />
        <AddButton title={'Add transaction'} action={handleAdd} />
      </div> {
        systematicData.map((systematicItem, idx) => (
          <fieldset key={idx} className='flex flex-wrap -mt-4 gap-x-16 gap-y-4'>
            {idx > 0 && <hr className='w-full' />}

            {idx > 0 && <div className='grow shrink basis-full text-right -my-2'>
              <CloseButton title={'Delete this transaction'} action={() => handleRemove(idx)} />
            </div>}

            <div className='grow shrink basis-72'>
              <RadioInput
                index={idx}
                label='Transaction For' 
                name={`systematicTraxFor-${idx}`}
                options={transactionOptions}
                selectedOption={systematicItem.systematicTraxFor}
                onChange={handleChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <PreFilledSelect
                id='systematicTraxType'
                index={idx}
                label='Transaction Type'
                options={transactionTypeOptions}
                selectedOption={systematicItem.systematicTraxType}
                onSelect={handleSelect}
              />
            </div>
            <div className='grow shrink basis-72'>
              <PreFilledSelect
                id='systematicMfAmcName'
                index={idx}
                label='MF (AMC) Name'
                options={mfAmcOptions}
                selectedOption={systematicItem.systematicMfAmcName}
                onSelect={handleSelect}
              />
            </div>
            <div className='grow shrink basis-72'>
              <InputList
                id='systematicSchemeName'
                index={idx}
                label='Scheme Name (Target Scheme)'
                listName='systematic-scheme-names'
                required={true}
                value={systematicItem.systematicSchemeName}
                onChange={handleChange}
                listOptions={schemeNameOptions}
              />
            </div>
            <div className='grow shrink basis-72'>
              <TextInput
                id='systematicSourceScheme'
                index={idx}
                label='Source Scheme (optional)'
                value={systematicItem.systematicSourceScheme}
                onChange={handleChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <RadioInput
                index={idx}
                label='Scheme Option'
                name={`systematicSchemeOption-${idx}`}
                options={schemeOptionOptions}
                selectedOption={systematicItem.systematicSchemeOption}
                onChange={handleChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <PreFilledSelect
                id='systematicFolio'
                index={idx}
                label='Folio'
                options={folioOptions}
                selectedOption={systematicItem.systematicFolio}
                onSelect={handleSelect}
              />
            </div>
            <div className='grow shrink basis-72'>
              <NumberInput
                id='sip_swp_stpAmount'
                index={idx}
                label='SIP / SWP / STP Amount'
                min={1}
                required={true}
                value={systematicItem.sip_swp_stpAmount}
                onChange={handleChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <NumberInput
                id='tenureOfSip_swp_stp'
                index={idx}
                label='Tenure of SIP / SWP / STP'
                min={1}
                value={systematicItem.tenureOfSip_swp_stp}
                onChange={handleChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <PreFilledSelect
                id='sipPauseMonths'
                index={idx}
                label='SIP Pause Months'
                options={sipPauseMonthsOptions}
                selectedOption={systematicItem.sipPauseMonths}
                onSelect={handleSelect}
              />
            </div>
            <div className='grow shrink basis-72'>
              <PreFilledSelect
                id='sip_stp_swpDate'
                index={idx} label='SIP / SWP / STP Date'
                options={sip_stp_swpDateOptions}
                selectedOption={systematicItem.sip_stp_swpDate}
                onSelect={handleSelect}
              />
            </div>
            <div className='grow shrink basis-72'>
              <NumberInput
                id='firstTransactionAmount'
                index={idx}
                label='First Transaction Amount'
                min={1}
                required={true}
                value={systematicItem.firstTransactionAmount}
                onChange={handleChange}
              />
            </div>
            <div className='shrink w-1/2'>
              <TextAreaInput
                id='systematicRemarksByEntryPerson'
                index={idx}
                label='Remarks by Entry Person'
                rows={3}
                cols={5}
                minLength={3}
                maxLength={500}
                required={true}
                value={systematicItem.systematicRemarksByEntryPerson}
                onChange={handleChange}
              />
            </div>
            <div className='absolute bottom-3 right-3'>
              <PrimaryButton text='Save' />
            </div>
          </fieldset>
        ))
      }

    </form>
  )
}

export default SystematicForm