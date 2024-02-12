import React, { useEffect, useState } from 'react'
import RadioInput from './common/RadioInput'
import InputList from './common/InputList'
import TextInput from './common/TextInput'
import PreFilledSelect from './common/PreFilledSelect'
import NumberInput from './common/NumberInput'
// import { folioOptions, mfAmcOptions, schemeNameOptions, schemeOptionOptions, sipPauseMonthsOptions, sip_stp_swpDateOptions, transactionTypeOptions } from '../utils/optionLists'
import PrimaryButton from './common/PrimaryButton'
import AddButton from './common/AddButton'
import Badge from './common/Badge'
import CloseButton from './common/CloseButton'
import {useDispatch, useSelector} from 'react-redux'
import {handleChange, handleSelect, handleAdd, handleRemove} from '../Reducers/SystematicDataSlice'
import { fetchAmcNameOptions, fetchFolioOptions, fetchSchemeNameOptions } from '../Actions/OptionListsAction'

function SystematicForm({ handleSubmit }) {
  // get systematicData state from store
  const systematicData = useSelector(state => state.systematicData.value);

  // get optionList state from store
  const {
    sysTransactionForOptions, 
    sysTransactionForOptionsWithPause,
    amcNameOptions, 
    schemeNameOptions,
    schemeOptionOptions,
    sipPauseMonthsOptions,
    sip_stp_swpDateOptions,
    transactionTypeOptions,
    folioOptions,
    folioOptionsWithNew
  } = useSelector(state => state.optionLists);

  // use useDispatch hook to use reducers 
  const dispatch = useDispatch();

  // // effect to fetch amc name options 
  // useEffect(() => {
  //   dispatch(fetchAmcNameOptions())
  //   dispatch(fetchSchemeNameOptions())
  //   dispatch(fetchFolioOptions())
  // }, []);
  
  // method to handle change in inputs 
  const handleInputChange = (event) => {
    const { name, value, dataset: { index } } = event.target;
    dispatch(handleChange({ name, value, index })); // dispatch the change 
  };

  // method to handle change in select menus
  const handleSelectChange = (name, value, index) => {
    dispatch(handleSelect({ name, value, index })); // dispatch the change 
  };

  // method to add new form instance 
  const addFormInstance = () => {
    dispatch(handleAdd());
  }

  // method to delete existing form instance at specified index 
  const removeFormInstance = (index) => {
    dispatch(handleRemove(index));
  }

  return (
    <form onSubmit={handleSubmit} className='relative -mt-[33px] px-3 py-4 flex flex-col gap-y-8 border border-gray-400 '>
      <div className='basis-full flex justify-between'>
        <Badge text={'Transactions'} count={systematicData.length} />
        <AddButton title={'Add transaction'} action={addFormInstance} />
      </div> {
        systematicData.map((systematicItem, idx) => (
          <fieldset key={idx} className='flex flex-wrap -mt-4 gap-x-16 gap-y-4'>
            {idx > 0 && <hr className='w-full' />}

            {idx > 0 && <div className='grow shrink basis-full text-right -my-2'>
              <CloseButton title={'Delete this transaction'} action={() => removeFormInstance(idx)} />
            </div>}

            <div className='grow shrink basis-72'>
              <PreFilledSelect
                id='systematicTraxType'
                index={idx}
                label='Transaction Type'
                options={transactionTypeOptions}
                selectedOption={systematicItem.systematicTraxType}
                onSelect={handleSelectChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <RadioInput
                index={idx}
                label='Transaction For' 
                name={`systematicTraxFor-${idx}`}
                options={
                  systematicItem.systematicTraxType === 'SIP' ? 
                  sysTransactionForOptionsWithPause : 
                  sysTransactionForOptions
                }
                selectedOption={systematicItem.systematicTraxFor}
                onChange={handleInputChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <InputList
                id='systematicMfAmcName'
                index={idx}
                label='MF (AMC) Name'
                listName='amc-names'
                required={true}
                value={systematicItem.systematicMfAmcName}
                listOptions={amcNameOptions}
                onChange={handleInputChange}
              />
            </div>
            {['SIP', 'STP', 'Capital Appreciation STP'].includes(systematicItem.systematicTraxType) && 
            <div className='grow shrink basis-72'>
              <InputList
                id='systematicSchemeName'
                index={idx}
                label='Scheme Name (Target Scheme)'
                listName='systematic-scheme-names'
                required={true}
                value={systematicItem.systematicSchemeName}
                onChange={handleInputChange}
                listOptions={schemeNameOptions}
              />
            </div>}
            {systematicItem.systematicTraxType !== 'SIP' &&
            <div className='grow shrink basis-72'>
              <InputList
                id='systematicSourceScheme'
                index={idx}
                label='Source Scheme'
                listName='systematic-source-schemes'
                required={true}
                value={systematicItem.systematicSourceScheme}
                onChange={handleInputChange}
                listOptions={schemeNameOptions}
              />
            </div>}
            <div className='grow shrink basis-72'>
              <RadioInput
                index={idx}
                label='Scheme Option'
                name={`systematicSchemeOption-${idx}`}
                options={schemeOptionOptions}
                selectedOption={systematicItem.systematicSchemeOption}
                onChange={handleInputChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <InputList
                id='systematicFolio'
                index={idx}
                label='Folio'
                listOptions={
                  systematicItem.systematicTraxFor === 'Registration' ?
                  folioOptionsWithNew :
                  folioOptions
                }
                listName='folios'
                required={true}
                value={systematicItem.systematicFolio}
                onChange={handleInputChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <NumberInput
                id='sip_swp_stpAmount'
                index={idx}
                label={`${
                  systematicItem.systematicTraxType === 'SIP' ?
                  'SIP' : 
                  ['SWP', 'Capital Appreciation SWP'].includes(systematicItem.systematicTraxType) ? 
                  'SWP': 'STP'
                } Amount`}
                min={1}
                required={true}
                value={systematicItem.sip_swp_stpAmount}
                onChange={handleInputChange}
              />
            </div>
            <div className='grow shrink basis-72'>
              <NumberInput
                id='tenureOfSip_swp_stp'
                index={idx}
                label={`Tenure of ${
                  systematicItem.systematicTraxType === 'SIP' ?
                  'SIP' : 
                  ['SWP', 'Capital Appreciation SWP'].includes(systematicItem.systematicTraxType) ? 
                  'SWP': 'STP'
                }`}
                min={1}
                value={systematicItem.tenureOfSip_swp_stp}
                onChange={handleInputChange}
              />
            </div>
            {systematicItem.systematicTraxFor === 'Pause' && 
            systematicItem.systematicTraxType === 'SIP' &&
            <div className='grow shrink basis-72 max-w-[calc(29.8%)]'>
              <PreFilledSelect
                id='sipPauseMonths'
                index={idx}
                label='SIP Pause Months'
                options={sipPauseMonthsOptions}
                selectedOption={systematicItem.sipPauseMonths}
                onSelect={handleSelectChange}
              />
            </div>}
            <div className='grow shrink basis-72 max-w-[calc(29.8%)]'>
              <PreFilledSelect
                id='sip_stp_swpDate'
                index={idx} 
                label={`${
                  systematicItem.systematicTraxType === 'SIP' ?
                  'SIP' : 
                  ['SWP', 'Capital Appreciation SWP'].includes(systematicItem.systematicTraxType) ? 
                  'SWP': 'STP'
                } Date`}
                options={sip_stp_swpDateOptions}
                selectedOption={systematicItem.sip_stp_swpDate}
                onSelect={handleSelectChange}
              />
            </div>
            <div className='grow shrink basis-72 max-w-[calc(29.8%)]'>
              <NumberInput
                id='firstTransactionAmount'
                index={idx}
                label='First Transaction Amount'
                min={1}
                required={true}
                value={systematicItem.firstTransactionAmount}
                onChange={handleInputChange}
              />
            </div>
            {/* <div className='shrink w-1/2'>
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
                onChange={handleInputChange}
              />
            </div> */}
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