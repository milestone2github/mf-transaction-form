import React, { useState } from 'react'
import { folioOptions, mfAmcOptions, purch_redempTraxTypeOptions, purch_redempTraxUnits_AmountOptions, schemeNameOptions, schemeOptionOptions } from '../utils/optionLists';
import PreFilledSelect from './common/PreFilledSelect';
import InputList from './common/InputList';
import RadioInput from './common/RadioInput';
import NumberInput from './common/NumberInput';
import TextAreaInput from './common/TextAreaInput';
import PrimaryButton from './common/PrimaryButton';
import Badge from './common/Badge';
import AddButton from './common/AddButton';
import CloseButton from './common/CloseButton';
import { useDispatch, useSelector } from 'react-redux';
import { handleAdd, handleChange, handleRemove, handleSelect } from '../Reducers/PurchRedempDataSlice';

function PurchRedempForm({ handleSubmit }) {
  // get purchRedempData state from store
  const purchRedempData = useSelector(state => state.purchRedempData.value);

  // use useDispatch hook to use reducers
  const dispatch = useDispatch();

  // method to handle change in inputs 
  const handleInputChange = (event) => {
    const { name, value, dataset: { index } } = event.target;
    dispatch(handleChange({ name, value, index }));
  };

  // method to handle change in select menus
  const handleSelectChange = (name, value, index) => {
    dispatch(handleSelect({ name, value, index }));
  };

  // method to add new form instance 
  const addFormInstance = () => {
    dispatch(handleAdd());
  }

  // method to delete existing form instance at specied index 
  const removeFormInstance = (index) => {
    dispatch(handleRemove(index));
  }

  return (
    <form onSubmit={handleSubmit} className='relative -mt-[33px] px-3 py-4 flex flex-col gap-y-8 border border-gray-400 '>
      <div className='basis-full flex justify-between'>
        <Badge text={'Transactions'} count={purchRedempData.length} />
        <AddButton title={'Add transaction'} action={addFormInstance} />
      </div>
      {purchRedempData.map((purchRedempItem, idx) => (
        <fieldset key={idx} className='flex flex-wrap -mt-4 gap-x-16 gap-y-4'>
          {/* <legend>Purchase / Redemption</legend> */}
          {idx > 0 && <hr className='w-full' />}

          {idx > 0 && <div className='grow shrink basis-full text-right -my-2'>
            <CloseButton title={'Delete this transaction'} action={() => removeFormInstance(idx)} />
          </div>}

          <div className='grow shrink basis-72'>
            <RadioInput
              index={idx} 
              label='Transaction Type'
              name={`purch_RedempTraxType-${idx}`}
              options={purch_redempTraxTypeOptions}
              selectedOption={purchRedempItem.purch_RedempTraxType}
              onChange={handleInputChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='purch_redempMfAmcName'
              index={idx} 
              label='MF (AMC) Name'
              options={mfAmcOptions}
              selectedOption={purchRedempItem.purch_redempMfAmcName}
              onSelect={handleSelectChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <InputList
              id='purch_redempSchemeName'
              index={idx} 
              label='Scheme Name for Purchase / Redemption'
              listName='purch_redemp-scheme-names'
              required={true}
              value={purchRedempItem.purch_redempSchemeName}
              onChange={handleInputChange}
              listOptions={schemeNameOptions}
            />
          </div>
          <div className='grow shrink basis-72'>
            <RadioInput
              index={idx} 
              label='Scheme Option'
              name={`purch_redempSchemeOption-${idx}`}
              options={schemeOptionOptions}
              selectedOption={purchRedempItem.purch_redempSchemeOption}
              onChange={handleInputChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='purch_redempFolio'
              index={idx} 
              label='Folio'
              options={folioOptions}
              selectedOption={purchRedempItem.purch_redempFolio}
              onSelect={handleSelectChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='purch_redempTransactionUnits_Amount'
              index={idx} 
              label='Transaction Units / Amount'
              options={purch_redempTraxUnits_AmountOptions}
              selectedOption={purchRedempItem.purch_redempTransactionUnits_Amount}
              onSelect={handleSelectChange}
            />
          </div>
          <div className=' shrink basis-72'>
            <NumberInput
              id='purch_redempTransactionAmount'
              index={idx} 
              label='Transaction Amount'
              min={1}
              value={purchRedempItem.purch_redempTransactionAmount}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="w-full">
            <div className='w-1/2'>
              <TextAreaInput
                id='purch_redempRemarksByEntryPerson'
                index={idx} 
                label='Remarks by Entry Person'
                rows={3}
                cols={5}
                minLength={3}
                maxLength={500}
                required={true}
                value={purchRedempItem.purch_redempRemarksByEntryPerson}
                onChange={handleInputChange}
              />
            </div>
          </div> */}
          <div className='absolute bottom-3 right-3'>
            <PrimaryButton text='Save' />
          </div>
        </fieldset>
      ))}
    </form>
  )
}

export default PurchRedempForm