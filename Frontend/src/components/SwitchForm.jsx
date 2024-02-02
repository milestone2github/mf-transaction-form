import React, { useState } from 'react'
import RadioInput from './common/RadioInput';
import InputList from './common/InputList';
import PreFilledSelect from './common/PreFilledSelect';
import NumberInput from './common/NumberInput';
import PrimaryButton from './common/PrimaryButton';
import Badge from './common/Badge';
import AddButton from './common/AddButton';
import CloseButton from './common/CloseButton';
import { useDispatch, useSelector } from 'react-redux';
import { handleAdd, handleChange, handleRemove, handleSelect } from '../Reducers/SwitchDataSlice';

function SwitchForm({ handleSubmit }) {
  // get switchData state from store 
  const switchData = useSelector(state => state.switchData.value);

  // get optionList state from store
  const {
    switchTraxUnits_AmountOptions,
    amcNameOptions, 
    schemeNameOptions,
    schemeOptionOptions,
    folioOptions
  } = useSelector(state => state.optionLists);

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
        <Badge text={'Transactions'} count={switchData.length} />
        <AddButton title={'Add transaction'} action={addFormInstance} />
      </div>
      {switchData.map((switchItem, idx) => (
        <fieldset key={idx} className='flex flex-wrap -mt-4 gap-x-16 gap-y-4'>
          {/* <legend>Switch</legend> */}
          {idx > 0 && <hr className='w-full' />}

          {idx > 0 && <div className='grow shrink basis-full text-right -my-2'>
            <CloseButton title={'Delete this transaction'} action={() => removeFormInstance(idx)} />
          </div>}

          <div className='grow shrink basis-72'>
            <InputList
              id='switchMfAmcName'
              index={idx} 
              label='MF (AMC) Name'
              required={true}
              listName='amc-names'
              listOptions={amcNameOptions}
              value={switchItem.switchMfAmcName}
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
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
              onChange={handleInputChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <InputList
              id='switchFolio'
              index={idx} 
              label='Folio'
              required={true}
              listName='folios'
              listOptions={folioOptions}
              value={switchItem.switchFolio}
              onChange={handleInputChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='switchTransactionUnits_Amount'
              index={idx} 
              label='Transaction Units / Amount'
              options={switchTraxUnits_AmountOptions}
              selectedOption={switchItem.switchTransactionUnits_Amount}
              onSelect={handleSelectChange}
            />
          </div>
          <div className=' shrink basis-72'>
            <NumberInput
              id='switchTransactionAmount'
              index={idx} 
              label='Transaction Amount'
              min={1}
              value={switchItem.switchTransactionAmount}
              onChange={handleInputChange}
            />
          </div>
          {/* <div className="w-full">
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

export default SwitchForm