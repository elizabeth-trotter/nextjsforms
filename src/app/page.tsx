'use client';
import { useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: any) => {
    e.preventDefault(); // Prevents default form submission
    
    if (password === confirmPassword) {
      toast("Form submitted successfully!", { type: "success" }); // Display toast notification
      // Here can add further logic to handle form submission, e.g., send data to backend

      // Reset all form fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setBirthdate('');
      setAddress('');
      setPhoneNumber('');
      setPassword('');
      setConfirmPassword('');
    };
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <label htmlFor="first">First Name</label>
        <input type="text" id="first" name="first" value={firstName} onChange={(e) => setFirstName(e.target.value)} minLength={2} maxLength={100} required />

        <label htmlFor="last">Last Name</label>
        <input type="text" id="last" name="last" value={lastName} onChange={(e) => setLastName(e.target.value)} minLength={2} maxLength={100} required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required />

        <label htmlFor="birthdate">Date of Birth</label>
        <input type="date" id="birthdate" name="birthdate" value={birthdate} onChange={(e) => setBirthdate(e.target.value)} max={new Date().toISOString().split("T")[0]} required />

        <label htmlFor="address">Address</label>
        <input type="text" id="address" name="address" value={address} onChange={(e) => setAddress(e.target.value)} maxLength={100} />

        <label htmlFor="phone">Phone Number</label>
        <InputMask mask="(999)-999-9999" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} id="phone" name="phone"></InputMask>

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password" value={password}
          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$"
          onChange={(e) => {
            const { value } = e.target;
            // Remove any characters that are not in the allowed set
            const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
            setPassword(sanitizedValue);
          }}
          required />

        <label htmlFor="passwordconfirmed">Confirm Password</label>
        <input type="password" id="passwordconfirmed" name="passwordconfirmed" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

        <h2 className="font-bold py-2">Password Requirements:</h2>
        <ol className="text-xs pb-5">
          <li style={{ color: /.{15,}/.test(password) ? 'green' : 'red' }}>- Be at least 15 characters long</li>
          <li style={{ color: /[A-Z]/.test(password) ? 'green' : 'red' }}>- Contain 1 uppercase letter</li>
          <li style={{ color: /[0-9]/.test(password) ? 'green' : 'red' }}>- Contain 1 number</li>
          <li style={{ color: /[?!@#$%^&*]/.test(password) ? 'green' : 'red' }}>- Contain 1 special character </li>
          <li style={{ color: password === confirmPassword ? 'green' : 'red' }}>- Confirm password matches</li>
        </ol>

        <button type="submit">Submit</button>
      </form>
    </main>
  );
};
