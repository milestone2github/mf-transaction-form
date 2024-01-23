import React from 'react'

function RadioInput({ options, index, selectedOption, label, name, onChange }) {
  // const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (e) => {
    onChange(e)
  }  

  return (
    <div className='flex flex-col text-nowrap'>
      <label className='text-gray-750 text-sm text-left'>{label}</label>
      <div className='flex gap-2 mt-3'>{
        options.map(option => (
          <div key={option} className='relative'>
            <label
              htmlFor={`${option}-${index}`}
              className={`relative rounded-md px-4 ps- py-2 ring-inset  ${selectedOption === option ? 'ring-light-blue ring-2 bg-light-blue/10 text-light-blue' : 'bg-transparent ring-light-gray ring-1'} before:rounded-md before:absolute before:-inset-0 before:bg-primary-white before:-z-10`}
            >{option}</label>

            <input
              type="radio"
              checked={selectedOption === option}
              name={name}
              id={`${option}-${index}`}
              data-index={index}
              required
              value={option}
              onChange={handleChange}
              className='absolute top-1/2 left-0 -translate-y-1/2 mx-2 -z-20 accent-light-blue'
            />
          </div>

        ))
      }
      </div>
    </div>
  )
}

export default RadioInput