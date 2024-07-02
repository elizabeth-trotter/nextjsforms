'use client'

import React, { useEffect, useState } from 'react';
import { IForm, IToken } from '@/Interfaces/Interface';
import { notFound, useRouter } from 'next/navigation';
import NavbarComponent from '@/components/NavbarComponent';
import { Button } from 'flowbite-react';
import Image from 'next/image';
import FooterComponent from "@/components/FooterComponent/page";
import { useAppContext } from '@/context/Context';
import InputMask from "react-input-mask";

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

const ManagementPage = () => {
    const [users, setUsers] = useState<IForm[]>([]);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<IForm | null>(null);
    const [data, setData] = useState<any>(null);
    const [modal, setModal] = useState(false)
    const [editModal, setEditModal] = useState(false)
    const [search, setSearch] = useState<string>("");
    const [toggleABC, setToggleABC] = useState(true);
    const [toggleLoad, setToggleLoad] = useState(true);
    const [chooseSearch, setChooseSearch] = useState("email");
    const [startCut, setStartCut] = useState(0);
    const [endCut, setEndCut] = useState(10);
    const [currentStudent, setCurrentStudent] = useState<IStudentData>();
    const [hideModel, setHideModel] = useState("hidden");
    const [hideEditModel, setEditHideModel] = useState("hidden");
    const [resetFirst, setResetFirst] = useState('')
    const [resetLast, setResetLast] = useState('')
    const [resetDob, setResetDob] = useState('')

    const [seedData, setSeedData] = useState<IStudentData[] | any>();

    const router = useRouter();

    // const fetchUsers = async () => {
    //     const response = await fetch('https://williamform.azurewebsites.net/User/GetAllUsers');
    //     if (!response.ok) {
    //         throw new Error('Failed to fetch');
    //     }
    //     const usersData = await response.json();
    //     setUsers(usersData);
    // };

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
        const res = await fetch("https://williamform.azurewebsites.net/User/GetAllUsers");
        const usersData = await res.json();
        return usersData;
    }


    useEffect(() => {
        const session = sessionStorage.getItem("WA-SessionStorage");
        setData(session ? JSON.parse(session) : null);
        CheckToken(session ? JSON.parse(session) : null);

        const loadAll = async () => {
            setSeedData(await FetchAllUsers())
            console.log(await FetchAllUsers())

        }
        loadAll();

    }, []);

    const softDeleteUser = async (profileData: IStudentData | any) => {
        console.log("bye")
        const res = await fetch("https://williamform.azurewebsites.net/User/UpdateUser", {
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
        if (seedData) {
            const sorted = [...seedData].sort((a, b) => {
                const fieldA = a[selectedField]?.toLowerCase() || '';
                const fieldB = b[selectedField]?.toLowerCase() || '';

                if (fieldA === '' && fieldB === '') return 0;
                if (fieldA === '') return 1;
                if (fieldB === '') return -1;

                if (toggleABC) {
                    if (fieldA < fieldB) return -1;
                    if (fieldA > fieldB) return 1;
                } else {
                    if (fieldA > fieldB) return -1;
                    if (fieldA < fieldB) return 1;
                }
                return 0;
            });
            setSeedData(sorted);
            setToggleABC(!toggleABC);
        }
    }

    const SortByDate = () => {
        if (seedData) {
            const sorted = [...seedData].sort((a, b) => {
                const dateA = new Date(a.dob || '').getTime();
                const dateB = new Date(b.dob || '').getTime();

                if (!a.dob && !b.dob) return 0;
                if (!a.dob) return 1;
                if (!b.dob) return -1;

                if (toggleABC) {
                    return dateA - dateB;
                } else {
                    return dateB - dateA;
                }
            });
            setSeedData(sorted);
            setToggleABC(!toggleABC);
        }
    };


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

    const CheckToken = (data: IToken | null) => {
        if ((data != null && data.token === null || !data?.isAdmin) || data === null) {
            return notFound();
        }
    }

    const [currentSortField, setCurrentSortField] = useState<string>('email|alpha');

    const sortData = (field: string, type: 'alpha' | 'date') => {
        if (seedData) {
            const sorted = [...seedData].sort((a, b) => {
                if (type === 'alpha') {
                    const fieldA = a[field]?.toLowerCase() || '';
                    const fieldB = b[field]?.toLowerCase() || '';

                    if (fieldA === '' && fieldB === '') return 0;
                    if (fieldA === '') return 1;
                    if (fieldB === '') return -1;

                    if (fieldA < fieldB) return -1;
                    if (fieldA > fieldB) return 1;
                } else if (type === 'date') {
                    const dateA = new Date(a[field] || '').getTime();
                    const dateB = new Date(b[field] || '').getTime();

                    if (!a[field] && !b[field]) return 0;
                    if (!a[field]) return 1;
                    if (!b[field]) return -1;

                    return dateA - dateB;
                }
                return 0;
            });
            setSeedData(sorted);
        }
    };

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, type] = e.target.value.split('|');
        setCurrentSortField(field);
        sortData(field, type as 'alpha' | 'date');
    };

    return (
        <div>

            <div
                className={`flex justify-center md:items-center  bg-[#00000089] h-full w-screen fixed ${hideEditModel} `}
            >
                <div className={`bg-white p-[24px] relative   h-fit `}>
                    <p className=" text-[20px] md:text-[30px] text-center mb-2 md:mb-6 font-bold">
                        {" "}
                        UPDATE USER INFORMATION
                    </p>
                    <div className=" grid gap-x-10 md:gap-y-2 grid-cols-1">
                        <div className=" mx-auto w-full">
                            <label className=" w-fill rounded font-normal text-slate-600">
                                Email
                                <input
                                    autoComplete='off'
                                    placeholder="First Name"
                                    type="text"
                                    name="email"
                                    maxLength={100}
                                    className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12"
                                    value={form?.email}
                                    onChange={updateForm}
                                />
                            </label>
                        </div>
                    </div>

                    <div className=" mx-auto w-full">
                        <label className=" w-fill rounded font-normal text-slate-600">
                            First Name
                            <input
                                autoComplete='off'
                                placeholder="First Name"
                                type="text"
                                name="firstName"
                                maxLength={100}
                                className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12"
                                value={form?.firstName ? form?.firstName : resetFirst}
                                onChange={updateForm}
                            />
                        </label>
                    </div>

                    <div className=" mx-auto w-full">
                        <label className=" w-fill rounded font-normal text-slate-600">
                            Last Name
                            <input
                                autoComplete='off'
                                placeholder="Last Name"
                                type="text"
                                name="lastName"
                                maxLength={100}
                                className="border w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12"
                                value={form?.lastName ? form?.lastName : resetLast}
                                onChange={updateForm}
                            />
                        </label>
                    </div>

                    <div className=" mx-auto w-full ">
                        <label className=" w-fill rounded font-normal text-slate-600">
                            Date of Birth
                            <input
                                autoComplete='off'
                                placeholder="Date of Birth"
                                type="date"
                                name="dob"
                                className="border text-center bg-[#ECF0F1] w-full p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12"
                                value={form?.dob ? form?.dob : resetDob}
                                onChange={updateForm}
                            />
                        </label>
                    </div>

                    <div className=" flex justify-end gap-x-5  mt-2 md:mt-6  ">
                        <button
                            className=" text-white w-[100px] h-[50px] font-semibold  bg-[#737375]"
                            onClick={() => setEditHideModel("hidden")}
                        >
                            CANCEL
                        </button>

                        <button
                            className=" text-white w-[100px] h-[50px] font-semibold  bg-[#DD8A3E]  "
                            onClick={async () => {
                                setEditHideModel("hidden");

                                replaceStudentWithoutRefetching(currentStudent?.id, form);
                                await softDeleteUser({
                                    id: form?.id,
                                    firstName: form?.firstName,
                                    lastName: form?.lastName,
                                    address: form?.address,
                                    phoneNumber: form?.phoneNumber,
                                    dob: form?.dob,
                                    email: form?.email,
                                    isDeleted: form?.isDeleted,
                                });
                            }}
                        >
                            UPDATE
                        </button>
                    </div>
                </div>
            </div>

            <div
                className={`flex justify-center items-center bg-[#00000089] h-screen w-screen fixed  ${hideModel}`}
            >
                <div className={`bg-white p-5`}>
                    <p className="text-center pb-5">
                        Are you sure you want to remove <br /> {currentStudent?.email}
                    </p>
                    <div className="flex justify-evenly">
                        <button
                            className="text-white w-[100px] h-[50px] font-semibold  bg-[#737375]"
                            onClick={() => setHideModel("hidden")}
                        >
                            CANCEL
                        </button>
                        <button
                            className="text-white w-[100px] h-[50px] font-semibold  bg-[#DD8A3E]"
                            onClick={async () => {
                                setHideModel("hidden");
                                removeStudentWithoutRefetching(currentStudent?.id);
                                await softDeleteUser({
                                    id: currentStudent?.id,
                                    firstName: currentStudent?.firstName,
                                    lastName: currentStudent?.lastName,
                                    address: currentStudent?.address,
                                    phoneNumber: currentStudent?.phoneNumber,
                                    dob: currentStudent?.dob,
                                    email: currentStudent?.email,
                                    isDeleted: true,
                                });
                            }}
                        >
                            DELETE
                        </button>
                    </div>
                </div>
            </div>

            <NavbarComponent admin={data && data.isAdmin} />

            <div className='flex flex-col items-center xl:w-[1396px] w-[96%] mx-auto overflow-auto'>

                <div className=' mr-auto '>
                    <input name='searchBar' onChange={(e) => { setSearch(e.target.value) }} type="text" className='border md:my-5 mt-5 lg:me-3 md:w-[50%] w-[100%]' />
                    <select name='sortBy' onChange={handleSortChange} className='sm:w-[40%] w-full md:mb-0 mb-5'>
                        <option value="email|alpha">Email</option>
                        <option value="firstName|alpha">Firstname</option>
                        <option value="lastName|alpha">Lastname</option>
                        <option value="dob|date">Date Of Birth</option>
                    </select>
                </div>

                <div className='flex lg:justify-center overflow-auto w-full'>
                    <div className='min-h-[510px] w-full'>
                        <table className=' border border-black w-full'>
                            <thead className='text-white text-[20px] bg-[#23527C] gap-2  '>
                                <tr>
                                    <th className='py-2 text-[16px] text-start font-normal overflow-hidden px-2 min-w-48 ' onClick={() => { SortByAlpha("email") }}>
                                        <div className="flex items-center gap-1 w-fit hover:cursor-pointer">
                                            <p className="w-fit">Email</p>
                                            <img src="/sortArrows.png" alt="Sort Arrows" className="h-[20px] w-[20px]" />
                                        </div>
                                    </th>
                                    <th className=' py-2  text-[16px] text-start font-normal overflow-hidden px-2 min-w-48 ' onClick={() => { SortByAlpha("firstName") }}>
                                        <div className="flex items-center gap-1 w-fit hover:cursor-pointer">
                                            <p className="w-fit">First Name</p>
                                            <img src="/sortArrows.png" alt="Sort Arrows" className="h-[20px] w-[20px]" />
                                        </div>
                                    </th>
                                    <th className='py-2  text-[16px] text-start font-normal overflow-hidden px-2 min-w-48' onClick={() => { SortByAlpha("lastName") }}>
                                        <div className="flex items-center gap-1 w-fit hover:cursor-pointer">
                                            <p className="w-fit">Last Name</p>
                                            <img src="/sortArrows.png" alt="Sort Arrows" className="h-[20px] w-[20px]" />
                                        </div>
                                    </th>
                                    <th className='py-2  text-[16px] text-start font-normal overflow-hidden px-2 min-w-48 ' onClick={() => { SortByDate() }}>      <div className="flex items-center gap-1 w-fit hover:cursor-pointer">
                                        <p className="w-fit">Date of Birth</p>
                                        <img src="/sortArrows.png" alt="Sort Arrows" className="h-[20px] w-[20px]" />
                                    </div></th>
                                    <th className=' font-normal min-w-20'></th>
                                </tr>
                            </thead>

                            <tbody className=" ">
                                {
                                    seedData && seedData.slice(startCut, endCut).map((student: IStudentData | any, idx: number) => {

                                        if (student[chooseSearch]?.toLowerCase().includes(search.toLowerCase())) {
                                            let hide = ""
                                            return <tr key={idx} className={`h-[45px] ${idx % 2 == 0 ? "" : "bg-white"}  ${hide}`}>

                                                <td className='overflow-hidden px-2'>{student.email ? student.email : "N/A"}</td>
                                                <td className='overflow-hidden px-2'>{student?.firstName ? student?.firstName : "N/A"}</td>
                                                <td className='overflow-hidden px-2'>{student.lastName ? student.lastName : "N/A"}</td>
                                                <td className='overflow-hidden px-2'>{student?.dob ? student?.dob : "N/A"} </td>
                                                <td className='flex flex-row items-center p-2 gap-2'>
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
                                                            if (student.firstName === 'N/A') {
                                                                setResetFirst('')
                                                            } if (student.Lastname === 'N/A') {
                                                                setResetLast('')
                                                            } if (student.dob === 'N/A') {
                                                                setResetDob('')
                                                            }
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
                </div>

                <div className="my-5 flex max-w-[1396px] px-5 xl:px-0 justify-between w-full ">
                    <button
                        className=" bg-[#23527C] w-[94px] h-[36px] px-[16px] py-[8px] text-white rounded-none "
                        onClick={handleBack}
                    >
                        Back
                    </button>
                    <button
                        className=" bg-[#23527C] h-[36px] px-[16px] py-[8px] text-white rounded-none "
                        onClick={handleForward}
                    >
                        Forward
                    </button>
                </div>

            </div>

            <FooterComponent />
        </div>

    )
}

export default ManagementPage

