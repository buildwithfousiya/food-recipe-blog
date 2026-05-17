import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './navbar'
import Footer from './Footer'

export default function MainNavigation() {
  return (
    <>
    <Navbar />
    <Outlet />
    <Footer />
    </>
  )
}
