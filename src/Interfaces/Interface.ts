interface IForm {
    firstname: string,
    lastname: string,
    address: string,
    phonenumber: string,
    email: string,
    dob: string,
}

interface ICreateAccount {
    email: string,
    password: string
}

interface IUser {
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