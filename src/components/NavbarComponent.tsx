'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { Navbar } from "flowbite-react";

const NavbarComponent = (props: { admin: boolean }) => {

  const router = useRouter()

  return (
    <Navbar className='bg-[#737375] p-0'>

      <Navbar.Brand className='p-0 '>
        <img className="w-20 p-4" src="/WA-Logo.png" alt="William's Act Logo" />
      </Navbar.Brand>

      <Navbar.Toggle className='bg-white me-2 rounded-none' />

      <Navbar.Collapse className='p-0'>
        <Navbar.Link className='hover:cursor-pointer hover:bg-slate-500 border-none text-white flex items-center freakingFlowbite' onClick={() => router.push('/ManagementPage')}>
          <p className={`${!props.admin ? 'hidden' : 'block'} py-2 md:pt-2`}>
            User Management
          </p>
        </Navbar.Link>
        <Navbar.Link onClick={() => router.push('/StudentDirectoryPage')} className='hover:cursor-pointer hover:bg-slate-500 border-none text-white flex items-center freakingFlowbite'>
          <p className='py-2 md:pt-2'>
            Student Directory
          </p>
        </Navbar.Link>
        <Navbar.Link onClick={() => router.push('/AddFormPage')} className='hover:cursor-pointer hover:bg-slate-500 border-none text-white flex items-center freakingFlowbite'>
          <p className='py-2 md:pt-2'>
            Submit Student Form
          </p>
        </Navbar.Link>
        <Navbar.Link className="md:bg-[#DD8A3E] hover:brightness-90 text-white md:text-sm font-bold tracking-wide hoverBtn freakingFlowbite hover:cursor-pointer border-none"
          onClick={() => router.push('/')}>
          <p className='py-2 md:p-2'>
            Sign Out
          </p>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavbarComponent
