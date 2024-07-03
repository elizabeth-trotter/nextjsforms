'use client';

import PasswordRulesComponent from "@/components/PasswordRulesComponent";
import { CreateAccountAPI, LoginAPI, ResetPasswordAPI } from "@/utils/DataServices/DataService";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { IoLogoFacebook } from "react-icons/io";
import FooterComponent from "@/components/FooterComponent/page";
import { useAppContext } from "@/context/Context";
import { ICreateAccount, IToken } from "@/Interfaces/Interface";
import { useRouter } from "next/navigation";

export default function Home() {
  const pageContext = useAppContext();

  const router = useRouter();

  const [loginData, setLoginData] = useState({
    id: 0,
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
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

  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

  const [loginError, setLoginError] = useState<boolean>(false);
  const [isForgotPasswordPage, setIsForgotPasswordPage] = useState<boolean>();
  const [loginErrorForgetPassword, setLoginErrorForgetPassword] = useState<boolean>(false);
  const [signUpEmailError, setSignUpEmailError] = useState<boolean>(false);

  const [loadingBool, setLoadingBool] = useState<boolean>(false);

  const [newPasswordBooleanError, setNewPasswordBooleanError] = useState<boolean>(false);

  useEffect(() => {
    sessionStorage.clear();
    if (pageContext.loginCount > 0) {
      toast("You've successfully signed out of your account!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });
      pageContext.setLoginCount(0);
    }
    setLoadingBool(false);
  }, []);

  const updateForm = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData, //get the existing form 
      [e.target.name]: e.target.value //[] to get property name dynamically
    })
    setLoginError(false);
    if (e.target.name === 'oldPassword' || e.target.name === "email") {
      setLoginErrorForgetPassword(false);
    }
    if (e.target.name === 'password' || 'confirmPassword') {
      setNewPasswordBooleanError(false);
    }
    setSignUpEmailError(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isFilled = loginData.email && loginData.password;
    const passwordsMatch = loginData.password === loginData.confirmPassword;

    if (isFilled) {

      // Logic For Sign Up Page
      if (!isLoginPage && !isForgotPasswordPage && passwordsMatch) {
        const data = await CreateAccountAPICall(loginData);
        if (data) {
          toast("You've successfully created your account!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });

          formReset();
          setIsSubmitted(false);
          setIsForgotPasswordPage(false);
          setIsLoginPage(true);
        } else {
          toast("Sorry that email has been taken!", { type: "warning", className: " !grid !grid-cols-[95%_5%] text-center" });
          setSignUpEmailError(true);
        }
      } else if (!passwordsMatch && !isLoginPage && !isForgotPasswordPage) {
        toast("Please make sure your passwords match", { type: "warning", className: " !grid !grid-cols-[95%_5%] text-center" });
      }
      // Logic For Login Page
      else if (isLoginPage) {
        try {
          const data: IToken = await LoginAPI(loginData);
          if (data.token !== undefined || data.token !== null) {
            toast("You've logged in!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });
            setLoadingBool(true);

            sessionStorage.setItem("WA-SessionStorage", JSON.stringify(data));

            router.push('/AddFormPage')
          }
        } catch (error) {
          toast("Username or password is incorrect", { type: "warning", className: " !grid !grid-cols-[95%_5%] text-center" });
          setLoginError(true);
        }
      }

      // Logic For Forgot Password Page
      else if (isForgotPasswordPage && !loginErrorForgetPassword && passwordsMatch) {
        if (loginData.oldPassword) {
          try {
            const data: IToken = await LoginAPI({ email: loginData.email, password: loginData.oldPassword });

            if ((data.token !== undefined || data.token !== null) && loginData.oldPassword !== loginData.password) {
              try {
                const data = await ResetPasswordAPI(loginData.email, loginData.password)
                toast("You've successfully reset your password!", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });
                formReset()
                setIsSubmitted(false);
                setIsForgotPasswordPage(false);
                setIsLoginPage(true);
              } catch (error) {
                toast("Something went wrong, the api might be down", { type: "success", className: " !grid !grid-cols-[95%_5%] text-center" });
              }
            } else if (data.token !== undefined || data.token === null && loginData.oldPassword === loginData.password) {
              toast("Your password can't be reset to your old previous password.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
              setNewPasswordBooleanError(true);
            }
          } catch (error) {
            toast("Login Unsuccessful", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
            setLoginErrorForgetPassword(true)
          }
        } else {
          toast("Please fill out all required fields.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
        }
      } else if (loginErrorForgetPassword) {
        toast("Login Unsuccessful", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
      } else if (!passwordsMatch) {
        toast("Passwords do not match.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
      }
    } else {
      if (!isFilled) {
        toast("Please fill out all required fields.", { type: "error", className: " !grid !grid-cols-[95%_5%] text-center" });
        setLoginError(true);
      }
      if (!passwordsMatch && !isLoginPage) {
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

  const formReset = () => {
    setLoginData({
      id: 0,
      email: '',
      password: '',
      confirmPassword: '',
      isAdmin: false,
      oldPassword: ''
    });
  }

  const resetEverything = () => {
    setLoginData({
      id: 0,
      email: '',
      password: '',
      confirmPassword: '',
      isAdmin: false,
      oldPassword: ''
    });
    setLoginError(false);
    setLoginErrorForgetPassword(false);
    setNewPasswordBooleanError(false);
    setSignUpEmailError(false);
  }

  const goLogin = () => {
    resetEverything();
    setIsLoginPage(true);
    setIsForgotPasswordPage(false);
    setIsSubmitted(false);
  };

  const goSignUp = () => {
    resetEverything()
    setIsLoginPage(false);
    setIsForgotPasswordPage(false);
    setIsSubmitted(false);
  };

  const goForgotPassword = () => {
    resetEverything();
    setIsLoginPage(false);
    setIsForgotPasswordPage(true);
    setIsSubmitted(false);
  };

  const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    e.target.value === "admin" ? setLoginData({ ...loginData, isAdmin: true }) : setLoginData({ ...loginData, isAdmin: false })
  }

  return (
    <div className="min-h-screen w-full bg-[#23527C] flex flex-col justify-between pt-10">
      <main className="flex items-center justify-center">
        <ToastContainer />
        <div className="flex items-center flex-col">
          <img className="w-[230px] p-5 mb-4" src="/WA-Logo.png" alt="William's Act Logo" />
          <div className="bg-white px-6 py-4 sm:min-w-[350px] sm:max-w-[538px] max-w-[288px] mb-16">
            {loadingBool ?
              <>
                <div className="h-full flex justify-center items-center my-16 mx-12">
                  <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light">
                    LOADING...
                  </h1>
                </div>
              </> : <>
                <h1 className="text-center text-[34px] text-black mb-6 robotoCondensed font-light ">
                  {!isForgotPasswordPage ? "USER " : ""}
                  <strong className="font-bold">{isLoginPage ?
                    "LOGIN" : isForgotPasswordPage ?
                      "RESET PASSWORD" : "SIGN UP"}
                  </strong>
                </h1>

                <form onSubmit={handleSubmit} className="openSans font-semibold">
                  <div className="gap-x-6 gap-y-4 ">

                    {/* Username Input Field */}
                    <div className='flex flex-col relative'>

                      {
                        // Email Tool Tip
                        showEmailToolTip && !isLoginPage && !isForgotPasswordPage &&
                        <div className="absolute -top-24 bg-white sm:w-80 w-full rounded-sm openSans mx-auto left-0 right-0 shadow-md p-4 z-40">
                          <h1 className="openSans font-semibold mb-2">Email Requirement</h1>
                          <PasswordRulesComponent correct={loginData.email.includes('@')} error={loginData.email === "" ? false : true} rule="Contain 1 @ symbol" />
                        </div>
                      }

                      <p className='text-red-600 absolute top-0 right-1'>*</p>
                      <input placeholder="Email" type={isLoginPage || isForgotPasswordPage ? "text" : "email"} autoComplete="email" id="email" name="email"
                        className={`${isLoginPage ? loginError || (loginError && loginData.email.length === 0) ?
                          "border border-red-500" : "" :
                          !isForgotPasswordPage && !loginData.email.includes('@') && loginData.email.length > 0 || loginErrorForgetPassword || signUpEmailError ?
                            "border border-red-500" :
                            isSubmitted && loginData.email === '' ?
                              'border border-red-500 ' : ''}
                      text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none 
                      h-12 focus:!border-none focus:!ring-transparent active:!ring-transparent active:!border-none `}
                        value={loginData.email} onChange={updateForm} onFocus={showEmailToolTipTrue} onBlur={showEmailToolTipFalse} />

                    </div>

                    {isForgotPasswordPage && (
                      <div className='flex flex-col relative'>
                        <p className='text-red-600 absolute top-0 right-1'>*</p>
                        <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showOldPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowOldPassword} />
                        <input placeholder="Old Password" type={showOldPassword ? "text" : "password"} id="confirmPassword" name="oldPassword"
                          className={`${(isSubmitted && loginData.oldPassword === '') || loginErrorForgetPassword ?
                            'border border-red-500 ' : ''}
                      text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12 
                      focus:!border-none focus:!ring-transparent active:!ring-transparent active:!border-none`}
                          value={loginData.oldPassword} onChange={updateForm} />
                      </div>
                    )}

                    <div className='flex flex-col relative'>

                      {
                        // Password Tool Tip
                        showPasswordToolTip && !isLoginPage &&
                        <div className="absolute -top-44 bg-white sm:w-80 w-full rounded-sm openSans mx-auto left-0 right-0 shadow-md p-4 z-40">
                          <h1 className="openSans font-semibold mb-2">Password Requirements</h1>

                          <PasswordRulesComponent correct={/.{15,}/.test(loginData.password)}
                            error={loginData.password === "" ? false : true} rule="Be at least 15 characters long" />

                          <PasswordRulesComponent correct={/[A-Z]/.test(loginData.password)}
                            error={loginData.password === "" ? false : true} rule="Contain 1 uppercase letter" />

                          <PasswordRulesComponent correct={/[0-9]/.test(loginData.password)}
                            error={loginData.password === "" ? false : true} rule="Contain 1 number" />

                          <PasswordRulesComponent correct={/[?!@#$%^&*]/.test(loginData.password)}
                            error={loginData.password === "" ? false : true} rule="Contain 1 special character: ? ! @ # $ % ^ & *" />

                          <PasswordRulesComponent correct={loginData.password === loginData.confirmPassword && loginData.password.length > 0}
                            error={loginData.password === "" ? false : loginData.password !== loginData.confirmPassword} rule="Confirm Passwords Match" />
                        </div>
                      }

                      <p className='text-red-600 absolute top-0 right-1'>*</p>

                      <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6"
                        src={showPassword ? "/eye.svg" : "/eye-slash.svg"}
                        alt="eyeball" onClick={handleShowPassword} />

                      {/* Password Input Field */}
                      {!isLoginPage &&
                        <input placeholder={isForgotPasswordPage ? "New Password" : "Password"} type={showPassword ? "text" : "password"} id="password" name="password"
                          className={`${isLoginPage ?
                            loginError ?
                              "border border-red-500" : "" :
                            (isSubmitted && loginData.password === '') || (loginData.password !== loginData.confirmPassword) || newPasswordBooleanError ||
                              !/^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$/.test(loginData.password) && loginData.password.length > 0 ?
                              'border border-red-500' : ''}
                         text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12 
                         focus:!border-none focus:!ring-transparent active:!ring-transparent active:!border-none`}
                          value={loginData.password}
                          pattern="^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$"
                          onFocus={showPasswordToolTipTrue}
                          onBlur={showPasswordToolTipFalse}
                          onChange={(e) => {
                            const { value } = e.target;
                            // Remove any characters that are not in the allowed set
                            const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
                            setLoginData({ ...loginData, password: sanitizedValue });
                          }}
                        />}

                      {/* Password Input Field for Login Page */}
                      {isLoginPage && !isForgotPasswordPage &&
                        <input placeholder={isForgotPasswordPage ? "New Password" : "Password"}
                          type={showPassword ? "text" : "password"} id="password" name="password"
                          className={`${isLoginPage ?
                            loginError || (loginError && loginData.email.length === 0) ?
                              "border border-red-500" : "" :
                            (isSubmitted && loginData.password === '') ?
                              'border border-red-500' : ''} 
                        text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12 
                        focus:!border-none focus:!ring-transparent active:!ring-transparent active:!border-none`}
                          value={loginData.password}
                          onFocus={showPasswordToolTipTrue}
                          onBlur={showPasswordToolTipFalse}
                          onChange={updateForm}
                        />}
                    </div>


                    {/* Confirm Password Field */}
                    {!isLoginPage && <div className='flex flex-col relative'>
                      <p className='text-red-600 absolute top-0 right-1'>*</p>
                      <img className="hover:cursor-pointer absolute top-3 right-5 aspect-square w-6" src={showConfirmPassword ? "/eye.svg" : "/eye-slash.svg"} alt="eyeball" onClick={handleShowConfirmPassword} />

                      <input placeholder="Re-Type Password" type={showConfirmPassword ? "text" : "password"} id="confirmPassword" name="confirmPassword"
                        className={`${(isSubmitted && loginData.password === '') || (loginData.password !== loginData.confirmPassword) || newPasswordBooleanError ||
                          !/^(?=.*[A-Z])(?=.*\d)(?=.*[?@!#$%^&*])(?!.*[^A-Za-z\d?@!#$%^&*]).{15,}$/.test(loginData.password) && loginData.password.length > 0 ?
                          'border border-red-500' : ''}
                    text-center bg-[#ECF0F1] p-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none h-12 px-12 
                    focus:!border-none focus:!ring-transparent active:!ring-transparent active:!border-none`}
                        value={loginData.confirmPassword}
                        onChange={(e) => {
                          const { value } = e.target;
                          // Remove any characters that are not in the allowed set
                          const sanitizedValue = value.replace(/[^A-Za-z\d?@!#$%^&*]/g, '');
                          setLoginData({ ...loginData, confirmPassword: sanitizedValue });
                        }}
                        onFocus={showPasswordToolTipTrue} onBlur={showPasswordToolTipFalse} />
                    </div>}

                    {!isLoginPage && !isForgotPasswordPage && (
                      <select onChange={(e) => handleSelect(e)}
                        className="w-full text-center bg-[#ECF0F1] pl-4 text-sm text-black mb-4 focus:outline-[#DD8A3E] focus:rounded-none
                   h-12 focus:!border-none focus:!ring-transparent active:!ring-transparent active:!border-none">
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
                    <button type="submit" className="bg-[#DD8A3E] hover:brightness-90 p-4 w-full text-white text-sm font-bold tracking-wide">{
                      !isLoginPage ?
                        isForgotPasswordPage ?
                          "Reset Password" : "Create Account" :
                        "Login"}
                    </button>
                    <p className="text-red-600 text-xs text-end pt-1 openSans">* fields required</p>
                  </div>
                </form>
              </>}
          </div>
        </div>

      </main>
      <FooterComponent />
    </div>
  );
}
