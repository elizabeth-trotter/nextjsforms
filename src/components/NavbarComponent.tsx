'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

const NavbarComponent = (props: { admin: boolean }) => {

    const router = useRouter()

    return (
        <nav className='bg-[#737375] flex justify-between'>
            <img className="w-20 p-4" src="/WA-Logo.png" alt="William's Act Logo" />

            <div className='flex justify-end items-center gap-4 text-white'>
                <p className={`${!props.admin ? 'hidden' : 'block'} hover:cursor-pointer font-bold`} onClick={() => router.push('/ManagementPage')}>
                    User Managment
                </p>
                <p onClick={() => router.push('/StudentDirectoryPage')} className='hover:cursor-pointer'>
                    Student Directory
                </p>
                <p onClick={() => router.push('/AddFormPage')} className='hover:cursor-pointer'>
                    Submit Form
                </p>

                <button type="submit"
                    className="bg-[#DD8A3E] hover:brightness-90 p-2 my-5 me-4  text-white text-sm font-bold tracking-wide "
                    onClick={() => router.push('/')}>
                    Sign Out
                </button>

            </div>
        </nav>
    )
}

export default NavbarComponent
