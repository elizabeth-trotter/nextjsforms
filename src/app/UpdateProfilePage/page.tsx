'use client'


import NavbarComponent from "@/components/NavbarComponent";
import { useAppContext } from "@/context/Context";
import { AddStudentAPI } from "@/utils/DataServices/DataService";
import { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateProfilePage = () => {
    const pageContext = useAppContext();


    const [formData, setFormData] = useState({
        id: 0,
        firstname: '',
        lastname: '',
        email: '',
        dob: '',
        address: '',
        phonenumber: '',
        isDeleted: false
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [maxDate, setMaxDate] = useState('');

    useEffect(() => {

        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        setMaxDate(`${year}-${month}-${day}`);
        console.log(sessionStorage.getItem("WA-SessionStorage"));

    }, []);

    const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Pass through current values and update
        setFormData({
            ...formData, //get the existing form 
            [e.target.name]: e.target.value //[] to get property name dynamically
        })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitted(true);

        const isFilled = formData.firstname && formData.lastname && formData.email && formData.dob;
        const checkFirstName = /^[A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+([\ A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+)*$/.test(formData.firstname)
        const checkLastName = /^[A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+([\ A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+)*$/.test(formData.lastname)

        if (isFilled && checkFirstName && checkLastName) {
            if (formData.phonenumber.length > 0 && !/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/.test(formData.phonenumber)) {
                toast("Please fill out your number.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
            } else {
                try {
                    await AddStudentAPI(formData)
                    toast("You've successfully added a student to the directory!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });

                    // Reset all form fields
                    setFormData({
                        id: 0,
                        firstname: '',
                        lastname: '',
                        email: '',
                        dob: '',
                        address: '',
                        phonenumber: '',
                        isDeleted: false
                    });
                    setIsSubmitted(false);
                } catch (error) {
                    toast("You currently can't add a student, the api might be down right now, sorry", { type: "warning", className: " !grid !grid-cols-[95%_5%] text-center" });
                }
            }

        } else {
            if (!isFilled) {
                toast("Please fill out all required fields.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
            }

        }
    };


    return (
        <div>
            <NavbarComponent admin={pageContext.admin} />

            <main className="min-h-screen w-full bg-[#23527C] flex items-center justify-center">
                <ToastContainer />

                <div className="px-6 py-4">
                    <h1 className="text-center text-[34px] mb-6 robotoCondensed font-bold text-white"></h1>

                    <div className="flex items-center flex-col">
                        <div className="bg-white px-6 py-4 sm:min-w-[538px] sm:max-w-[538px] max-w-[288px] mb-12">
                            <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light "><strong className="font-bold">ADD STUDENT</strong></h1>

                            <form onSubmit={handleSubmit} className="openSans font-semibold">
                                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-4 ">

                                    <div className='flex flex-col relative'>
                                        <p className='text-red-600 absolute top-0 right-1'>*</p>
                                        <input placeholder="First Name" type="text" id="firstName" name="firstName" className={`${isSubmitted && formData.firstname === '' ? 'border border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.firstname} minLength={2} maxLength={100}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                // Remove any characters that are not in the allowed set
                                                const sanitizedValueFirst = value.replace(/[^A-Za-z\u00C0-\u00FF ]+/g, '');
                                                setFormData({ ...formData, firstname: sanitizedValueFirst });
                                            }}
                                        />
                                    </div>

                                    <div className='flex flex-col relative'>
                                        <p className='text-red-600 absolute top-0 right-1'>*</p>
                                        <input placeholder="Last Name" type="text" id="lastName" name="lastName" className={`${isSubmitted && formData.lastname === '' ? 'border border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.lastname} minLength={2} maxLength={100}
                                            onChange={(e) => {
                                                const { value } = e.target;
                                                // Remove any characters that are not in the allowed set
                                                const sanitizedValueLast = value.replace(/[^A-Za-z\u00C0-\u00FF ]+/g, '');
                                                setFormData({ ...formData, lastname: sanitizedValueLast });
                                            }}
                                        />
                                    </div>

                                    <div className='flex flex-col relative'>
                                        <p className='text-red-600 absolute top-0 right-1'>*</p>
                                        <input placeholder="Email" type="email" autoComplete="email" id="email" name="email" className={`${isSubmitted && formData.email === '' ? 'border border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.email} onChange={updateForm} />
                                    </div>

                                    <div className='flex flex-col relative'>
                                        <p className='text-red-600 absolute top-0 right-1'>*</p>

                                        <input placeholder="Birthdate" type="date" id="dob" name="dob" className={`${isSubmitted && formData.dob === '' ? 'border border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.dob} onChange={updateForm} max={maxDate} />
                                    </div>

                                    <div className='flex flex-col relative'>

                                        <input className="text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12" placeholder="Address" type="text" autoComplete="street-address" id="address" name="address" value={formData.address} onChange={updateForm} maxLength={100} />
                                    </div>

                                    <div className='flex flex-col relative'>
                                        <InputMask className={`${/\([0-9]{3}\)-[0-9]{3}-[0-9]{4}/.test(formData.phonenumber) === false && formData.phonenumber.length > 0 ? "border border-red-500" : ""} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12`} placeholder="(xxx)-xxx-xxxx" autoComplete="tel" mask="(999)-999-9999" value={formData.phonenumber} onChange={updateForm} id="phonenumber" name="phonenumber"></InputMask>
                                    </div>

                                </div>

                                <div className="flex justify-center mt-6 w-full flex-col">
                                    <button type="submit" className="bg-[#DD8A3E] hover:brightness-90 p-4 w-full text-white text-sm font-bold tracking-wide" >Update</button>
                                    <p className=" text-red-600 text-xs text-end pt-1 openSans">* fields required</p>
                                </div>

                            </form>
                        </div>
                    </div>
                </div>


            </main>
        </div>
    )
}

export default UpdateProfilePage
