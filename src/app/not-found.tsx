import Link from 'next/link'
import React from 'react'

const NotFound = () => {
    return (
        <div className='h-screen flex flex-col bg-black text-white justify-center items-center'>
            <h2 className='text-center text-3xl sm:text-5xl md:text-6xl mx-4'>Access Denied</h2>
            <Link className='underline' href="/AddFormPage">Click here to Return Home</Link>
            <p className='absolute top-0 right-0 text-[1px]'>Jayvon is the best</p>
        </div>
    )
}

export default NotFound
