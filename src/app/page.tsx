'use client';


import PasswordRulesComponent from "@/components/PasswordRulesComponent";
import { CreateAccountAPI, GetFormsAPI } from "@/utils/DataServices/DataService";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoLogoFacebook } from "react-icons/io";

export default function Home() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    admin: true,
  })

  const [isSubmitted, setIsSubmitted] = useState(false);


  const CreateAccountAPICall = async (loginData: ICreateAccount) => {
    const data = await CreateAccountAPI(loginData);
    return data;
  }

  const [showPasswordToolTip, setShowPasswordToolTip] = useState<boolean>(false);

  const [showEmailToolTip, setShowEmailToolTip] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);

  const [loginError, setLoginError] = useState<boolean>(false);

  useEffect(() => {

  }, []);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Pass through current values and update
    setLoginData({
      ...loginData, //get the existing form 
      [e.target.name]: e.target.value //[] to get property name dynamically
    })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isFilled = loginData.email && loginData.password;
    const passwordsMatch = loginData.password === loginData.confirmPassword;

    if (isFilled) {
      if (!isLoginPage) {
        const data = await CreateAccountAPICall(loginData)

        if (data) {
          toast("You've successfully created your account!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });

          // Reset all form fields
          setLoginData({
            email: '',
            password: '',
            confirmPassword: '',
            admin: true
          });
          setIsSubmitted(false);
          setIsLoginPage(true);
        } else {
          toast("API to connect the form is currenty down!", { type: "warning", className: " !grid !grid-cols-[95%_5%] text-center" });
        }
      } else {

      }

    } else {
      if (!isFilled) {
        toast("Please fill out all required fields.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
        setLoginError(true);
      }
      if (!passwordsMatch) {
        toast("Passwords do not match.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
      }

    }
  };

  const showPasswordToolTipTrue = () => {
    setShowPasswordToolTip(true);
  }

  const showPasswordToolTipFalse = () => {
    setShowPasswordToolTip(false);
  }

  const showEmailToolTipTrue = () => {
    setShowEmailToolTip(true);
  }

  const showEmailToolTipFalse = () => {
    setShowEmailToolTip(false);
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const goLogin = () => {
    setIsLoginPage(true);
    setIsSubmitted(false);
    setLoginError(false);
  }

  const goSignUp = () => {
    setIsLoginPage(false);
    setIsSubmitted(false);
    setLoginError(false);
  }

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    e.target.value === "admin" ? setLoginData({ ...loginData, admin: true }) : setLoginData({ ...loginData, admin: false })
  }


  return (
    <main className=" min-h-screen w-full bg-[#23527C] flex items-center justify-center">
      <ToastContainer />
      <div className="flex items-center flex-col">
        <img className="w-[230px] p-5 mb-4" src="/WA-Logo.png" alt="William's Act Logo" />
        <div className="bg-white px-6 py-4 sm:min-w-[350px] sm:max-w-[538px] max-w-[288px] mb-12">
          <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light ">USER <strong className="font-bold">{isLoginPage ? "LOGIN" : "SIGN UP"}</strong></h1>

          <form onSubmit={handleSubmit} className="openSans font-semibold">
            <div className="gap-x-6 gap-y-4 ">

              {/* Username Input Field */}
              <div className='flex flex-col relative'>

                {
                  // Password Tool Tip
                  showEmailToolTip && !isLoginPage && <div className="absolute -top-24 bg-white sm:w-80 w-full rounded-sm openSans mx-auto left-0 right-0 shadow-md p-4 z-40">
                    <h1 className="openSans font-semibold mb-2">Email Requirement</h1>
                    <PasswordRulesComponent correct={loginData.email.includes('@')} error={loginData.email === "" ? false : true} rule="Contain 1 @ symbol" />
                  </div>
                }

                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <input placeholder="Email" type="email" autoComplete="email" id="email" name="email" className={`${isLoginPage ? loginError ? "border border-red-500" : "" : !loginData.email.includes('@') && loginData.email.length > 0 ? "border border-red-500" : isSubmitted && loginData.email === '' ? 'border border-red-500 ' : ''} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12`} value={loginData.email} onChange={updateForm} onFocus={showEmailToolTipTrue} onBlur={showEmailToolTipFalse} />

              </div>

              <div className='flex flex-col relative'>

                {
                  // Password Tool Tip
                  showPasswordToolTip && !isLoginPage && <div className="absolute -top-44 bg-white sm:w-80 w-full rounded-sm openSans mx-auto left-0 right-0 shadow-md p-4 z-40">
                    <h1 className="openSans font-semibold mb-2">Password Requirements</h1>
                    <PasswordRulesComponent correct={/.{15,}/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Be at least 15 characters long" />
                    <PasswordRulesComponent correct={/[A-Z]/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Contain 1 uppercase letter" />
                    <PasswordRulesComponent correct={/[0-9]/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Contain 1 number" />
                    <PasswordRulesComponent correct={/[?!@#$%^&*]/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Contain 1 special character: ? ! @ # $ % ^ & *" />
                    <PasswordRulesComponent correct={loginData.password === loginData.confirmPassword && loginData.password.length > 0} error={loginData.password === "" ? false : loginData.password !== loginData.confirmPassword} rule="Confirm Passwords Match" />
                  </div>
                }

                <p className='text-red-600 absolute top-0 right-1'>*</p>

                <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowPassword} />

                {/* Password Input Field */}
                <input placeholder="Password" type={showPassword ? "text" : "password"} id="password" name="password" className={`${isLoginPage ? loginError ? "border border-red-500" : "" : (isSubmitted && loginData.password === '') || (loginData.password !== loginData.confirmPassword) ? 'border border-red-500' : ''} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12`} value={loginData.password}
                  pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$"
                  onFocus={showPasswordToolTipTrue}
                  onBlur={showPasswordToolTipFalse}
                  onChange={(e) => {
                    const { value } = e.target;
                    // Remove any characters that are not in the allowed set
                    const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
                    setLoginData({ ...loginData, password: sanitizedValue });
                  }}
                />
              </div>

              {/* Confirm Password Field */}
              {!isLoginPage && <div className='flex flex-col relative'>
                <p className='text-red-600 absolute top-0 right-1'>*</p>
                <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showConfirmPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowConfirmPassword} />
                <input placeholder="Re-Type Password" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" className={`${(isSubmitted && loginData.password === '') || (loginData.password !== loginData.confirmPassword) ? 'border border-red-500 text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 pr-10' : 'text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12'}`} value={loginData.confirmPassword} onChange={updateForm} onFocus={showPasswordToolTipTrue} onBlur={showPasswordToolTipFalse} />
              </div>}

              {!isLoginPage && <select onChange={(e) => handleSelect(e)} className="w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12">
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>}

              {!isLoginPage && <p className="text-sm openSans hover:cursor-pointer text-[#DD8A3E]" onClick={goLogin}>Login</p>}

              {isLoginPage && <p className="text-sm openSans hover:cursor-pointer text-[#DD8A3E]" onClick={goSignUp}>Sign Up</p>}

            </div>

            <div className="flex justify-center mt-6 w-full flex-col">
              <button type="submit" className="bg-[#DD8A3E] hover:brightness-90 p-4 w-full text-white text-sm font-bold tracking-wide" >{!isLoginPage ? "Create Account" : "Login"}</button>
              <p className=" text-red-600 text-xs text-end pt-1 openSans">* fields required</p>
            </div>

          </form>
        </div>
      </div>


    </main>
  );
};
