import React,{ useState } from 'react'
import LandingPage from './Pages/LandingPage';
import Dashboard from './Pages/Dashboard';
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import AuthPage from './Pages/AuthPage';
function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/authPage' element={<AuthPage/>}/>
    </Routes>
      
    </BrowserRouter>
  )
}
export default App;