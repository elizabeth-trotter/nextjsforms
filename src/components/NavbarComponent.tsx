'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import Link from "next/link";
import { Navbar } from "flowbite-react";

const NavbarComponent = (props: { admin: boolean }) => {

  const router = useRouter()

  return (
    // <nav className='bg-[#737375] flex justify-between'>
    //     <img className="w-20 p-4" src="/WA-Logo.png" alt="William's Act Logo" />

    //     <div className='flex justify-end items-center gap-4 text-white'>
    //         <p className={`${!props.admin ? 'hidden' : 'block'} hover:cursor-pointer font-bold`} onClick={() => router.push('/ManagementPage')}>
    //             User Managment
    //         </p>
    //         <p onClick={() => router.push('/StudentDirectoryPage')} className='hover:cursor-pointer'>
    //             Student Directory
    //         </p>
    //         <p onClick={() => router.push('/UpdateProfilePage')} className='hover:cursor-pointer'>
    //             Submit Form
    //         </p>

    //         <button type="submit"
    //             className="bg-[#DD8A3E] hover:brightness-90 p-2 my-5 me-4  text-white text-sm font-bold tracking-wide "
    //             onClick={() => router.push('/')}>
    //             Sign Out
    //         </button>

    //     </div>
    // </nav>
    <Navbar className='bg-[#737375] p-0'>

      <Navbar.Brand className='p-0 lg:-ms-20 -ms-0'>
        <img className="w-20 p-4" src="/WA-Logo.png" alt="William's Act Logo" />
      </Navbar.Brand>

      <Navbar.Toggle className='bg-white me-2' />

      <Navbar.Collapse className='xl:-me-16 -me-3 p-0'>
        <Navbar.Link className={`${!props.admin ? 'hidden' : 'block'} hover:cursor-pointer font-bold text-white flex items-center freakingFlowbite`} onClick={() => router.push('/ManagementPage')}>
          <p className='pt-2'>
            User Management
          </p>
        </Navbar.Link>
        <Navbar.Link onClick={() => router.push('/StudentDirectoryPage')} className='hover:cursor-pointer text-white flex items-center freakingFlowbite'>
          <p className='pt-2'>
            Student Directory
          </p>
        </Navbar.Link>
        <Navbar.Link onClick={() => router.push('/UpdateProfilePage')} className='hover:cursor-pointer text-white flex items-center freakingFlowbite'>
          <p className='pt-2'>
            Submit Form
          </p>
        </Navbar.Link>
        <Navbar.Link className="bg-[#DD8A3E] hover:brightness-90  text-white text-sm font-bold tracking-wide hoverBtn freakingFlowbite hover:cursor-pointer"
          onClick={() => router.push('/')}>
          <p className='p-2'>
            Sign Out
          </p>
        </Navbar.Link>
        {/* <button type="submit"
          className="bg-[#DD8A3E] hover:brightness-90 p-2 my-5 me-4  text-white text-sm font-bold tracking-wide "
          onClick={() => router.push('/')}>
          Sign Out
        </button> */}
      </Navbar.Collapse>
    </Navbar>
  )
}

export default NavbarComponent
