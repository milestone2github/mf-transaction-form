import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PrimaryButton from './components/common/PrimaryButton';
import Tabs from './components/common/Tabs';
import Header from './components/Header';
import SystematicForm from './components/SystematicForm';
import PurchRedempForm from './components/PurchRedempForm';
import SwitchForm from './components/SwitchForm';
import useQuery from './hooks/useQuery';
import Alert from './components/common/Alert';
import { hollowPurchRedempObj, hollowSwitchObj, hollowSystematicObj } from './utils/initialDataObject';
import { useRef } from 'react';
const baseUrl = 'http://localhost:5000'

function App() {
  const [alert, setAlert] = useState({
    isOn: false,
    type: 'error',
    header: 'Systematic Form error',
    message: 'Missing xyz field in systematic form'
  })

  const [completeTransactionData, setCompleteTransactionData] = useState({});

  const [commonData, setCommonData] = useState({
    email: '',
    transactionPreference: 'ASAP',
    registrant: '',
    panNumber: '',
    investorFirstName: '',
    investorLastName: ''
  });

  const [systematicData, setSystematicData] = useState([hollowSystematicObj])
  const [purchRedempData, setPurchRedempData] = useState([hollowPurchRedempObj]);
  const [switchData, setSwitchData] = useState([hollowSwitchObj]);

  const [systematicCount, setSystematicCount] = useState(1)
  const [purchRedempCount, setPurchRedempCount] = useState(1)
  const [switchCount, setSwitchCount] = useState(1)
  const commonFormSubmitBtn = useRef(null);

  // const [currentForm, setCurrentForm] = useState('systematic')
  const currentForm = useQuery().get('tab') || 'systematic';

  // Tabs for form types 
  const tabs = [
    { id: 'systematic', name: 'Systematic' },
    { id: 'pur-red', name: 'Purchase/Redemption' },
    { id: 'switch', name: 'Switch' },
  ]

  // method to handle change in systematic data
  const handleCommonDataChange = (e) => {
    const { name, value } = e.target;

    setCommonData(prevData => {
      return { ...prevData, [name]: value };
    });
  };

  // method to handle change in systematic data
  const handleSystematicChange = (e) => {
    const { name, value, dataset } = e.target;
    const index = parseInt(dataset.index, 10); // Get the index from the dataset in integer
    let nameWithoutIdx = name.split("-", 1)[0];

    setSystematicData(prevData => {
      // Create a new array with updated values
      return prevData.map((item, idx) => {
        if (idx === index) {
          return { ...item, [nameWithoutIdx]: value }; // Update the specific field
        }
        return item;
      });
    });
  };

  // method to handle change in select menus of systematic
  const handleSystematicSelect = (name, value, index) => {
    console.log('From select -> name: ', name, ' value: ', value, ' index: ', index);

    setSystematicData(prevData => {
      return prevData.map((item, idx) => {
        if (idx.toString() === index.toString()) {
          return { ...item, [name]: value };
        }
        return item;
      });
    });
  }

  // method to add transaction in systematic
  const handleSystematicAdd = () => {
    setSystematicData(prevData => (
      [...prevData, hollowSystematicObj]
    ))

    // increase count 
    setSystematicCount(prevCount => prevCount + 1)
  }

  // method to remove transaction from systematic
  const handleSystematicRemove = (index) => {
    setSystematicData(prevData => {
      return prevData.filter((item, idx) => {
        if (idx !== index)
          return item
      })
    })

    // decrease count 
    setSystematicCount(prevCount => prevCount - 1)
  }

  // method to handle change in purchase/redemption data
  const handlePurchRedempChange = (e) => {
    const { name, value, dataset } = e.target;
    const index = parseInt(dataset.index, 10); // Get the index from the dataset in integer
    let nameWithoutIdx = name.split("-", 1)[0];

    setPurchRedempData(prevData => {
      // Create a new array with updated values
      return prevData.map((item, idx) => {
        if (idx === index) {
          return { ...item, [nameWithoutIdx]: value }; // Update the specific field
        }
        return item;
      });
    });
  };

  // method to handle change in select menus of purchase/redemption
  const handlePurchRedempSelect = (name, value, index) => {
    console.log('From select -> name: ', name, ' value: ', value, ' index: ', index);

    setPurchRedempData(prevData => {
      return prevData.map((item, idx) => {
        if (idx === index) {
          return { ...item, [name]: value };
        }
        return item;
      });
    });
  }

  // method to add transaction in purchase/redemption
  const handlePurchRedempAdd = () => {
    setPurchRedempData(prevData => (
      [...prevData, hollowPurchRedempObj]
    ))

    // increase count 
    setPurchRedempCount(prevCount => prevCount + 1)
  }

  // method to remove transaction from purchase/redemption
  const handlePurchRedempRemove = (index) => {
    setPurchRedempData(prevData => {
      return prevData.filter((item, idx) => {
        if (idx !== index)
          return item
      })
    })

    // decrease count 
    setPurchRedempCount(prevCount => prevCount - 1)
  }

  // method to handle change in switch data
  const handleSwitchChange = (e) => {
    const { name, value, dataset } = e.target;
    const index = parseInt(dataset.index, 10); // Get the index from the dataset in integer
    let nameWithoutIdx = name.split("-", 1)[0];

    setSwitchData(prevData => {
      // Create a new array with updated values
      return prevData.map((item, idx) => {
        if (idx === index) {
          return { ...item, [nameWithoutIdx]: value }; // Update the specific field
        }
        return item;
      });
    });
  };

  // method to handle change in select menus of switch
  const handleSwitchSelect = (name, value, index) => {
    console.log('From select -> name: ', name, ' value: ', value, ' index: ', index);

    setSwitchData(prevData => {
      return prevData.map((item, idx) => {
        if (idx === index) {
          return { ...item, [name]: value };
        }
        return item;
      });
    });
  }

  // method to add transaction in Switch
  const handleSwitchAdd = () => {
    setSwitchData(prevData => (
      [...prevData, hollowSwitchObj]
    ))

    // increase count 
    setSwitchCount(prevCount => prevCount + 1)
  }

  // method to remove transaction from switch
  const handleSwitchRemove = (index) => {
    setSwitchData(prevData => {
      return prevData.filter((item, idx) => {
        if (idx !== index)
          return item
      })
    })

    // decrease count 
    setSwitchCount(prevCount => prevCount - 1)
  }

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
        alert.message = <span>Select one of the option in <strong className='text-xs'>SIP / SWP / STP Date</strong></span>
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

  const submitForm = async (e) => {
    e.preventDefault();
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
    const formData = {commonData, ...completeTransactionData}
    console.log(formData)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formData })
    };
    try {
      const response = await fetch(`${baseUrl}/api/data`, requestOptions);
      const data = await response.json();

      if(!response.ok) {
        alert.message = <span>Server error! Try again later</span>;
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
    } catch (error) {
      console.log(error);
      alert.message = <span>Server error! Try again later</span>;
      updateAlert(alert)
    } 
  }

  // method to trigger submit button of common data form 
  const triggerSubmitBtn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    commonFormSubmitBtn.current.click();
  }

  return (
    <div >
      <Alert alertState={alert} updateAlert={updateAlert} />
      <div action="" onSubmit={submitForm} className='flex flex-col gap-y-8'>
        <Header commonData={commonData} onChange={handleCommonDataChange} handleSubmit={submitForm} submitBtn={commonFormSubmitBtn} />

        <Tabs tabs={tabs} />
        {
          currentForm === 'systematic' ?
            <SystematicForm
              systematicData={systematicData}
              handleChange={handleSystematicChange}
              handleSelect={handleSystematicSelect}
              handleSubmit={saveSystematicform}
              count={systematicCount}
              handleAdd={handleSystematicAdd}
              handleRemove={handleSystematicRemove}
            /> :
            currentForm === 'pur-red' ?
              <PurchRedempForm
                purchRedempData={purchRedempData}
                handleChange={handlePurchRedempChange}
                handleSelect={handlePurchRedempSelect}
                handleSubmit={savePurchRedempform}
                count={purchRedempCount}
                handleAdd={handlePurchRedempAdd}
                handleRemove={handlePurchRedempRemove}
              /> :
              <SwitchForm
                switchData={switchData}
                handleChange={handleSwitchChange}
                handleSelect={handleSwitchSelect}
                handleSubmit={saveSwitchform}
                count={switchCount}
                handleAdd={handleSwitchAdd}
                handleRemove={handleSwitchRemove}
              />
        }
        <PrimaryButton action={triggerSubmitBtn} text={'Submit'} width={'320px'} />
      </div>
    </div>
  )
}

export default App
