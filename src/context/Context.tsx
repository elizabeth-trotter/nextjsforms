'use client'

import {createContext, useContext, useState} from "react";

interface IContextValue {
    id: number,
    setId: (id: number) => void,
    token: string,
    setToken: (token: string) => void,
    admin: boolean,
    setAdmin: (isAdmin: boolean) => void,
    logout: () => void
}

export const Context = createContext<IContextValue>({} as IContextValue);

export const AppWrapper = ({ children, }: Readonly<{ children: React.ReactNode;}>) => {

    const [token, setToken] = useState<string>("");
    const [admin, setAdmin] = useState<boolean>(true);
    const [id, setId] = useState<number>(0);
    
    const logout = () => {
        setToken("");
        setAdmin(false);
        setId(0);
    }
    return (
        <Context.Provider value={{token, setToken, admin, setAdmin, id, setId, logout }}>
            {children}
        </Context.Provider>
    )
}

export const useAppContext = () => {
    return useContext(Context);
}