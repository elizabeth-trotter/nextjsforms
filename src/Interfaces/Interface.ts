export interface ICreateAccount {
    id: number,
    email: string,
    password: string,
    isAdmin: boolean,
}

export interface IForm {
    id: number;
    firstName: string;
    lastName: string;
    address: string;
    phonenumber: string;
    email: string;
    dob: string;
}

export interface IUserForm {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    phonenumber: string;
    dob: string;
    email: string;
    isDeleted: boolean;
}

export interface ILogin {
    email: string,
    password: string
}

export interface IToken {
    token: string | null,
    id: number | null,
    isAdmin: boolean | null
}

export interface IUser {
    id: number;
    firstname: string;
    lastname: string;
    address: string;
    phonenumber: string;
    salt: string;
    hash: string;
    email: string;
    dob: string;
    isAdmin: boolean;
}