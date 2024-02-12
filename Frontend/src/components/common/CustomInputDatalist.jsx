import React, { useEffect, useRef, useState } from 'react'

function CustomInputDatalist({
  id,
  value,
  listName,
  listOptions,
  label,
  placeHolder,
  required,
  disable,
}) {
  const [inputValue, setInputValue] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState(listOptions)
  const container = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  useEffect(() => {
    setInputValue(value); // Update state when the `value` prop changes
  }, [value]);

  useEffect(() => {
    // Filter options based on input value
    const filter = inputValue.toLowerCase();
    const filtered = listOptions.filter(option =>
      option.value.toLowerCase().includes(filter)
    );
    setFilteredOptions(filtered);
  }, [inputValue, listOptions]);

  // Effect to listen click outside of the Dropdown 
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  const handleChange = (event) => {
    const {name, value} = event.target;
    setInputValue(value)
  }

  const handleBlur = (event) => {
    const {name, value} = event.target;
  }

  return (
    <div className='flex flex-col gap-1' ref={container}>
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
        placeholder={placeHolder}
        value={inputValue}
        onChange={handleChange}
        onBlur={handleBlur}
      />

      <ul className="custom-dropdown">
        {filteredOptions.map((option, index) => (
          <li key={index} onClick={() => setInputValue(option.value)}>
            <span>{option.label}</span> <span>{option.label}</span>
          </li>
        ))}
      </ul>

    </div>
  )
}

export default CustomInputDatalist