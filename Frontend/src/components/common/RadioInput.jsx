import React, { useState } from 'react'

function RadioInput({ options, selectedOption, label, name, onChange }) {
  // const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (e) => {
    // let value = e.target.value;
    // setSelectedOption(value)
    onChange(e)
  }

  return (
    <div className='flex flex-col text-nowrap'>
      <label className='text-gray-750 text-sm text-left'>{label}</label>
      <div className='flex gap-2 mt-3'>{
        options.map(option => (
          <div key={option} className='relative'>
            <label
              htmlFor={option}
              className={`relative rounded-md px-4 ps-7 py-2 bg-transparent ring-inset ${selectedOption === option ? 'ring-light-blue ring-2 bg-light-blue/10 text-light-blue' : 'ring-light-gray ring-1'}`}
            >{option}</label>

            <input
              type="radio"
              checked={selectedOption === option}
              name={name}
              id={option}
              required
              value={option}
              onChange={handleChange}
              className='absolute top-1/2 left-0 -translate-y-1/2 mx-2 accent-light-blue'
            />
          </div>

        ))
      }
      </div>
    </div>
  )
}

export default RadioInput