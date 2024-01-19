import React from 'react'
import { IoMdClose } from "react-icons/io";

function Alert({alertState, updateAlert}) {
  const {isOn, type, header, message} = alertState;

  const colorStyle = {
    header: type === 'error' ? 'text-red-400' : type === 'success' ? 'text-green-600' : 'text-light-blue',
    border: type === 'error' ? 'border-red-400' : type === 'success' ? 'border-green-500' : 'border-blue-400',
  }

  const dismissAlert = () => {
    updateAlert({
      isOn: false,
      type: '',
      header: '',
      message: ''
    })
  }

  if(isOn && type === 'success') {setTimeout(dismissAlert, 3000);}

  if(isOn)
  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 bg-light-bg/10 backdrop-blur-lg rounded border border-s-8 ${colorStyle.border} text-left px-3 py-1 z-50 w-72 md:w-9/12`}>
      <strong className={`text-base ${colorStyle.header}`}>{header}</strong>
      <p className='text-base text-gray-750'>{message}</p>
      <button 
        className='text-gray-750 hover:text-gray-950 px-1 py-1 absolute right-1 top-1'
        onClick={dismissAlert}
      >
        <IoMdClose />
      </button>
    </div>
  )
}

export default Alert