import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components1/navbar.jsx'

export default function Company() {
    return (
        <div className='bg-gradient-to-b from-gray-50 to-white min-h-screen'>
            <Navbar />
            <Outlet />
        </div>
    )
}
