'use client'
import FooterComponent from '@/components/FooterComponent/page'
import NavbarComponent from '@/components/NavbarComponent'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


interface IStudentData {
  id: number,
  firstname: string,
  lastname: string,
  address: string,
  phonenumber: string,
  email: string,
  dob: string,
  isAdmin: boolean,
  isDeleted: boolean
}

interface IUpdateStudent {
  id: number,
  isDeleted: boolean
  email: boolean,
  isAdmin: boolean

}

const page = () => {
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [search, setSearch] = useState<string>("");
  const [toggleABC, setToggleABC] = useState(true);
  const [chooseSearch, setChooseSearch] = useState("firstname");
  const [seedData, setSeedData] = useState<IStudentData[] | any>();

  const FetchAllUsers = async () => {
    const res = await fetch("https://williamform.azurewebsites.net/Form/GetAllForms");
    const data = await res.json();
    return data;
  }

  const softDeleteUser = async (profileData: IStudentData | any) => {
    console.log("bye")
    const res = await fetch("https://williamform.azurewebsites.net/Form/UpdateForm", {
      method: "PUT",
      headers: {
        'Content-Type': "application/json"
      },
      body: JSON.stringify(profileData)
    });

    if (!res.ok) {
      const message = "An error has Occurred " + res.status;
      throw new Error(message);
    }

    const data = await res.json();
    return data;
  }


  const SortByAlpha = (selectedField: string) => {
    if (seedData && toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        if (a[selectedField] < b[selectedField]) { return -1; }
        if (a[selectedField] > b[selectedField]) { return 1; }
        return 0;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    } else if (seedData && !toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        if (a[selectedField] > b[selectedField]) { return -1; }
        if (a[selectedField] < b[selectedField]) { return 1; }
        return 0;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    }
  }

  const SortByDate = () => {
    if (seedData && toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        const dateA = new Date(a.dob).getTime();
        const dateB = new Date(b.dob).getTime();
        return dateA - dateB;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    } else if (seedData && !toggleABC) {
      const sorted = [...seedData].sort((a, b) => {
        const dateA = new Date(a.dob).getTime();
        const dateB = new Date(b.dob).getTime();
        return dateB - dateA;
      });
      setSeedData(sorted);
      setToggleABC(!toggleABC);
    }
  };

  useEffect(() => {
    const loadAll = async () => {
      setSeedData(await FetchAllUsers())
    }
    loadAll();
  }, [])



  return (
    <div>
      <NavbarComponent admin={true} />



      <div className='flex flex-col items-center  mb-14 '>

        <div className=' mr-auto '>
          <input onChange={(e) => { setSearch(e.target.value) }} type="text" className='border' />
          <select onChange={(e) => { setChooseSearch(e.target.value) }}>
            <option value="firstname">firstname</option>
            <option value="lastname">lastname</option>
            <option value="dob">dob</option>
            <option value="email">email</option>
            <option value="phonenumber">phonenumber</option>
            <option value="address">address</option>
          </select>
        </div>

        <table className=' border border-black'>
          <thead className='text-white text-2xl bg-[#23527C] gap-2  '>
            <tr>
              <th className=' py-2 text-start font-normal w-48' onClick={() => { SortByAlpha("firstname") }}>First Name</th>
              <th className=' text-start  font-normal w-48' onClick={() => { SortByAlpha("firstname") }}>Last Name</th>
              <th className=' text-start  font-normal w-48' onClick={() => { SortByDate() }}>Date of Birth</th>
              <th className=' text-start  font-normal w-48' >Address</th>
              <th className=' text-start  font-normal w-80' onClick={() => { SortByAlpha("email") }}>Email</th>
              <th className=' text-start  font-normal w-48'>Phone Number</th>
              <th className=' font-normal w-20'></th>
            </tr>
          </thead>


          <tbody className="">

            {
              seedData && seedData.map((student: IStudentData | any, idx: number) => {

                if (student && student[chooseSearch].toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                  return <tr key={idx} className={`h-[45px] `}>

                    <td className=' px-2 w-48'> {student.firstname ? student.firstname : "N/A"} </td>
                    <td className=' px-2 w-48'>{student.lastname ? student.lastname : "N/A"}  </td>
                    <td className=' px-2 w-48'>  {student?.dob ? student?.dob : "N/A"} </td>
                    <td className=' px-2 w-48'>{student?.address ? student?.address : "N/A"} </td>
                    <td className='   px-2 w-80'>{student?.email ? student?.email : "N/A"} </td>
                    <td className=' px-2 w-48'>{student?.phonenumber ? student?.phonenumber : "N/A"} </td>
                    <td className='flex flex-row items-center p-2 gap-2'>
                      <Image
                        onClick={async () => {
                          console.log("hello")
                          await softDeleteUser(
                            {
                              id: student.id,
                              firstname: student.firstname,
                              lastname: student.lastname,
                              address: student.address,
                              phonenumber: student.phonenumber,
                              dob: student.dob,
                              email: student.email,
                              isDeleted: true
                            }

                          )

                        }}
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
                } else {
                  return null
                }

              })
            }
          </tbody>
        </table>
      </div>


      <FooterComponent />

    </div>
  )
}

export default page
