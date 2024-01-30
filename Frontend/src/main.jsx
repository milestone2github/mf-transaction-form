import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import store from './Redux/Store.js'
import LoginPage from './components/LoginPage.jsx'
import Protected from './components/common/Protected.jsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Protected ><App/></Protected>,
  },
  {
    path: "/login",
    element: <LoginPage/>,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store} >
    <RouterProvider router={router}>
    </RouterProvider>
    </Provider>
  </React.StrictMode>,
)
