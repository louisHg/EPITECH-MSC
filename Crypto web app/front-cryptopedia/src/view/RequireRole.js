import React from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from './auth'

export const RequireRole = ({children}) => {
    const navigate = useNavigate()
    var session = JSON.parse(sessionStorage.getItem('sessionObject'));
    if (session == null) {
        role = "";
    }
    else{
        var role = session.SessionData.user
      }
    console.log(session);
    const auth = useAuth()
    if (session == null) {
        auth.user = "";
    } else {
        auth.user = session.SessionData.user_id
    }
    if (!auth.user) {        
        console.log("back log");
       return <Navigate to='/Log'/> 
    }
    if (role == "ADMIN") {  
    } else {
        navigate('/')
    }
    
  return children
}
