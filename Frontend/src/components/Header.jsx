import React, { useCallback, useEffect } from 'react'
import EmailInput from './common/EmailInput'
import RadioInput from './common/RadioInput'
import TextInput from './common/TextInput'
import { useDispatch, useSelector } from 'react-redux'
import { handleChange } from '../Reducers/CommonDataSlice'
import { fetchFolioOptions, fetchInvestorData } from '../Actions/OptionListsAction'
import debounce from '../utils/debounce'
import CustomInputList from './common/CustomInputList'
import logo from '../assets/companyLogo.png';
import { setLoggedIn } from '../Reducers/UserSlice'
import { useNavigate } from 'react-router-dom'

function Header({ handleSubmit, submitBtn }) {
  // get systematicData state from store
  const commonData = useSelector(state => state.commonData.value);

  // get optionLists state from store 
  const {
    panOptions,
    investorNameOptions,
    transactionPrefOptions
  } = useSelector(state => state.optionLists);

  // use useDispatch hook to use reducers 
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Debounced dispatch function
  const debouncedFetchInvestorData = useCallback(
    debounce((nextValue, name) => {
      dispatch(fetchInvestorData({ [name]: nextValue }))
        .then((action) => {
          console.log("Dispatched fetchInvestorData:", action);
        })
        .catch((error) => {
          console.error("Error while fetching investor data:", error);
        });
    }, 280), // 300ms debounce time
    [dispatch]
  );

  const handleNameChange = (option) => {
    dispatch(handleChange({ name: 'investorName', value: option.name }))
    dispatch(handleChange({ name: 'panNumber', value: option.pan }))
    dispatch(handleChange({ name: 'familyHead', value: option.familyHead }))
  }

  // method to handle change in inputs 
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    console.log(event)
    dispatch(handleChange({ name, value }));
  }

  // Method to handle logout
const handleLogout = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
      method: 'POST',
      credentials: 'include', 
    });
    if (response.ok) {
      dispatch(setLoggedIn(false));
      navigate('/login', { replace: true });
    } else {
      console.error("Logout failed: Server responded with status", response.status);
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}


  // effect to fetch folio options on change of pan number 
  useEffect(() => {
    if (commonData.panNumber.length) {
      dispatch(fetchFolioOptions(commonData.panNumber))
        .then((action) => {
          console.log("Dispatched fetchFolioOptions:", action);
        })
        .catch((error) => {
          console.error("Error while fetching folios:", error);
        });
    }

  }, [commonData.panNumber])

  return (
    <div>
      <header className='flex gap-8 justify-between'>
        <img src={logo} alt="" width={'180px'} className='h-min' />
        <h1 className='text-3xl w-full text-primary-white py-1 bg-light-blue'>MF TRANSACTIONS</h1>
        <button
          type='button'
          // style={{ width: width }}
          className='bg-[#bf5d28] text-lg text-primary-white min-w-[120px] text-center rounded-md px-5 py-2 enabled:hover:bg-[#9b4b20] disabled:opacity-70'
          onClick={handleLogout}
        >Logout
        </button>
      </header>
      <form onSubmit={handleSubmit} className='flex flex-wrap gap-6 gap-y-8 mt-5'>
        {/* <legend></legend> */}
        {/* <div className='grow shrink w-80'>
          <EmailInput
            id='email'
            label='Email'
            required={true}
            value={commonData.email}
            onChange={handleInputChange}
            secondItem='@niveshonline.com'
          />
        </div> */}

        <div className='grow shrink basis-full'>
          <RadioInput
            label='Transaction Preference'
            name='transactionPreference'
            options={transactionPrefOptions}
            selectedOption={commonData.transactionPreference}
            onChange={handleInputChange}
          />
        </div>

        {/* <fieldset className='flex grow shrink gap-3 mt-3'> */}
        {/* <legend className='text-gray-800 text-sm text-left'>Investor Name</legend> */}
        <div className="w-80 grow shrink basis-72">
          <CustomInputList
            id='investorName'
            label='Investor name'
            listName='investor-names'
            required={true}
            value={commonData.investorName}
            fetchData={debouncedFetchInvestorData}
            updateSelectedOption={handleNameChange}
            listOptions={investorNameOptions}
            renderOption={(option) =>
              (<><span className='font-medium'>{option.name}</span> / <span className='text-gray-900'>{option.pan}</span> / <span>{option.familyHead}</span></>)
            }
          />
        </div>
        {/* </fieldset> */}

        <div className='grow shrink basis-72 w-80'>
          <CustomInputList
            id='panNumber'
            label='PAN Number'
            listName='pan-numbers'
            placeHolder='XXXXXXXXXX'
            required={true}
            value={commonData.panNumber}
            fetchData={debouncedFetchInvestorData}
            updateSelectedOption={handleNameChange}
            listOptions={investorNameOptions}
            renderOption={(option) =>
              (<><span className=''>{option.name}</span> / <span className='font-medium'>{option.pan}</span> / <span>{option.familyHead}</span></>)
            }
          />
        </div>
        <div className='grow shrink basis-72 w-80'>
          <TextInput
            id='familyHead'
            label='Family Head'
            required={true}
            disable={true}
            value={commonData.familyHead}
            onChange={handleInputChange}
          />
        </div>

        <button ref={submitBtn} type='submit' className='hidden'>Submit</button>
      </form>
    </div>
  )
}

export default Header