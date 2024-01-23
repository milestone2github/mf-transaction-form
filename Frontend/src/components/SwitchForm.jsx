import React, { useState } from 'react'
import { folioOptions, mfAmcOptions, schemeNameOptions, schemeOptionOptions, switchTraxUnits_AmountOptions } from '../utils/optionLists';
import RadioInput from './common/RadioInput';
import InputList from './common/InputList';
import PreFilledSelect from './common/PreFilledSelect';
import NumberInput from './common/NumberInput';
import TextAreaInput from './common/TextAreaInput';
import PrimaryButton from './common/PrimaryButton';
import Badge from './common/Badge';
import AddButton from './common/AddButton';
import CloseButton from './common/CloseButton';

function SwitchForm({ switchData, handleChange, handleSelect, count, handleAdd, handleRemove }) {

  return (
    <div className='relative -mt-[33px] px-3 py-4 flex flex-col gap-y-8 border border-gray-400 '>
      <div className='basis-full flex justify-between'>
        <Badge text={'Transactions'} count={count} />
        <AddButton title={'Add transaction'} action={handleAdd} />
      </div>
      {switchData.map((switchItem, idx) => (
        <fieldset key={idx} className='flex flex-wrap -mt-4 gap-x-16 gap-y-4'>
          {/* <legend>Switch</legend> */}
          {idx > 0 && <hr className='w-full' />}

          {idx > 0 && <div className='grow shrink basis-full text-right -my-2'>
            <CloseButton title={'Delete this transaction'} action={() => handleRemove(idx)} />
          </div>}

          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='switchMfAmcName'
              index={idx} 
              label='MF (AMC) Name'
              options={mfAmcOptions}
              selectedOption={switchItem.switchMfAmcName}
              onSelect={handleSelect}
            />
          </div>
          <div className='grow shrink basis-72'>
            <InputList
              id='switchFromScheme'
              index={idx} 
              label='From Scheme'
              listName='switch-from-schemes'
              required={true}
              value={switchItem.switchFromScheme}
              onChange={handleChange}
              listOptions={schemeNameOptions}
            />
          </div>
          <div className='grow shrink basis-72'>
            <InputList
              id='switchToScheme'
              index={idx} 
              label='To Scheme'
              listName='switch-to-schemes'
              required={true}
              value={switchItem.switchToScheme}
              onChange={handleChange}
              listOptions={schemeNameOptions}
            />
          </div>
          <div className='grow shrink basis-72'>
            <RadioInput
              index={idx} 
              label='Scheme Option'
              name='switchSchemeOption'
              options={schemeOptionOptions}
              selectedOption={switchItem.switchSchemeOption}
              onChange={handleChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='switchFolio'
              index={idx} 
              label='Folio'
              options={folioOptions}
              selectedOption={switchItem.switchFolio}
              onSelect={handleSelect}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='switchTransactionUnits_Amount'
              index={idx} 
              label='Transaction Units / Amount'
              options={switchTraxUnits_AmountOptions}
              selectedOption={switchItem.switchTransactionUnits_Amount}
              onSelect={handleSelect}
            />
          </div>
          <div className=' shrink basis-72'>
            <NumberInput
              id='switchTransactionAmount'
              index={idx} 
              label='Transaction Amount'
              min={1}
              value={switchItem.switchTransactionAmount}
              onChange={handleChange}
            />
          </div>
          <div className="w-full">
            <div className='w-1/2'>
              <TextAreaInput
                id='switchRemarksByEntryPerson'
                index={idx} 
                label='Remarks by Entry Person'
                rows={3}
                cols={5}
                minLength={3}
                maxLength={500}
                required={true}
                value={switchItem.switchRemarksByEntryPerson}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className='absolute bottom-3 right-3'>
            <PrimaryButton text='Save' />
          </div>
        </fieldset>
      ))}
    </div>
  )
}

export default SwitchForm