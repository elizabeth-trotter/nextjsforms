export interface ICreateAccount {
    id: number,
    email: string,
    password: string,
    isAdmin: boolean,
}

export interface IForm {
    firstname: string;
    lastname: string;
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
    token: string,
    id: number,
    isAdmin: boolean
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