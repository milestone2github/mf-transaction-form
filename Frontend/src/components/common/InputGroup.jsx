import React from 'react'

function InputGroup(props) {
  const { id, label, value, onChange, placeHolder, type, length, required, secondItem } = props;

  return (
    <div className='flex flex-col gap-1'>
      <label
        htmlFor={id}
        className='text-gray-750 text-sm'
      >{label}
      </label>

      <div className="flex relative overflow-hidden">
        <div className='px-2 py-1 text-black-900 border-e border-light-gray absolute left-1 top-1/2 -translate-y-1/2'>{secondItem}</div>
        <input
          type={type}
          className='bg-transparent text-black-900 rounded-md border-2 w-full border-gray-300 py-2 px-2 ps-14 outline-none focus-within:border-light-blue disabled:border-gray-200'
          name={id}
          id={id}
          title={placeHolder}
          required={required}
          minLength={length}
          maxLength={length}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
        />
      </div>
    </div>
  )
}

export default InputGroup