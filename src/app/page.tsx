'use client';
import { GetFormsAPI, SendFormAPI } from "@/DataServices/DataService";
import { useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    dob: '',
    address: '',
    phonenumber: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [maxDate, setMaxDate] = useState('');

  const SendFormAPICall = async (form: IForm) => {
    const data = await SendFormAPI(form);
    return data;
  }

  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setMaxDate(`${year}-${month}-${day}`);

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

    const isFilled = formData.firstname && formData.lastname && formData.email && formData.dob && formData.password && formData.confirmPassword;
    const passwordsMatch = formData.password === formData.confirmPassword;
    const checkFirstName = /^[A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+([\ A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+)*$/.test(formData.firstname)
    const checkLastName = /^[A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+([\ A-Za-z\u00C0-\u00FF][A-Za-z\u00C0-\u00FF'\-]+)*$/.test(formData.lastname)

    if (isFilled && passwordsMatch && checkFirstName && checkLastName) {
      const data = await SendFormAPICall(formData)

      if (data) {
        toast("Form submitted successfully!", { type: "success" });

        // Reset all form fields
        setFormData({
          firstname: '',
          lastname: '',
          email: '',
          dob: '',
          address: '',
          phonenumber: '',
          password: '',
          confirmPassword: '',
        });
        setIsSubmitted(false);
      } else {
        toast("API to connect the form is currenty down!", { type: "warning" });
      }

    } else {
      if (!isFilled) {
        toast("Please fill out all required fields.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
      }
      if (!passwordsMatch) {
        toast("Passwords do not match.", { type: "error" });
      }
      if (!checkFirstName || !checkLastName) {
        toast('Numbers and special characters are not allowed for names', { type: "error" });
      }
    }
  };


  return (
    <main className="min-h-screen w-full bg-[#23527C] flex items-center justify-center">
      <ToastContainer />
      <div className="flex items-center flex-col">
        <img src="/WA-Logo.png" alt="William's Act Logo" />
        <div className="bg-white px-6 py-4 sm:min-w-[538px] sm:max-w-[538px] max-w-[288px] mb-12">
          <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light ">USER <strong className="font-bold">SIGN UP</strong></h1>

          <form onSubmit={handleSubmit} className="openSans font-semibold">
            <div className="grid sm:grid-cols-2 gap-6 ">

              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <input placeholder="First Name" type="text" id="firstName" name="firstName" className={`${isSubmitted && formData.firstname === '' ? 'border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.firstname} onChange={updateForm} minLength={2} maxLength={100} />
              </div>


              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <input placeholder="Last Name" type="text" id="lastName" name="lastName" className={`${isSubmitted && formData.lastname === '' ? 'border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.lastname} onChange={updateForm} minLength={2} maxLength={100} />
              </div>

              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <input placeholder="Email" type="email" autoComplete="email" id="email" name="email" className={`${isSubmitted && formData.email === '' ? 'border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.email} onChange={updateForm} />
              </div>

              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>

                <input placeholder="Birthdate" type="date" id="birthdate" name="birthdate" className={`${isSubmitted && formData.dob === '' ? 'border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.dob} onChange={updateForm} max={maxDate} />
              </div>

              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>

                <input className="text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12" placeholder="Address" type="text" autoComplete="street-address" id="address" name="address" value={formData.address} onChange={updateForm} maxLength={100} />
              </div>

              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>

                <InputMask className="text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12" placeholder="(xxx)-xxx-xxxx" autoComplete="tel" mask="(999)-999-9999" value={formData.phonenumber} onChange={updateForm} id="phoneNumber" name="phoneNumber"></InputMask>
              </div>

              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <input placeholder="Password" type="password" id="password" name="password" className={`${isSubmitted && formData.password === '' ? 'border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.password}
                  pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$"
                  onChange={(e) => {
                    const { value } = e.target;
                    // Remove any characters that are not in the allowed set
                    const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
                    setFormData({ ...formData, password: sanitizedValue });
                  }}
                />
              </div>



              <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <input placeholder="Re-Type Password" type="password" id="confirmPassword" name="confirmPassword" className={`${isSubmitted && formData.confirmPassword === '' ? 'border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12'}`} value={formData.confirmPassword} onChange={updateForm} />
              </div>


              <div className=" sm:col-span-2">
                <h2 className="font-bold pb-2">Password Requirements:</h2>
                <ol className="text-xs pb-5">
                  <li style={{ color: /.{15,}/.test(formData.password) ? '#004600' : '#8B0000' }}>- Be at least 15 characters long</li>
                  <li style={{ color: /[A-Z]/.test(formData.password) ? '#004600' : '#8B0000' }}>- Contain 1 uppercase letter</li>
                  <li style={{ color: /[0-9]/.test(formData.password) ? '#004600' : '#8B0000' }}>- Contain 1 number</li>
                  <li style={{ color: /[?!@#$%^&*]/.test(formData.password) ? '#004600' : '#8B0000' }}>- Contain 1 special character: ? ! @ # $ % ^ & *</li>
                  <li style={{ color: formData.password === formData.confirmPassword && formData.password.length > 0 ? '#004600' : '#8B0000' }}>- Confirm password matches</li>
                </ol>

              </div>


            </div>

            <div className="flex justify-center mt-6 w-full flex-col">
              <button type="button" className="bg-[#DD8A3E] hover:brightness-90 p-4 w-full text-white text-sm font-bold tracking-wide" >Submit</button>
              <p className="text-xs text-end pt-1">* fields required</p>
            </div>


          </form>
        </div>
      </div>


    </main>
  );
};
