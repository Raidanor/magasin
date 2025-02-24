import { useEffect, useState } from 'react'

import { Routes, Route, Navigate } from "react-router-dom"

// Pages Import
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

// Components import
import Navbar from "./components/Navbar.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import { Toaster } from 'react-hot-toast'
import { useUserStore, checkAuth, checkingAuth } from './stores/useUserStores'


function App() {
    const user = useUserStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    if (checkingAuth) return <LoadingSpinner />

    return (
        <div className='min-h-screen bg-gray-900 text-white relative overflow-hidden'>
            {/* backgroud gradient */}
            <div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

            <div className='relative z-50 pt-20'>
                <Navbar />
                <Routes>
                    <Route path= "/" element= {<HomePage />} />
                    <Route path= "/signup" element= {user ? <Navigate to="/" /> : <SignUpPage /> } />
                    <Route path= "/login" element={user ? <Navigate to="/" /> : <LoginPage /> }/>
                </Routes>
            </div>
            <Toaster />
        </div>
    )
  }
  
export default App
