import React, { useEffect, useState } from 'react'

function InputList({ 
  id, 
  value, 
  onChange, 
  listName, 
  listOptions, 
  label, 
  placeHolder, 
  minLength, 
  maxLength, 
  required, 
  disable, 
  pattern 
}) {

  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value); // Update state when the `value` prop changes
  }, [value]);

  const handleChange = (event) => {
    const newValue = event.target.value;
    setInputValue(newValue); // Always update the inputValue state
    if(listOptions.includes(newValue)) {
      onChange(event)
    }
  };

  const handleBlur = (event) => {
    const newValue = event.target.value;
    if (!listOptions.includes(newValue)) {
      setInputValue(''); // Clear the input or set it to the last valid value
      if (onChange) onChange({ target: { name: id, value: '' }}); // Call the original onChange if provided
    }
  };

  return (
    <div className='flex flex-col gap-1'>
      <label 
        htmlFor={id}
        className='text-gray-750 text-sm text-left'
        >{label}
      </label>

      <input  
        className='bg-transparent text-black-900 rounded-md border-2 w-full border-gray-300 py-2 px-2 outline-none focus-within:border-light-blue disabled:border-gray-200'
        name={id} 
        id={id} 
        list={listName}
        required={required}
        disabled={disable}
        maxLength={maxLength}
        minLength={minLength}
        placeholder={placeHolder}
        pattern={pattern}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <datalist id={listName} > {
        listOptions.map(option => (
          <option key={option} value={option}/>
        ))
      }
      </datalist>

    </div>
  )
}

export default InputList