import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom';

function Protected({children}) {
  const isLoggedIn = useSelector(state => state.user.isLoggedIn);

  return (
    isLoggedIn ? children : <Navigate to={'/login'} replace/>
  )
}

export default Protected