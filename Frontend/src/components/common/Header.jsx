import React from 'react'
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/companyLogo.png';

function Header() {

  const navigate = useNavigate();

  // Method to handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        dispatch(setLoggedIn(false));
        navigate('/login', { replace: true });
      } else {
        console.error("Logout failed: Server responded with status", response.status);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <header className='flex gap-8 justify-between'>
      <img src={logo} alt="" className='w-44 h-min hidden md:block' />
      <h1 className='text-3xl w-full text-primary-white py-1 bg-light-blue'>MF TRANSACTIONS</h1>
      <button
        type='button'
        title='Logout'
        className='bg-[#bf5d28] text-lg text-primary-white min-w-[120px] text-center rounded-md px-5 py-2 enabled:hover:bg-[#9b4b20] disabled:opacity-70 hidden md:inline-block'
        onClick={handleLogout}
      >Logout
      </button>
    </header>
  )
}

export default Header