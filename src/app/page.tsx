'use client';

import PasswordRulesComponent from "@/components/PasswordRulesComponent";
import { CreateAccountAPI, LoginAPI } from "@/utils/DataServices/DataService";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoLogoFacebook } from "react-icons/io";
import FooterComponent from "@/components/FooterComponent/page";
import { useAppContext } from "@/context/Context";
import { ICreateAccount } from "@/Interfaces/Interface";
import ManagementPage from '@/app/ManagementPage/page'; // Import ManagementPage

export default function Home() {
  const pageContext = useAppContext();

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    admin: false,
    oldPassword: ''
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const CreateAccountAPICall = async (loginData: ICreateAccount) => {
    const data = await CreateAccountAPI(loginData);
    return data;
  };

  const [showPasswordToolTip, setShowPasswordToolTip] = useState<boolean>(false);
  const [showEmailToolTip, setShowEmailToolTip] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [isForgotPasswordPage, setIsForgotPasswordPage] = useState<boolean>();
  const [loginErrorForgetPassword, setLoginErrorForgetPassword] = useState<boolean>(false);
  const [newPasswordBoolean, setNewPasswordBoolean] = useState<boolean>(false);

  useEffect(() => {
    pageContext.logout();
  }, []);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    if (e.target.name === 'oldPassword' || e.target.name === "email") {
      setLoginErrorForgetPassword(false);
    }
    if (e.target.name === 'password' || 'confirmPassword') {
      setNewPasswordBoolean(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isFilled = loginData.email && loginData.password;
    const passwordsMatch = loginData.password === loginData.confirmPassword;

    if (isFilled) {
      if (!isLoginPage && !isForgotPasswordPage) {
        const data = await CreateAccountAPICall(loginData);
        if (data) {
          toast("You've successfully created your account!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });

          setLoginData({
            email: '',
            password: '',
            confirmPassword: '',
            admin: false,
            oldPassword: ''
          });
          setIsSubmitted(false);
          setIsForgotPasswordPage(false);
          setIsLoginPage(true);
        } else {
          toast("API to connect the form is currently down!", { type: "warning", className: " !grid !grid-cols-[95%_5%] text-center" });
        }
      } else if (isForgotPasswordPage && !loginErrorForgetPassword) {
        if (loginData.oldPassword) {
          const data = await LoginAPI(loginData);
          if (data && loginData.oldPassword !== loginData.password) {
            toast("You've successfully reset your password!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });

            setLoginData({
              email: '',
              password: '',
              confirmPassword: '',
              admin: false,
              oldPassword: ''
            });
            setIsSubmitted(false);
            setIsForgotPasswordPage(false);
            setIsLoginPage(true);
          } else if (data && loginData.oldPassword === loginData.password) {
            toast("You can't reset your password to your previous password.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
            setLoginErrorForgetPassword(true);
          } else if (data) {
            // Handle other cases
          }
        } else {
          toast("Please fill out all required fields.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
        }
      } else if (loginErrorForgetPassword) {
        toast("You can't reset your password to your previous password.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
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
  };

  const showPasswordToolTipFalse = () => {
    setShowPasswordToolTip(false);
  };

  const showEmailToolTipTrue = () => {
    setShowEmailToolTip(true);
  };

  const showEmailToolTipFalse = () => {
    setShowEmailToolTip(false);
  };

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowOldPassword = () => {
    setShowOldPassword(!showOldPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const goLogin = () => {
    setIsLoginPage(true);
    setIsForgotPasswordPage(false);
    setIsSubmitted(false);
    setLoginError(false);
  };

  const goSignUp = () => {
    setIsLoginPage(false);
    setIsForgotPasswordPage(false);
    setIsSubmitted(false);
    setLoginError(false);
  };

  const goForgotPassword = () => {
    setIsLoginPage(false);
    setIsForgotPasswordPage(true);
    setIsSubmitted(false);
    setLoginError(false);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    e.target.value === "admin" ? setLoginData({ ...loginData, admin: true }) : setLoginData({ ...loginData, admin: false });
  };

  return (
    <div className="min-h-screen w-full bg-[#23527C]">
      <main className="flex items-center justify-center">
        <ToastContainer />
        {loginData.admin ? (
          <ManagementPage />
        ) : (
          <div className="flex items-center flex-col">
            <img className="w-[230px] p-5 mb-4" src="/WA-Logo.png" alt="William's Act Logo" />
            <div className="bg-white px-6 py-4 sm:min-w-[350px] sm:max-w-[538px] max-w-[288px] mb-12">
              <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light ">USER <strong className="font-bold">{isLoginPage ? "LOGIN" : "SIGN UP"}</strong></h1>

              <form onSubmit={handleSubmit} className="openSans font-semibold">
                <div className="gap-x-6 gap-y-4">
                  <div className='flex flex-col relative'>
                    {showEmailToolTip && !isLoginPage && !isForgotPasswordPage && (
                      <div className="absolute -top-24 bg-white sm:w-80 w-full rounded-sm openSans mx-auto left-0 right-0 shadow-md p-4 z-40">
                        <h1 className="openSans font-semibold mb-2">Email Requirement</h1>
                        <PasswordRulesComponent correct={loginData.email.includes('@')} error={loginData.email === "" ? false : true} rule="Contain 1 @ symbol" />
                      </div>
                    )}
                    <p className='text-red-600 absolute top-0 right-1'>*</p>
                    <input placeholder="Email" type="email" autoComplete="email" id="email" name="email" className={`${isLoginPage ? loginError ? "border border-red-500" : "" : !loginData.email.includes('@') && loginData.email.length > 0 || loginErrorForgetPassword ? "border border-red-500" : isSubmitted && loginData.email === '' ? 'border border-red-500 ' : ''} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12`} value={loginData.email} onChange={updateForm} onFocus={showEmailToolTipTrue} onBlur={showEmailToolTipFalse} />
                  </div>

                  {isForgotPasswordPage && (
                    <div className='flex flex-col relative'>
                      <p className='text-red-600 absolute top-0 right-1'>*</p>
                      <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showOldPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowOldPassword} />
                      <input placeholder="Old Password" type={showOldPassword ? "text" : "password"} id="confirmPassword" name="oldPassword" className={`${(isSubmitted && loginData.oldPassword === '') || loginErrorForgetPassword ? 'border border-red-500 ' : ''} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12`} value={loginData.oldPassword} onChange={updateForm} />
                    </div>
                  )}

                  <div className='flex flex-col relative'>
                    {showPasswordToolTip && !isLoginPage && (
                      <div className="absolute -top-44 bg-white sm:w-80 w-full rounded-sm openSans mx-auto left-0 right-0 shadow-md p-4 z-40">
                        <h1 className="openSans font-semibold mb-2">Password Requirements</h1>
                        <PasswordRulesComponent correct={/.{15,}/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Be at least 15 characters long" />
                        <PasswordRulesComponent correct={/[A-Z]/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Contain 1 uppercase letter" />
                        <PasswordRulesComponent correct={/[0-9]/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Contain 1 number" />
                        <PasswordRulesComponent correct={/[?!@#$%^&*]/.test(loginData.password)} error={loginData.password === "" ? false : true} rule="Contain 1 special character: ? ! @ # $ % ^ & *" />
                        <PasswordRulesComponent correct={loginData.password === loginData.confirmPassword && loginData.password.length > 0} error={loginData.password === "" ? false : loginData.password !== loginData.confirmPassword} rule="Confirm Passwords Match" />
                      </div>
                    )}
                    <p className='text-red-600 absolute top-0 right-1'>*</p>
                    <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowPassword} />
                    <input placeholder={isForgotPasswordPage ? "New Password" : "Password"} type={showPassword ? "text" : "password"} id="password" name="password" className={`${isLoginPage ? loginError ? "border border-red-500" : "" : (isSubmitted && loginData.password === '') || (loginData.password !== loginData.confirmPassword) || newPasswordBoolean ? 'border border-red-500' : ''} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12`} value={loginData.password}
                      pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$"
                      onFocus={showPasswordToolTipTrue}
                      onBlur={showPasswordToolTipFalse}
                      onChange={(e) => {
                        const { value } = e.target;
                        const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
                        setLoginData({ ...loginData, password: sanitizedValue });
                      }}
                    />
                  </div>

                  {!isLoginPage && (
                    <div className='flex flex-col relative'>
                      <p className='text-red-600 absolute top-0 right-1'>*</p>
                      <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showConfirmPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowConfirmPassword} />
                      <input placeholder="Re-Type Password" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword" className={`${(isSubmitted && loginData.password === '') || (loginData.password !== loginData.confirmPassword) || newPasswordBoolean ? 'border border-red-500' : ''} text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12`} value={loginData.confirmPassword} onChange={updateForm} onFocus={showPasswordToolTipTrue} onBlur={showPasswordToolTipFalse} />
                    </div>
                  )}

                  {!isLoginPage && !isForgotPasswordPage && (
                    <select onChange={(e) => handleSelect(e)} className="w-full text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  )}

                  <div className="flex justify-between">
                    {!isLoginPage && <p className="text-sm openSans hover:cursor-pointer text-[#DD8A3E]" onClick={goLogin}>Login</p>}
                    {isLoginPage && !isForgotPasswordPage && <p className="text-sm openSans hover:cursor-pointer text-[#DD8A3E]" onClick={goSignUp}>Sign Up</p>}
                    {!isForgotPasswordPage && <p className="text-sm openSans hover:cursor-pointer text-[#DD8A3E]" onClick={goForgotPassword}>Forgot Password</p>}
                  </div>
                </div>

                <div className="flex justify-center mt-6 w-full flex-col">
                  <button type="submit" className="bg-[#DD8A3E] hover:brightness-90 p-4 w-full text-white text-sm font-bold tracking-wide">{!isLoginPage ? isForgotPasswordPage ? "Reset Password" : "CreateAccount" : "Login"}</button>
                  <p className="text-red-600 text-xs text-end pt-1 openSans">* fields required</p>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
      <FooterComponent />
    </div>
  );
}
