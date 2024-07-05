import SideBarLink from './sideBar'
import "../App.css";
import SideUser from './Sideuser';
import React from 'react';
import axios from "axios";
import  { Navigate, useNavigate } from 'react-router-dom'
var state = {
  email: '',
  password: '',
  username: '',
  role: 'USER',
  firstName: '',
  lastName: ''
};

function handleChange(e){
  if (e.target.type == "email") {
    state.email = e.target.value;
  }
  else if (e.target.type == "password") {
    state.password = e.target.value;
    
  }
  else if (e.target.name == "username") {
    state.username = e.target.value;
    console.log("dddd");
    
  }
  else if (e.target.name == "firstName") {
    state.firstName = e.target.value;
    
  }
  else if (e.target.name == "lastName") {
    state.lastName = e.target.value;
    
  }
 };

function handleSubmit(event) {
  event.preventDefault();

  axios.post(`http://localhost:8081/cryptopedia/auth/register`, state )
    .then(res => {
      window.location.href = "/Log";

    })
    .catch(function (err) {
      if (err.response) {
          console.log(err.response.data.message);
          alert(err.response.data.message);
      }
  })
}

function Register() {
  const navigate = useNavigate()
  
  const handleClick = () => {
    navigate("/Log")
  }
    return (
        <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <img
              className="mx-auto h-12 w-auto"
              src= {require('../add/logoCrypto.png')}
              alt="CryptoPedia"
            />
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign up to your account</h2>
          </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
             {/* last name _first name UserName  */}
              <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="lastName"
                      name="lastName"
                      type="lastName"
                      autoComplete="lastName"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={handleChange}
                    />
                  </div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    First Name 
                  </label>
                  <div className="mt-1">
                    <input
                      id="firstName"
                      name="firstName"
                      type="firstName"
                      autoComplete="firstName"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={handleChange}
                    />
                  </div>

                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                    userName
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="username"
                      autoComplete="username"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={handleChange}
                    />
                  </div>
                </div>
                {/* Password and email  */}
                <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={handleChange}
                    />
                  </div>

                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      onChange={handleChange}

                    />
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
  
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                </div>
                <div className='center'>
                  <button onClick={handleClick}>
                    Sign-In
                  </button>
                </div>
              </div>
            </div>
          </div>
    </div>
    )
  }
 export default Register 
  