import React, { useEffect, useRef, useState } from 'react';
import { IoChevronDownOutline } from "react-icons/io5";

const CustomSelect = ({ label, id, options, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const container = useRef(null);

  const toggleDropdown = () => setIsOpen(!isOpen);

  // method to handle click on options 
  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(id, option.value); // Callback for parent component
    setIsOpen(false);
  };

  // method to handle click outside of the SelectMeu 
  const handleClickOutside = (e) => {
    if (!container?.current.contains(e.target)) {
      setIsOpen(false);
      setHighlightedIndex(options.indexOf(selectedOption))
    }
  };

  // Effect to listen click outside of the Dropdown 
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [])

  // method to handle menu using keys 
  const handleKeyDown = (event) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        console.log('key: ', event.key)
        setHighlightedIndex((prevIndex) =>
          prevIndex < options.length - 1 ? prevIndex + 1 : prevIndex
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        console.log('key: ', event.key)
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : 0
        );
        break;
      case 'Enter': console.log('key: ', event.key)
      case 'Space': console.log('key: ', event.key)
        // setSelectedOption(options[highlightedIndex]);
        onSelect(id, options[highlightedIndex].value);
        setIsOpen(false);
        break;
      case 'Escape':
        setIsOpen(false);
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  return (
    <div className='flex flex-col'>
      <label
        htmlFor={id}
        className='text-gray-750 text-sm text-left z-0'
      >{label}
      </label>
      <div 
        ref={container} 
        className={`relative mt-1 focus:outline-none border-2 rounded-md ${isOpen && 'border-light-blue'}`} 
        tabIndex={0} 
        onKeyDown={handleKeyDown}
        onBlur={handleClickOutside} 
        onFocus={() => toggleDropdown}
        >

        <div className={`flex items-center bg-transparent text-black-900 w-full border-gray-300 py-2 px-2 z-0 `} onClick={toggleDropdown}>
          <span>{selectedOption.name}</span>
          <span className='ms-auto'><IoChevronDownOutline /></span>

        </div>
        {isOpen && (
          <ul className="absolute top-full w-full backdrop-blur-sm bg-light-blue/5 rounded-md mt-1 py-1 list-none shadow-md z-10">
            {options.map((option, index) => (
              <li
                key={index}
                className={`py-1 px-2 cursor-pointer ${(option.value === selectedOption.value || index === highlightedIndex) ? 'bg-light-blue text-primary-white' :'bg-transparent hover:bg-light-gray'} `}
                onClick={() => handleOptionClick(option)}
                onMouseEnter={()=> setHighlightedIndex(index)}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CustomSelect;
