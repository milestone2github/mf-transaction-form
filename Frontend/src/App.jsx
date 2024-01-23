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

  // const [currentForm, setCurrentForm] = useState('systematic')
  const currentForm = useQuery().get('tab') || 'systematic';

  // Tabs for form types 
  const tabs = [
    {id: 'systematic', name: 'Systematic'},
    {id: 'pur-red', name: 'Purchase/Redemption'},
    {id: 'switch', name: 'Switch'},
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

  const submitForm = (e) => {
    e.preventDefault();
    console.log('submitted')
  }

  return (
    <main className=''>
      <Alert alertState={alert} updateAlert={updateAlert} />
      <form action="" onSubmit={submitForm} className='flex flex-col gap-y-8'>
        <Header commonData={commonData} onChange={handleCommonDataChange}/>

        <Tabs tabs={tabs} />
        {
          currentForm === 'systematic' ? 
            <SystematicForm 
              systematicData={systematicData} 
              handleChange={handleSystematicChange} 
              handleSelect={handleSystematicSelect}
              count={systematicCount}
              handleAdd={handleSystematicAdd}
              handleRemove={handleSystematicRemove}
            /> :
            currentForm === 'pur-red' ?
            <PurchRedempForm 
              purchRedempData={purchRedempData} 
              handleChange={handlePurchRedempChange} 
              handleSelect={handlePurchRedempSelect}
              count={purchRedempCount}
              handleAdd={handlePurchRedempAdd}
              handleRemove={handlePurchRedempRemove}
            /> :
            <SwitchForm 
              switchData={switchData} 
              handleChange={handleSwitchChange} 
              handleSelect={handleSwitchSelect}
              count={switchCount}
              handleAdd={handleSwitchAdd}
              handleRemove={handleSwitchRemove}
            />
        }
        <PrimaryButton text={'Submit'} width={'320px'}/>
      </form>
    </main>
  )
}

export default App
