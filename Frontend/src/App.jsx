import { useState } from 'react'
import './App.css'
import PrimaryButton from './components/common/PrimaryButton';
// import Tabs from './components/common/Tabs';
// import SystematicForm from './components/SystematicForm';
// import PurchRedempForm from './components/PurchRedempForm';
// import SwitchForm from './components/SwitchForm';
import useQuery from './hooks/useQuery';
import Alert from './components/common/Alert';
import { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resetSystematicData } from './Reducers/SystematicDataSlice';
import { resetPurchRedempData } from './Reducers/PurchRedempDataSlice';
import { resetSwitchData } from './Reducers/SwitchDataSlice';
import { resetCommonData } from './Reducers/CommonDataSlice';
// import Modal from './components/common/Modal';
// import { IoMdCheckmarkCircle } from 'react-icons/io';
import TabularTransaction from './components/TabularTransaction';
import FormHeader from './components/FormHeader';
import Header from './components/common/Header';
import { resetTransactions } from './Reducers/TransactionSlice';

function App() {
  const [alert, setAlert] = useState({
    isOn: false,
    type: 'error',
    header: 'Systematic Form error',
    message: 'Missing field in systematic form'
  })

  const [didReset, setDidReset] = useState(false);
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false);
  // const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(true);

  // get all data states from store 
  const transactions = useSelector(state => state.transactions);
  const commonData = useSelector(state => state.commonData.value);
  const systematicData = useSelector(state => state.systematicData.value);
  const purchRedempData = useSelector(state => state.purchRedempData.value);
  const switchData = useSelector(state => state.switchData.value);

  const dispatch = useDispatch();

  // method to update alert 
  const updateAlert = (alert) => {
    setAlert(alert)
  }

  // method to validate and save systematic form data 
  const validateSystematic = (data, number) => {
    // default alert state 
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Validation Error in Systematic Form ' + number,
      message: ''
    }

    if (!data.systematicMfAmcName) {
      alert.message = <span>Select one of the option in <strong className='text-xs'>MF (AMC) Name</strong></span>
      updateAlert(alert);
      return;
    }
    else if (!data.sip_stp_swpDate) {
      alert.message = <span>Select one of the option in <strong className='text-xs'>{sysItem.systematicTraxType.slice(-3)} Date</strong></span>
      updateAlert(alert);
      return false;
    }
    else if (!data.systematicFolio) {
      alert.message = <span>Select a <strong className='text-xs'>Folio</strong></span>
      updateAlert(alert);
      return false;
    }
    else if (data.systematicTraxFor === 'Pause' && !data.sipPauseMonths) {
      alert.message = <span>Select one of the option in <strong className='text-xs'>SIP Pause Months</strong></span>
      updateAlert(alert);
      return false;
    }
    else if (data.systematicTraxType === 'SIP' && data.systematicTraxFor === 'Registration' && !data.systematicPaymentMode) {
      alert.message = <span>Select one of the option in <strong className='text-xs'>First Installment Payment Mode</strong></span>
      updateAlert(alert);
      return false;
    }

    return true;
  }

  // method to validate and save purchase/redemption form data 
  const validatePurchRedemp = (data, number) => {

    // default alert state 
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Validation Error in Purchase/Redemption Form ' + number,
      message: ''
    }

    if (!data.purch_redempMfAmcName) {
      alert.message = <span><strong className='text-xs'>MF (AMC) Name</strong> is required</span>
      updateAlert(alert);
      return false;
    }
    else if (!data.purch_redempFolio) {
      alert.message = <span>Select a <strong className='text-xs'>Folio</strong></span>
      updateAlert(alert);
      return false;
    }
    else if (!data.purch_redempSchemeName) {
      alert.message = <span><strong className='text-xs'>Scheme Name</strong> is required</span>
      updateAlert(alert);
      return false;
    }
    else if (data.purch_RedempTraxType === 'Purchase' && !data.purch_redempPaymentMode) {
      alert.message = <span>Select one of the option in <strong className='text-xs'>Payment Mode</strong></span>
      updateAlert(alert);
      return false;
    }

    return true;
  }

  // method to validate and save Switch form data 
  const validateSwitch = (data, number) => {

    // default alert state
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Validation Error in Switch Form ' + number,
      message: ''
    }

    if (!data.switchMfAmcName) {
      alert.message = <span>Select one of the option in <strong className='text-xs'>MF (AMC) Name</strong></span>
      updateAlert(alert);
      return false;
    }
    else if (!data.switchFolio) {
      alert.message = <span>Select a <strong className='text-xs'>Folio</strong></span>
      updateAlert(alert);
      return false;
    }
    else if (!data.switchFromScheme) {
      alert.message = <span><strong className='text-xs'>From Scheme</strong> is required</span>
      updateAlert(alert);
      return false;
    }
    else if (!data.switchToScheme) {
      alert.message = <span><strong className='text-xs'>To Scheme</strong> is required</span>
      updateAlert(alert);
      return false;
    }

    return true;
  }

  // method to submit form 
  const submitForm = async (e) => {
    e.preventDefault();

    // set loading state to true 
    setIsLoadingSubmission(true)

    let allTransactions = { 
      commonData, 
      systematicData: [], 
      purchRedempData: [], 
      switchData: [] 
    };

    let validationErrorOccurred = false;
    
    let alert = {
      isOn: true,
      type: 'error',
      header: 'Submission Error',
      message: ''
    }

    transactions.forEach((type, index) => {
      // Skip remaining iterations if validation error occurred
      if (validationErrorOccurred) return;  

      switch (type) {
        case 'systematic':
          if (!validateSystematic(systematicData[index], index + 1)) {
            validationErrorOccurred = true;
            return;
          }
          allTransactions.systematicData.push(systematicData[index]);
          break;

        case 'purchRedemp':
          if (!validatePurchRedemp(purchRedempData[index], index + 1)) {
            validationErrorOccurred = true;
            return;
          }
          allTransactions.purchRedempData.push(purchRedempData[index]);
          break;

        case 'switch':
          if (!validateSwitch(switchData[index], index + 1)) {
            validationErrorOccurred = true;
            return;
          }
          allTransactions.switchData.push(switchData[index]);
          break;

        default:
          console.log('Unknown transaction type:', type);
          break;
      }
    });

    if (validationErrorOccurred) {
      setIsLoadingSubmission(false);
      return;
    }

    // show error alert if no form data has been filled or saved 
    if (!allTransactions.purchRedempData.length && !allTransactions.systematicData.length && !allTransactions.switchData.length) {
      alert.message = <span>Please complete any one transaction before submission</span>;
      updateAlert(alert)
      setIsLoadingSubmission(false);
      return;
    }

    // api call to submit form data 
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData: allTransactions })
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
      dispatch(resetTransactions());
      dispatch(resetCommonData());
      dispatch(resetSystematicData());
      dispatch(resetPurchRedempData());
      dispatch(resetSwitchData());
      setDidReset(true);
    } catch (error) {
      console.log(error);
      alert.message = <span>Server error! Try again later</span>;
      updateAlert(alert)
    }
    finally {
      setIsLoadingSubmission(false)
    }
  }

  return (
    <div className='p-1 md:px-8 md:py-4'>
      <Alert alertState={alert} updateAlert={updateAlert} />

      <Header />

      <form onSubmit={submitForm} className='flex flex-col gap-y-8'>
        <FormHeader />

        <div className="flex flex-col gap-16">{
          transactions.map((transaction, idx) => (<TabularTransaction key={idx} idx={idx} transaction={transaction} isAddVisible={transactions.length - 1 === idx} didReset={didReset} />))
        }
        </div>

        <div className="flex gap-4">
          <PrimaryButton
            // action={submitForm}
            disable={isLoadingSubmission ? true : false}
            text={isLoadingSubmission ? 'Submitting...' : 'Submit'}
            width={'320px'}
          />

        </div>
      </form>
    </div>
  )
}

export default App

// function test() {
//   let error = false;
//   let numbers = [1,2,3,4,5,6];
//   numbers.forEach(num => {
//     switch (num % 2) {
//       case 0:
//         console.log('divisible', num)
//         if(num == 2){
//           error = true;
//         }
//         break;
//       case 1:
//         console.log('NOT divisible', num)
//         break;
    
//       default:
//         break;
//     }
//     if(error) return;
//     console.log('outside switch..')
//   })
//   console.log('end of test...')
// }