import { useEffect, useState } from 'react'
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
import Modal from './components/common/Modal';
import { setLoading } from './Reducers/UserSlice';
// const baseUrl = 'http://localhost:5000'

function App() {
  const [alert, setAlert] = useState({
    isOn: false,
    type: 'error',
    header: 'Systematic Form error',
    message: 'Missing xyz field in systematic form'
  })

  const [completeTransactionData, setCompleteTransactionData] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');
  const [isLoadingPreview, setIsLoadingPreview] = useState(false)
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false)

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
  let action = '';
  const submitForm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // set loading state to true based on action 
    if(action === 'Preview') {setIsLoadingPreview(true)}
    else {setIsLoadingSubmission(true)}

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
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/data?method=${action}`, requestOptions);
      if (!response.ok) {
        alert.message = <span>Server error! Try again later</span>;
        updateAlert(alert)
        return;
      }

      // if clicked preview, show the pdf 
      if(action === 'Preview') {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setIsModalOpen(true);
      }
      
      // if clicked submit show the status 
      else {
        const data = await response.json();
        console.log('submitted')
        updateAlert({
          isOn: true,
          type: 'success',
          header: 'Form submitted',
          message: ''
        })
      }
    } catch (error) {
      console.log(error);
      alert.message = <span>Server error! Try again later</span>;
      updateAlert(alert)
    }
    finally {
      setIsLoadingPreview(false)
      setIsLoadingSubmission(false)
    }
  }

  // method to trigger submit button of common data form 
  const triggerSubmitBtn = (e) => {
    action = e.target.innerText;
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
        <div className="flex gap-4">
        <PrimaryButton 
          action={triggerSubmitBtn} 
          disable={isLoadingSubmission ? true : false}
          text={isLoadingSubmission ? 'Submitting...' : 'Submit'} 
          width={'320px'} 
        />

        <button 
          className={`border px-8 w-48 border-black-900 rounded-md flex items-center justify-center text-black-900 hover:bg-black-900 hover:text-primary-white disabled:text-black-900 disabled:bg-primary-white disabled:cursor-not-allowed`}
          onClick={triggerSubmitBtn}
          disabled={isLoadingPreview}
          >{isLoadingPreview ? 
            <><span className='w-6 h-6 inline-block animate-spin me-2 rounded-full border-4 border-[#07a7cf3c] border-t-light-blue'>

            </span>Processing...</> : 'Preview'
          }
        </button>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <iframe src={pdfUrl} style={{ width: '768px', height: 'calc(100vh - 32px)' }} title="PDF" />
      </Modal>
    </div>
  )
}

export default App
