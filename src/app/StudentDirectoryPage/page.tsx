'use client'
import FooterComponent from '@/components/FooterComponent/page'
import NavbarComponent from '@/components/NavbarComponent'
import { useAppContext } from '@/context/Context'
import { Button } from 'flowbite-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'


interface IStudentData {
  id: number,
  firstName: string,
  lastName: string,
  address: string,
  phoneNumber: string,
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



const StudentDirectoryPage = () => {
  const [modal, setModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [search, setSearch] = useState<string>("");
  const [toggleABC, setToggleABC] = useState(true);
  const [toggleLoad, setToggleLoad] = useState(true);
  const [chooseSearch, setChooseSearch] = useState("firstName");
  const [startCut, setStartCut] = useState(0);
  const [endCut, setEndCut] = useState(10);
  const [currentStudent, setCurrentStudent] = useState<IStudentData>();
  const [hideModel, setHideModel] = useState("hidden");
  const [hideEditModel, setEditHideModel] = useState("hidden");

  const [seedData, setSeedData] = useState<IStudentData[] | any>();

  const handleForward = () => {
    if (seedData.length > endCut) {
      setStartCut(startCut + 10);
      setEndCut(endCut + 10);
    }
  }
  const handleBack = () => {
    if (startCut > 0) {
      setStartCut(startCut - 10);
      setEndCut(endCut - 10);
    }


  }

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


  const removeStudentWithoutRefetching = (studentId: number | undefined) => {
    let copyArr: IStudentData[] = [...seedData]

    for (let i = copyArr.length - 1; i >= 0; i--) {

      if (copyArr[i].id === studentId) {
        copyArr.splice(i, 1)
        setSeedData(copyArr);
        break;
      }
    }
  }

  const replaceStudentWithoutRefetching = (studentId: number | undefined, studentObject: IStudentData | any) => {
    let copyArr: IStudentData[] = [...seedData]

    for (let i = copyArr.length - 1; i >= 0; i--) {

      if (copyArr[i].id === studentId) {
        copyArr.splice(i, 1, studentObject)
        setSeedData(copyArr);
        break;
      }
    }
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
      console.log(await FetchAllUsers())

    }
    loadAll();
  }, [])

