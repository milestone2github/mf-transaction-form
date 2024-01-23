import React from 'react'

function EmailInput(props) {
  const { id, label, value, onChange, index, placeHolder, type, length, required, secondItem } = props;

  return (
    <div className='flex flex-col gap-1'>
      <label
        htmlFor={`${id}-${index}`}
        className='text-gray-750 text-sm text-start'
      >{label}
      </label>

      <div className="flex relative overflow-hidden">
        <input
          type={type}
          className='bg-transparent text-black-900 rounded-md border-2 w-full border-gray-300 py-2 px-2 pe-40 outline-none focus-within:border-light-blue disabled:border-gray-200'
          name={id}
          id={`${id}-${index}`}
          data-index={index}
          title={placeHolder}
          required={required}
          minLength={length}
          maxLength={length}
          placeholder={placeHolder}
          value={value}
          onChange={onChange}
        />
        <div className='px-2 py-1 text-black-900 border-e border-light-gray absolute right-0 top-1/2 -translate-y-1/2'>{secondItem}</div>
      </div>
    </div>
  )
}

export default EmailInput