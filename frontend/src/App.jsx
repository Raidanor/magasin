import { useEffect, useState } from 'react'

import { Routes, Route, Navigate } from "react-router-dom"

// Pages Import
import HomePage from './pages/HomePage.jsx'
import SignUpPage from './pages/SignUpPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import CartPage from './pages/CartPage.jsx'
import PurchaseSuccessPage from './pages/PurchaseSuccessPage.jsx'
import PurchaseCancelPage from './pages/PurchaseCancelPage.jsx'

import ProfilePage from "./pages/ProfilePage.jsx"

// Components import
import Navbar from "./components/Navbar.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"
import { Toaster } from 'react-hot-toast'
import { useUserStore } from './stores/useUserStore.js'
import { useCartStore } from './stores/useCartStore.js'
import Footer from './components/Footer.jsx'


function App() {
    const { user, checkAuth, checkingAuth } = useUserStore()
    const { getCartItems } = useCartStore()

    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    useEffect(() => {
        if (!user) return;
        getCartItems()
    }, [getCartItems, user])

    if (checkingAuth) return <LoadingSpinner />

    return (
        <div className='min-h-screen bg-gray-900 text-white overflow-hidden flex flex-col'>
            {/* backgroud gradient */}
            <div className='absolute inset-0 overflow-hidden'>
				<div className='absolute inset-0'>
					<div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.3)_0%,rgba(10,80,60,0.2)_45%,rgba(0,0,0,0.1)_100%)]' />
				</div>
			</div>

            
            <div className='z-50 pt-20 flex-grow'>
                <Navbar />
                <Routes>
                    <Route path= "/" element= {<HomePage />} />
                    <Route path= "/signup" element= {user ? <Navigate to="/" /> : <SignUpPage /> } />
                    <Route path= "/login" element={user ? <Navigate to="/" /> : <LoginPage /> }/>
                    <Route path= "/secret-dashboard" element={user?.role === "admin" ? <AdminPage /> : <Navigate to="/login" /> }/>
                    <Route path= "/category/:category" element={ <CategoryPage /> }/>
                    <Route path= "/product/:productId" element={ <ProductPage /> }/>
                    <Route path= "/cart" element={ user ? <CartPage /> : <Navigate to="/login" />}/>
                    <Route path= "/purchase-success/:orderId" element={ user ? <PurchaseSuccessPage /> : <Navigate to="/login" />}/>
                    <Route path= "/purchase-cancel" element={ user ? <PurchaseCancelPage /> : <Navigate to="/login" />}/>
                    <Route path= "/profile" element={ user ? <ProfilePage /> : <Navigate to="/login" />}/>
                </Routes>
            </div>
            <Footer />
            <Toaster />
        </div>
    )
  }
  
export default App
