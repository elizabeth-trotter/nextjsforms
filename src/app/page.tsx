'use client';
import { useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Pass through current values and update
    setFormData({
      ...formData, //get the existing form 
      [e.target.name]: e.target.value //[] to get property name dynamically
    })
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isFilled = formData.firstName && formData.lastName && formData.email && formData.birthdate && formData.password && formData.confirmPassword;
    const passwordsMatch = formData.password === formData.confirmPassword;

    if (isFilled && passwordsMatch) {
      toast("Form submitted successfully!", { type: "success" });

      // Reset all form fields
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        birthdate: '',
        address: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
      });
      setIsSubmitted(false);
    } else {
      if (!isFilled) {
        toast("Please fill out all required fields.", { type: "error" });
      }
      if (!passwordsMatch) {
        toast("Passwords do not match.", { type: "error" });
      }
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="w-full max-w-xl bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h1 className="text-lg font-bold text-center pb-1">Next.js Form Practice</h1>
        <p className="text-xs tracking-wide text-center pb-4">Name: Elizabeth Trotter <span className="hidden sm:inline">|</span> <span className="block sm:inline">Updated: June 24, 2024</span></p>

        <label htmlFor="firstName">First Name *</label>
        <input type="text" id="firstName" name="firstName" className={`${isSubmitted && formData.firstName === '' ? 'border-red-500' : ''}`} value={formData.firstName} onChange={updateForm} minLength={2} maxLength={100} />

        <label htmlFor="lastName">Last Name *</label>
        <input type="text" id="lastName" name="lastName" className={`${isSubmitted && formData.lastName === '' ? 'border-red-500' : ''}`} value={formData.lastName} onChange={updateForm} minLength={2} maxLength={100} />

        <label htmlFor="email">Email *</label>
        <input type="email" autoComplete="email" id="email" name="email" className={`${isSubmitted && formData.email === '' ? 'border-red-500' : ''}`} value={formData.email} onChange={updateForm} />

        <label htmlFor="birthdate">Date of Birth *</label>
        <input type="date" id="birthdate" name="birthdate" className={`${isSubmitted && formData.birthdate === '' ? 'border-red-500' : ''}`} value={formData.birthdate} onChange={updateForm} max={new Date().toISOString().split("T")[0]} />

        <label htmlFor="address">Address</label>
        <input type="text" autoComplete="street-address" id="address" name="address" value={formData.address} onChange={updateForm} maxLength={100} />

        <label htmlFor="phoneNumber">Phone Number</label>
        <InputMask autoComplete="tel" mask="(999)-999-9999" value={formData.phoneNumber} onChange={updateForm} id="phoneNumber" name="phoneNumber"></InputMask>

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
