import { ICreateAccount, IUser, ILogin } from "@/Interfaces/Interface";
import { useAppContext } from "@/context/Context";
import { useEffect } from "react";

const url = "https://williamform.azurewebsites.net/";
const data = useAppContext()

export const CreateAccountAPI = async (form: ICreateAccount) => {
  const res = await fetch(url + "User/AddUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(form),
  });
  if (!res.ok) {
    const message = "An error message has occured";
    throw new Error(message);
  }
  const data = await res.json();
  return data;
};

export const GetAllUsersAPI = async () => {
  const promise = await fetch(url + "User/GetAllUsers");
  const data: IUser[] = await promise.json();
  return data;
};

export const LoginAPI = async (login: ILogin) => {
  const res = await fetch(url + "User/AddUser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(login),
  });
  if (!res.ok) {
    const message = "An error message has occured";
    throw new Error(message);
  }
  const data = await res.json();
  return data;
};

export const ForgetPasswordAPI = async (user: string, newPassword: string) => {
  const res = await fetch(url + `User/ResetPassword/${user}/${newPassword}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    const message = "An error message has occured";
    throw new Error(message);
  }
  const data = await res.json();
  return data;
};

export const checkToken = () => {
  let result = false;

  if(data.admin != null){
    result = true;
  }

  return result;
}