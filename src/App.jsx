import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import  {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css'
import { LoginPage } from './Pages/LoginPage/LoginPage'
import { AuthProvider } from "./Context/authContext";
import { ReservedProvider } from "./Context/reservesContext";
import { DashboardPage } from './Pages/DashboardPage/DashboardPage'
import { ProfilePage } from './Pages/ProfilePage/ProfilePage'
import { LandigPage } from './Pages/LandingPage/LandigPage'
import { WelcomePage } from './Pages/WelcomePage/WelcomePage'
import { RegisterPage } from './Pages/RegisterPage/RegisterPage'
import { ForgotPassword } from './Pages/ForgotPassword/ForgotPassword'
import  ProtectedRoute  from "./ProtectedRoute";
import { MyReservsPage } from './Pages/MyReservsPage/MyReservsPage'
import ResetPassword from './Pages/ResetPassword/ResetPassword'

function App() {

  return (
    <AuthProvider>
      <ReservedProvider>
       <BrowserRouter>
         <Routes>
          <Route path='/' element={<LandigPage/>} />
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path='/register' element={<RegisterPage/>} />
           <Route path='/dashboard' element={<DashboardPage/>} />
            <Route element={<ProtectedRoute />}>
                <Route path='/profile' element={<ProfilePage/>} />
                <Route path='/welcome' element={<WelcomePage/>} />
                <Route path='/myreserves' element={<MyReservsPage/>} />
       
             </Route>
          </Routes>
         </BrowserRouter>
      </ReservedProvider>
    </AuthProvider>
  )
}

export default App