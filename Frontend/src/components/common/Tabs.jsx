import React from 'react'
import { useNavigate } from 'react-router-dom';
import useQuery from '../../hooks/useQuery';

function Tabs({ tabs }) {
  const query = useQuery();
  const navigate = useNavigate();

  const currentTab = query.get('tab') || 'systematic';

  const handleTabChange = (tab) => {
    navigate(`/?tab=${tab}`);
  };

  return (
    <nav>
      <ul className="flex">{
        tabs.map((tab) => (
          <li className="" key={tab.id}>
            <button type='button' onClick={() => handleTabChange(tab.id)} className={`relative px-3 py-1 border border-b-2 z-[3] ${currentTab === tab.id ? 'border-gray-400 border-b-primary-white text-light-blue' : 'border-transparent text-gray-400'}`} >{tab.name}</button>
          </li>

        ))
      }</ul>
    </nav>
  )
}

export default Tabs 