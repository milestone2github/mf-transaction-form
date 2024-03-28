import React, { useCallback, useEffect } from 'react'
import RadioInput from './common/RadioInput';
import PreFilledSelect from './common/PreFilledSelect';
import NumberInput from './common/NumberInput';
import { useDispatch, useSelector } from 'react-redux';
import { handleChange, handleSelect } from '../Reducers/SwitchDataSlice';
import CustomInputList from './common/CustomInputList';
import { fetchAmcNameOptions, fetchFolioOptions, fetchSchemeNameOptions } from '../Actions/OptionListsAction';
import debounce from '../utils/debounce';
import TextInput from './common/TextInput';
import FolioSelectMenu from './common/FolioSelectMenu';

function SwitchForm({ index }) {
  // get switchData state from store 
  const switchItem = useSelector(state => state.switchData.value[index]);
  const commonData = useSelector(state => state.commonData.value);

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

   // Debounced fetch amc names function
   const debouncedFetchAmcNames = useCallback(
    debounce((keywords) => {
      dispatch(fetchAmcNameOptions(keywords))
        .then((action) => {
          console.log("Dispatched fetch Amc names");
        })
        .catch((error) => {
          console.error("Error while fetching Amc names:", error);
        });
    }, 280), // 300ms debounce time
    [dispatch]
  );

   // Debounced fetch scheme names function
  const debouncedFetchSchemeNames = useCallback(
    debounce((amc, keywords) => {
      dispatch(fetchSchemeNameOptions({amc, keywords}))
        .then((action) => {
          console.log("Dispatched fetch scheme names");
        })
        .catch((error) => {
          console.error("Error while fetching Scheme names:", error);
        });
    }, 280), // 300ms debounce time
    [dispatch]
  );

  // method to handle change in select menus
  const handleInputListChange = (value, name, index) => {
    dispatch(handleSelect({ name, value, index })); // dispatch the change 
  };

  // method to handle change in inputs 
  const handleInputChange = (event) => {
    const { name, value, dataset: { index } } = event.target;
    dispatch(handleChange({ name, value, index }));
  };

  // method to handle change in select menus 
  const handleSelectChange = (name, value, index) => {
    dispatch(handleSelect({ name, value, index }));
  };

  // effect to fetch folio options on change of amc and pan number 
  useEffect(() => {
    if (commonData.panNumber.length) {
      dispatch(fetchFolioOptions({iWell: commonData.iWellCode, amcName: switchItem.switchMfAmcName}))
        .then((action) => {
          console.log("Dispatched fetchFolioOptions");
        })
        .catch((error) => {
          console.error("Error while fetching folios:", error);
        });
    }

  }, [switchItem.switchMfAmcName, commonData.iWellCode])

  return (
        <fieldset className='px-3 py-4 flex flex-wrap -mt-4 gap-x-16 gap-y-4'>
          
          <div className='grow shrink basis-72'>
            <CustomInputList
              id='switchMfAmcName'
              index={index} 
              label='MF (AMC) Name'
              required={true}
              listName='amc-names'
              value={switchItem.switchMfAmcName}
              fetchData={debouncedFetchAmcNames}
                updateSelectedOption={handleInputListChange}
                listOptions={amcNameOptions}
                renderOption={(option) => (
                  option
                )}
            />
          </div>
          <div className='grow shrink basis-72'>
            <CustomInputList
              id='switchFromScheme'
              index={index} 
              label='From Scheme'
              listName='switch-from-schemes'
              required={true}
              value={switchItem.switchFromScheme}
              fetchData={(value) => 
                debouncedFetchSchemeNames(switchItem.switchMfAmcName, value)
              }
              updateSelectedOption={handleInputListChange}
              listOptions={schemeNameOptions}
              renderOption={(option) => (
                option
              )}
            />
          </div>
          <div className='grow shrink basis-72'>
            <CustomInputList
              id='switchToScheme'
              index={index} 
              label='To Scheme'
              listName='switch-to-schemes'
              required={true}
              value={switchItem.switchToScheme}
              fetchData={(value) => 
                debouncedFetchSchemeNames(switchItem.switchMfAmcName, value)
              }
              updateSelectedOption={handleInputListChange}
              listOptions={schemeNameOptions}
              renderOption={(option) => (
                option
              )}
            />
          </div>
          <div className='grow shrink basis-72'>
            <RadioInput
              index={index} 
              label='Scheme Option'
              name='switchSchemeOption'
              options={schemeOptionOptions}
              selectedOption={switchItem.switchSchemeOption}
              onChange={handleInputChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <FolioSelectMenu
              id='switchFolio'
              index={index} 
              label='Folio'
              options={folioOptions}
              selectedOption={switchItem.switchFolio}
              onSelect={handleSelectChange}
            />
          </div>
          <div className='grow shrink basis-72'>
            <PreFilledSelect
              id='switchTransactionUnits_Amount'
              index={index} 
              label='Transaction Units / Amount'
              options={switchTraxUnits_AmountOptions}
              selectedOption={switchItem.switchTransactionUnits_Amount}
              onSelect={handleSelectChange}
            />
          </div>
          <div className=' shrink basis-72'>
            <NumberInput
              id='switchTransactionAmount'
              index={index} 
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
                index={index} 
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
          {/* <div className='absolute bottom-3 right-3'>
            <PrimaryButton text='Save' />
          </div> */}
        </fieldset>
  )
}

export default SwitchForm