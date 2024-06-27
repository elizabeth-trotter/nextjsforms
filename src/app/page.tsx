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

    if (isFilled && passwordsMatch) {
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
    }
  };
  

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 block ">
        <h1 className="text-lg font-bold text-center pb-1">Next.js Form Practice</h1>
        <p className="text-xs tracking-wide text-center pb-4">Name: Elizabeth Trotter <span className="hidden sm:inline">|</span> <span className="block sm:inline">Updated: June 27, 2024</span></p>

        <label htmlFor="firstname">First Name *</label>
        <input type="text" id="firstname" name="firstname" className={`${isSubmitted && formData.firstname === '' ? 'border-red-500' : ''}`} value={formData.firstname} onChange={updateForm} minLength={2} maxLength={100} />

        <label htmlFor="lastname">Last Name *</label>
        <input type="text" id="lastname" name="lastname" className={`${isSubmitted && formData.lastname === '' ? 'border-red-500' : ''}`} value={formData.lastname} onChange={updateForm} minLength={2} maxLength={100} />

        <label htmlFor="email">Email *</label>
        <input type="email" autoComplete="email" id="email" name="email" className={`${isSubmitted && formData.email === '' ? 'border-red-500' : ''}`} value={formData.email} onChange={updateForm} />

        <label htmlFor="dob">Date of Birth *</label>
        <input type="date" id="dob" name="dob" className={`${isSubmitted && formData.dob === '' ? 'border-red-500' : ''}`} value={formData.dob} onChange={updateForm} max={maxDate} />

        <label htmlFor="address">Address</label>
        <input type="text" autoComplete="street-address" id="address" name="address" value={formData.address} onChange={updateForm} maxLength={100} />

        <label htmlFor="phonenumber">Phone Number</label>
        <InputMask autoComplete="tel" mask="(999)-999-9999" value={formData.phonenumber} onChange={updateForm} id="phonenumber" name="phonenumber"></InputMask>

        <label htmlFor="password">Password *</label>
        <input type="password" id="password" name="password" className={`${isSubmitted && formData.password === '' ? 'border-red-500' : ''}`} value={formData.password}
          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$"
          onChange={(e) => {
            const { value } = e.target;
            // Remove any characters that are not in the allowed set
            const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
            setFormData({ ...formData, password: sanitizedValue });
          }}
        />

        <label htmlFor="confirmPassword">Confirm Password *</label>
        <input type="password" id="confirmPassword" name="confirmPassword" className={`${isSubmitted && formData.confirmPassword === '' ? 'border-red-500' : ''}`} value={formData.confirmPassword} onChange={updateForm} />

        <h2 className="font-bold pb-2">Password Requirements:</h2>
        <ol className="text-xs pb-5">
          <li style={{ color: /.{15,}/.test(formData.password) ? '#004600' : '#8B0000' }}>- Be at least 15 characters long</li>
          <li style={{ color: /[A-Z]/.test(formData.password) ? '#004600' : '#8B0000' }}>- Contain 1 uppercase letter</li>
          <li style={{ color: /[0-9]/.test(formData.password) ? '#004600' : '#8B0000' }}>- Contain 1 number</li>
          <li style={{ color: /[?!@#$%^&*]/.test(formData.password) ? '#004600' : '#8B0000' }}>- Contain 1 special character: ? ! @ # $ % ^ & *</li>
          <li style={{ color: formData.password === formData.confirmPassword && formData.password.length > 0 ? '#004600' : '#8B0000' }}>- Confirm password matches</li>
        </ol>

        <button type="submit">Submit</button>
        <p className="text-xs text-end pt-1">* fields required</p>

      </form>
    </main>
  );
};
