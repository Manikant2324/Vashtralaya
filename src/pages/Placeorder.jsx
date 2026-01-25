import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/frontend-assests/assets";

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-8 pt-5 sm:pt-14">

      {/* ------------ LEFT SIDE ------------ */}
      <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">

        <div className="text-xl sm:text-2xl my-3">
          <Title text1={"DELIVERY"} text2={"INFORMATION"} />
        </div>

        <div className="flex gap-3">
          <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="First name" />
          <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="Last name" />
        </div>

        <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="Email address" />
        <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="Street" />

        <div className="flex gap-3">
          <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="City" />
          <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="State" />
        </div>

        <div className="flex gap-3">
          <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="Zipcode" />
          <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="Country" />
        </div>

        <input className="border-gray-300 border rounded py-1.5 px-3.5 w-full" placeholder="Phone" />
      </div>

      {/* ------------ RIGHT SIDE ------------ */}
      <div className="w-full sm:w-[450px] mt-8 sm:mt-0">

        <CartTotal />

        <div className="mt-12">
          <Title text1={"PAYMENT"} text2={"METHOD"} />

          <div className="flex gap-3 flex-col lg:flex-row mt-4">

            <div onClick={() => setMethod("stripe")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "stripe" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-4" src={assets.stripe_logo} alt="" />
            </div>

            <div onClick={() => setMethod("razorpay")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "razorpay" ? "bg-green-400" : ""}`}></p>
              <img className="h-5 mx-4" src={assets.razorpay_logo} alt="" />
            </div>

            <div onClick={() => setMethod("cod")} className="flex items-center gap-3 border p-2 px-3 cursor-pointer">
              <p className={`min-w-3.5 h-3.5 border rounded-full ${method === "cod" ? "bg-green-400" : ""}`}></p>
              <p className="text-gray-500 text-sm font-medium mx-4">
                CASH ON DELIVERY
              </p>
            </div>

          </div>

          <div className="w-full text-end mt-8">
            <button
              onClick={() => navigate("/Orders")}
              className="bg-black text-white py-2 px-8"
            >
              PLACE ORDER
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PlaceOrder;
