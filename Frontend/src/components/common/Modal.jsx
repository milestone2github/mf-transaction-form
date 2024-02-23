import React from 'react';
import { IoMdClose } from 'react-icons/io';

const Modal = ({ isOpen, children, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black/60 flex items-center justify-center z-50'>
      <div className='bg-primary-white p-4'>
        <button 
          title='Close'  
          onClick={onClose} 
          className='absolute top-4 right-4 text-xl text-gray-200 hover:text-primary-white'
        ><IoMdClose /></button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
