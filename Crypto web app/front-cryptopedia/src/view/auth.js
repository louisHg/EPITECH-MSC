import { useState, useContext, createContext } from "react";

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
    var session = JSON.parse(sessionStorage.getItem('sessionObject'));
    if (session == null) {
        token = "";
        var user = "";
    }
    else{
        var user = session.SessionData.user_id; 
        var token = session.SessionData.token
      }
    const login = (user) => {
        var session = JSON.parse(sessionStorage.getItem('sessionObject'));
        var user = session.SessionData.user_id;     
        console.log(user);
    }

    const logout = () => {
        var user = null;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout}}>
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = () => {
    return useContext(AuthContext)
}