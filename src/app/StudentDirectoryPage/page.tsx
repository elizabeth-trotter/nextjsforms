'use client'
import FooterComponent from '@/components/FooterComponent/page'
import NavbarComponent from '@/components/NavbarComponent'
import Image from 'next/image'
import React, { useState } from 'react'



const page = () => {
  const [ modal, setModal] = useState(false)
  const [ editModal, setEditModal] = useState(false)
  return (
    <div>
      <NavbarComponent admin={true}/>
    <div className='flex flex-col items-center pt-14'>

      
      <table>
        <thead className='text-white text-2xl bg-[#23527C] gap-2 border border-black '>
          <tr>
            <th className='my-4 font-normal'>First Name</th>
            <td>Last Name</td>
            <td>Date of Birth</td>
            <td>Address</td>
            <td>Email</td>
            <td>Phone</td>
            <td className='my-4'></td>
          </tr>
        
        </thead>
        <tbody>
          <tr className=' border border-black'>
            <td className=' border-black px-2 w-48'>Marcos </td>
            <td className='border border-black px-2 w-48'> Rodriguez</td>
            <td className=' border border-black px-2 w-48'>9/11/2001</td>
            <td className=' border border-black px-2 w-48'>2922 Transworld Dr</td>
            <td className=' border border-black px-2 w-80'>marcos.e.rodriguez2003@gmail.com</td>
            <td className=' border border-black px-2 w-48'>(911) 911- 9111</td>
            <td className='flex flex-row items-center p-2 gap-2'>
            <Image
              src="/Trash.png"
              alt="Delete"
              width={30}
              height={30}
              className='cursor-pointer'
              />
              <Image
              src="/Edit.png"
              alt='"Edit'
              width={25}
              height={25}
              // onClick={}
              className='cursor-pointer'
              />
            </td>
          </tr>


          <tr className=' border border-black bg-gray-300'>

            <td className='px-2 '>Xavier</td>
            <td className=' border border-black px-2'>Hopkins</td>
            <td className=' border border-black px-2'>4/20/2003</td>
            <td className=' border border-black px-2'>2922 Transworld Dr</td>
            <td className=' border border-black px-2'>xavierhopkins2003@gmail.com</td>
            <td className=' border border-black px-2'>(911) 911- 9111</td>
            <td className='flex flex-row items-center p-2 gap-2'>
            <Image
              src="/Trash.png"
              alt="Delete"
              width={30}
              height={30}
              className='cursor-pointer'
              />
              <Image
              src="/Edit.png"
              alt='"Edit'
              width={25}
              height={25}
              // onClick={}
              className='cursor-pointer'
              />
            </td>
          </tr>
          
        </tbody>
      </table>


      
    </div>
    <FooterComponent/>
    </div>
  )
}

export default page
