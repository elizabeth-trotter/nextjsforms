import FooterComponent from '@/components/FooterComponent/page'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col'>
      <table>
        <thead>
            <th className=''> IMAGE</th>
            <td>Name</td>
            <td>Date of Birth</td>
            <td>Address</td>
            <td>Email</td>
            <td>Phone</td>
        </thead>
        <tbody>
          <tr>
            <th className=''></th>
            <td>Marcos Rodriguez</td>
            <td>9/11/2001</td>
            <td>2922 Transworld Dr, Stockton, CA 95206</td>
            <td>marcos.e.rodriguez2003@gmail.com</td>
            <td>911</td>
          </tr>
        </tbody>
      </table>
      <FooterComponent/>
    </div>
  )
}

export default page
