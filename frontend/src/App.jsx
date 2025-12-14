import React,{ useState } from 'react'
import LandingPage from './Pages/LandingPage'
import Dashboard from './Pages/Dashboard'
import RoomPage from './Pages/RoomPage'
import LoginPage from './Pages/LoginPage'
import RegisterPage from './Pages/RegisterPage'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <RegisterPage/>
    </>
  )
}

export default App