  const [form, setForm] = useState<any>({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phoneNumber: "",
    dob: "",
    isDeleted: false,
  })

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    //passing through its current values, and updating
    setForm({ ...form, [e.target.name]: e.target.value })
    console.log(form)
  }

  const pageContext = useAppContext();

  return (
    <div>

      <div className={`flex justify-center items-center bg-[#00000089] h-screen w-screen fixed  ${hideEditModel}`} >
        <div className={`bg-sky-400   w-[800px] min-h-[400px] `}>

          <p> Update {currentStudent?.firstName}s information.</p>

          <div className="">
            <label className="block rounded p-3">
              First Name
            </label>
            <input value={form?.firstName} type="text" placeholder="First Name" name="firstName" className="border rounded p-3" onChange={updateForm} />
          </div>

          <div className="">
            <label className="block rounded p-3">
              Last Name
            </label>
            <input type="text" placeholder="Last Name" name="lastName" className="border rounded p-3" onChange={updateForm} value={form?.lastName} />
          </div>

          <div className="">
            <label className="block rounded p-3">
              Address
            </label>
            <input type="text" placeholder="Address" name="address" className="border rounded p-3" onChange={updateForm} value={form?.address} />
          </div>

          <div className="">
            <label className="block rounded p-3">
              Phone Number
            </label>
            <input type="text" placeholder="Phone Number" name="phoneNumber" className="border rounded p-3" onChange={updateForm} value={form?.phoneNumber} />
          </div>

          <div className="">
            <label className="block rounded p-3">
              Date of Birth
            </label>
            <input type="text" placeholder="Date of Birth" name="dob" className="border rounded p-3" onChange={updateForm} value={form?.dob} />
          </div>

          <div className="">
            <label className="block rounded p-3">
              Email
            </label>
            <input type="text" placeholder="Email" name="email" className="border rounded p-3" onChange={updateForm} value={form?.email} />
          </div>



          <button onClick={() => setEditHideModel("hidden")}>cancel</button>

          <button onClick={async () => {
            setEditHideModel("hidden")

            replaceStudentWithoutRefetching(currentStudent?.id,
              form
            )
            await softDeleteUser(
              {
                id: form?.id,
                firstName: form?.firstName,
                lastName: form?.lastName,
                address: form?.address,
                phoneNumber: form?.phoneNumber,
                dob: form?.dob,
                email: form?.email,
                isDeleted: form?.isDeleted
              }
            )
          }}>update</button>
        </div>
      </div>


      <div className={`flex justify-center items-center bg-[#00000089] h-screen w-screen fixed  ${hideModel}`} >
        <div className={`bg-sky-400   w-[800px] h-[400px] `}>
          <p>Are you sure you want to remove {currentStudent?.firstName}</p>
          <button onClick={() => setHideModel("hidden")}>cancel</button>
          <button onClick={async () => {
            setHideModel("hidden")
            removeStudentWithoutRefetching(currentStudent?.id)
            await softDeleteUser(
              {
                id: currentStudent?.id,
                firstName: currentStudent?.firstName,
                lastName: currentStudent?.lastName,
                address: currentStudent?.address,
                phoneNumber: currentStudent?.phoneNumber,
                dob: currentStudent?.dob,
                email: currentStudent?.email,
                isDeleted: true
              }
            )
          }}>delete</button>
        </div>
      </div>


      <NavbarComponent admin={pageContext.admin} />

      <div className='flex flex-col items-center   w-fit mx-auto '>

        <div className=' mr-auto '>
          <input onChange={(e) => { setSearch(e.target.value) }} type="text" className='border my-5 me-5' />
          <select onChange={(e) => { setChooseSearch(e.target.value) }}>
            <option value="firstName">firstname</option>
            <option value="lastName">lastname</option>
            <option value="dob">dob</option>
            <option value="email">email</option>
            <option value="phoneNumber">phonenumber</option>
            <option value="address">address</option>
          </select>
        </div>
        <div className='min-h-[510px] w-full'>
          <table className=' border border-black '>
            <thead className='text-white text-[20px] bg-[#23527C] gap-2  '>
              <tr>
                <th className=' py-2 text-start font-normal  overflow-hidden px-2 w-48 ' onClick={() => { SortByAlpha("firstName") }}>First Name</th>
                <th className=' text-start  font-normal  overflow-hidden px-2 w-48' onClick={() => { SortByAlpha("firstName") }}>Last Name</th>
                <th className=' text-start  font-normal  overflow-hidden px-2 w-48' onClick={() => { SortByDate() }}>Date of Birth</th>
                <th className=' text-start  font-normal  overflow-hidden px-2 w-48' >Address</th>
                <th className=' text-start  font-normal  overflow-hidden px-2 w-80' onClick={() => { SortByAlpha("email") }}>Email</th>
                <th className=' text-start  font-normal  overflow-hidden px-2 w-48'>Phone Number</th>
                <th className=' font-normal w-20'></th>
              </tr>
            </thead>

            <tbody className=" ">
              {
                seedData && seedData.slice(startCut, endCut).map((student: IStudentData | any, idx: number) => {



                  if (student[chooseSearch]?.toLocaleLowerCase().includes(search.toLocaleLowerCase())) {
                    let hide = ""
                    return <tr key={idx} className={` h-[45px] ${idx % 2 == 0 ? "" : "bg-white"}  ${hide}`}>

                      <td className='  overflow-hidden px-2'> {student.firstName ? student.firstName : "N/A"} </td>
                      <td className='  overflow-hidden px-2'>{student.lastName ? student.lastName : "N/A"}  </td>
                      <td className='  overflow-hidden px-2'>  {student?.dob ? student?.dob : "N/A"} </td>
                      <td className='  overflow-hidden px-2'>{student?.address ? student?.address : "N/A"} </td>
                      <td className='  overflow-hidden px-2  '>{student?.email ? student?.email : "N/A"} </td>
                      <td className='  overflow-hidden px-2'>{student?.phoneNumber ? student?.phoneNumber : "N/A"} </td>
                      <td className=' flex flex-row items-center p-2 gap-2'>
                        <Image
                          onClick={() => {
                            setCurrentStudent(student)
                            setHideModel("block")
                          }}
                          src="/Trash.png"
                          alt="Delete"
                          width={30}
                          height={30}
                          className='cursor-pointer'
                        />
                        <Image
                          onClick={() => {
                            setForm(student)
                            setCurrentStudent(student)
                            setEditHideModel("block")

                          }}
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

        <div className='my-5 flex justify-between w-full '>
          <Button className=' bg-[#23527C] rounded-none w-24' onClick={handleBack} >Back</Button>
          <Button className=' bg-[#23527C] rounded-none w-24' onClick={handleForward}>Forward</Button>
        </div>

      </div>







      <FooterComponent />
    </div>

  )
}

export default StudentDirectoryPage
