import { useState } from 'react'
import './App.css'
import PrimaryButton from './components/common/PrimaryButton';
import Tabs from './components/common/Tabs';
import Header from './components/Header';
import SystematicForm from './components/SystematicForm';
import PurchRedempForm from './components/PurchRedempForm';
import SwitchForm from './components/SwitchForm';
import useQuery from './hooks/useQuery';
import Alert from './components/common/Alert';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetSystematicData } from './Reducers/SystematicDataSlice';
import { resetPurchRedempData } from './Reducers/PurchRedempDataSlice';
import { resetSwitchData } from './Reducers/SwitchDataSlice';
import { resetCommonData } from './Reducers/CommonDataSlice';
import Modal from './components/common/Modal';
import { IoMdCheckmarkCircle } from 'react-icons/io';

function App() {
  const [alert, setAlert] = useState({
    isOn: false,
    type: 'error',
    header: 'Systematic Form error',
    message: 'Missing field in systematic form'
  })

  const [completeTransactionData, setCompleteTransactionData] = useState({});
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);
  // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(true);

  // get all data states from store 
  const commonData = useSelector(state => state.commonData.value);
  const systematicData = useSelector(state => state.systematicData.value);
  const purchRedempData = useSelector(state => state.purchRedempData.value);
  const switchData = useSelector(state => state.switchData.value);
  
  const dispatch = useDispatch();

  const commonFormSubmitBtn = useRef(null);

  const currentForm = useQuery().get('tab') || 'systematic';

  // Tabs for form types 
  const tabs = [
    { id: 'systematic', name: 'Systematic' },
    { id: 'pur-red', name: 'Purchase/Redemption' },
    { id: 'switch', name: 'Switch' },
  ]

  // method to update alert 
  const updateAlert = (alert) => {
    setAlert(alert)
  }

  // method to validate and save systematic form data 
  const saveSystematicform = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // first remove systematicData from complete data 
    setCompleteTransactionData(
      prevData => ({ ...prevData, systematicData: [] })
    )

    // default alert state 
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Validation Error in Systematic Form',
      message: ''
    }

    for (const sysItem of systematicData) {
      if (!sysItem.systematicMfAmcName) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>MF (AMC) Name</strong></span>
        updateAlert(alert);
        return;
      }
      else if (!sysItem.sip_stp_swpDate) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>{sysItem.systematicTraxType.slice(-3)} Date</strong></span>
        updateAlert(alert);
        return;
      }
      else if (!sysItem.sipPauseMonths) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>SIP Pause Months</strong></span>
        updateAlert(alert);
        return;
      }
      else if (!sysItem.systematicPaymentMode) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>First Installment Payment Mode</strong></span>
        updateAlert(alert);
        return;
      }
    }

    setCompleteTransactionData(
      prevData => ({ ...prevData, systematicData })
    )
    alert.header = '';
    alert.type = 'success';
    alert.message = 'saved'
    updateAlert(alert)
  }

  // method to validate and save purchase/redemption form data 
  const savePurchRedempform = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // first remove systematicData from complete data 
    setCompleteTransactionData(
      prevData => ({ ...prevData, purchRedempData: [] })
    )

    // default alert state 
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Validation Error in Purchase/Redemption Form',
      message: ''
    }

    for (const purchRedempItem of purchRedempData) {
      if (!purchRedempItem.purch_redempMfAmcName) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>MF (AMC) Name</strong></span>
        updateAlert(alert);
        return;
      }
      else if (!purchRedempItem.purch_redempPaymentMode) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>Payment Mode</strong></span>
        updateAlert(alert);
        return;
      }
    }

    setCompleteTransactionData(
      prevData => ({ ...prevData, purchRedempData })
    )
    alert.header = '';
    alert.type = 'success';
    alert.message = 'saved'
    updateAlert(alert)
  }

  // method to validate and save Switch form data 
  const saveSwitchform = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // first remove systematicData from complete data
    setCompleteTransactionData(
      prevData => ({ ...prevData, switchData: [] })
    )

    // default alert state
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Validation Error in Switch Form',
      message: ''
    }

    for (const switchItem of switchData) {
      if (!switchItem.switchMfAmcName) {
        alert.message = <span>Select one of the option in <strong className='text-xs'>MF (AMC) Name</strong></span>
        updateAlert(alert);
        return;
      }
    }

    setCompleteTransactionData(
      prevData => ({ ...prevData, switchData })
    )
    alert.header = '';
    alert.type = 'success';
    alert.message = 'saved'
    updateAlert(alert)
  }

  // method to submit form 
  const submitForm = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // set loading state to true 
    setIsLoadingSubmission(true)

    setCompleteTransactionData(
      prevData => ({ ...prevData, commonData })
    )

    let alert = {
      isOn: true,
      type: 'error',
      header: 'Submission Error',
      message: ''
    }

    // show error alert if no form data has been saved 
    const propertiesToCheck = ['systematicData', 'purchRedempData', 'switchData'];
    const hasAnyProperty = propertiesToCheck.some(prop => completeTransactionData.hasOwnProperty(prop));
    if (!hasAnyProperty) {
      alert.message = <span>Please save each of the form before submission</span>;
      updateAlert(alert)
      return;
    }

    // api call to submit form data 
    const formData = { commonData, ...completeTransactionData }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData })
    };
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/data`, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        alert.message = data?.message ? <span>{data.message}</span> : <span>Server error! Try again later</span>;
        updateAlert(alert)
        return;
      }

      console.log('submitted')
      updateAlert({
        isOn: true,
        type: 'success',
        header: 'Form submitted',
        message: ''
      })

      // clear the form 
      setCompleteTransactionData({});
      dispatch(resetCommonData());
      dispatch(resetSystematicData());
      dispatch(resetPurchRedempData());
      dispatch(resetSwitchData());
    } catch (error) {
      console.log(error);
      alert.message = <span>Server error! Try again later</span>;
      updateAlert(alert)
    }
    finally {
      setIsLoadingSubmission(false)
    }
  }

  // method to trigger submit button of common data form 
  const triggerSubmitBtn = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    commonFormSubmitBtn.current.click();
  }

  return (
    <div >
      <Alert alertState={alert} updateAlert={updateAlert} />
      <div className='flex flex-col gap-y-8'>
        <Header handleSubmit={submitForm} submitBtn={commonFormSubmitBtn} />

        <Tabs tabs={tabs} />
        {
          currentForm === 'systematic' ?
            <SystematicForm
              handleSubmit={saveSystematicform}
            /> :
            currentForm === 'pur-red' ?
              <PurchRedempForm
                handleSubmit={savePurchRedempform}
              /> :
              <SwitchForm
                handleSubmit={saveSwitchform}
              />
        }

        {/* <Modal
          isOpen={isConfirmModalOpen}
          onClose={() => setIsConfirmModalOpen(false)}
          title='Saved Forms'
          body={
            <div className='flex flex-col gap-2'>
              <div className='flex justify-between border rounded-md p-2 gap-16'>
                <p className='text-lg'>SYSTEMATIC</p>
                <span className={`text-3xl ${completeTransactionData.systematicData ? 'text-green-700' : 'text-slate-300'}`}><IoMdCheckmarkCircle /></span>
              </div>
              <div className='flex justify-between border rounded-md p-2 gap-16'>
                <p className='text-lg'>PURCHASE / REDEMPTION</p>
                <span className={`text-3xl ${completeTransactionData.purchRedempData ? 'text-green-700' : 'text-slate-300'}`}><IoMdCheckmarkCircle /></span>
              </div>
              <div className='flex justify-between border rounded-md p-2 gap-16'>
                <p className='text-lg'>SWITCH</p>
                <span className={`text-3xl ${completeTransactionData.switchData ? 'text-green-700' : 'text-slate-300'}`}><IoMdCheckmarkCircle /></span>
              </div>
            </div>}
          primaryAction={() => console.log('submit true')}
          primaryBtnText='Proceed'
        /> */}

        <div className="flex gap-4">
          <PrimaryButton
            action={triggerSubmitBtn}
            disable={isLoadingSubmission ? true : false}
            text={isLoadingSubmission ? 'Submitting...' : 'Submit'}
            width={'320px'}
          />

        </div>
      </div>
    </div>
  )
}

export default App
