import React from 'react'
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';

function Tabs({tabs}) {
  const query = useQuery();
  const navigate = useNavigate();

  const currentTab = query.get('tab') || 'systematic';

  const handleTabChange = (tab) => {
    navigate(`/?tab=${tab}`);
  };

  return (
    <ul className="flex">{
      tabs.map((tab) => (
        <li className="" key={tab.id}>
          <button type='button' onClick={() => handleTabChange(tab.id)} className={`px-3 py-1 border border-b-[1px] ${currentTab === tab.id ? 'border-gray-400 border-b-transparent text-light-blue' : 'border-transparent border-b-gray-400 text-gray-400'}`} >{tab.name}</button>
        </li>

      ))
    }</ul>
  )
}

export default Tabs 