import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";

import { Routes, Route } from "react-router-dom";


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from "./pages/Login";




export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = '₹';




const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") 
  ? localStorage.getItem("token") 
  : "");


  useEffect(() =>{
    localStorage.setItem("token", token);
  },[token])


  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {token === "" ? 
        <Login setToken={setToken} />
       : 
        <>
          <Navbar setToken={setToken} />
          <hr />
          <div className="flex w-full">          

            <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
              <Routes>
               
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default App;