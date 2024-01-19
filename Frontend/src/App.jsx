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

function App() {
  const [alert, setAlert] = useState({
    isOn: false,
    type: 'error',
    header: 'Systematic Form error',
    message: 'Missing xyz field in systematic form'
  })

  const [commonData, setCommonData] = useState({
    email: '',
    transactionPreference: 'ASAP',
    registrant: '',
    panNumber: '',
    investorFirstName: '',
    investorLastName: ''
  });

  const [systematicData, setSystematicData] = useState({
    systematicTraxFor: '',
    systematicTraxType: 'SIP',
    systematicSchemeName: '',
    systematicMfAmcName: '',
    systematicSourceScheme: '',
    systematicSchemeOption: '',
    systematicFolio: 'Create New Folio',
    sip_swp_stpAmount: 1,
    tenureOfSip_swp_stp: 9999,
    sipPauseMonths: '2 Months',
    sip_stp_swpDate: '',
    firstTransactionAmount: 1,
    systematicRemarksByEntryPerson: '',
  })

  const [purchRedempData, setPurchRedempData] = useState({
    purch_RedempTraxType: '',
    purch_redempMfAmcName: '',
    purch_redempSchemeName: '',
    purch_redempSchemeOption: '',
    purch_redempFolio: 'Create New Folio',
    purch_redempTransactionUnits_Amount: 'Amount Given in next question',
    purch_redempTransactionAmount: 1,
    purch_redempRemarksByEntryPerson: '',
  })

  const [switchData, setSwitchData] = useState({
    switchMfAmcName: '',
    switchFromScheme: '',
    switchToScheme: '',
    switchSchemeOption: '',
    switchFolio: 'Create New Folio',
    switchTransactionUnits_Amount: 'Amount Given in next question',
    switchTransactionAmount: 1,
    switchRemarksByEntryPerson: '',
  })

  // const [currentForm, setCurrentForm] = useState('systematic')
  const currentForm = useQuery().get('tab') || 'systematic';

  // Tabs for form types 
  const tabs = [
    {id: 'systematic', name: 'Systematic'},
    {id: 'pur-red', name: 'Purchase/Redemption'},
    {id: 'switch', name: 'Switch'},
  ]

  const changeCommonData = (e) => {
    const {name, value} = e.target;
    console.log('name: ', name, " value: ", value)
    setCommonData(prevData => ({...prevData, [name]: value}))
  }

  const changeSystematicData = (e) => {
    const {name, value} = e.target;
    console.log('name: ', name, " value: ", value)
    setSystematicData(prevData => ({...prevData, [name]: value}))
  }

  const changePurchRedempData = (e) => {
    const {name, value} = e.target;
    console.log('name: ', name, " value: ", value)
    setPurchRedempData(prevData => ({...prevData, [name]: value}))
  }

  const changeSwitchData = (e) => {
    const {name, value} = e.target;
    console.log('name: ', name, " value: ", value)
    setSwitchData(prevData => ({...prevData, [name]: value}))
  }

  const handleSystematicSelect = (name, value) => {
    console.log('from select -> name: ', name, " value: ", value) //test
    setSystematicData(prevData => ({...prevData, [name]: value}))
  }

  const handlePurchRedempSelect = (name, value) => {
    console.log('from select -> name: ', name, " value: ", value) //test
    setPurchRedempData(prevData => ({...prevData, [name]: value}))
  }

  const handleSwitchSelect = (name, value) => {
    console.log('from select -> name: ', name, " value: ", value) //test
    setSwitchData(prevData => ({...prevData, [name]: value}))
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
        <Header commonData={commonData} onChange={changeCommonData}/>

        <Tabs tabs={tabs} />
        {
          currentForm === 'systematic' ? 
            <SystematicForm systematicData={systematicData} onChange={changeSystematicData} onSelect={handleSystematicSelect}/> :
            currentForm === 'pur-red' ?
            <PurchRedempForm purchRedempData={purchRedempData} onChange={changePurchRedempData} onSelect={handlePurchRedempSelect}/> :
            <SwitchForm switchData={switchData} onChange={changeSwitchData} onSelect={handleSwitchSelect}/>
        }
        <PrimaryButton text={'Submit'} width={'320px'}/>
      </form>
    </main>
  )
}

export default App
