import React from 'react'
import Header from '../UI/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../UI/Footer'

const Applayout = () => {
  return (
    <>
    <div className='flex flex-col min-h-screen'>

    <Header/>
    <main className='flex-grow'>
      <Outlet/>
    </main>
    <Footer/>
    </div>
    </>
  )
}

export default Applayout