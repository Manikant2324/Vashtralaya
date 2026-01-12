import React, { useState } from "react";

const Login = () => {
  const [currentState, setCurrentState] = useState("Login");
  const onSubmitHandler = async (event) => {
event.preventDefault();

}

  return (
    <div onSubmit={onSubmitHandler} className="flex items-center justify-center min-h-[80vh]">
      <form className="w-[90%] sm:max-w-md border p-6 rounded-md flex flex-col gap-4">

        {/* HEADING */}
        <div className="flex items-center gap-2 mb-2">
          <p className="text-2xl font-semibold">{currentState}</p>
          <hr className="border-none h-[2px] w-8 bg-gray-800" />
        </div>

        {/* NAME FIELD (ONLY FOR SIGN UP) */}
        {currentState === "Sign Up" && (
          <input
            type="text"
            placeholder="Name"
            className="w-full px-3 py-2 border border-gray-300 outline-none"
          />
        )}

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          className="w-full px-3 py-2 border border-gray-300 outline-none"
        />

        {/* PASSWORD */}
        <input
          type="password"
          placeholder="Password"
          className="w-full px-3 py-2 border border-gray-300 outline-none"
        />

        {/* BOTTOM TEXT */}
        <div className="w-full flex justify-between text-sm text-gray-500">
          <p className="cursor-pointer">Forgot your password?</p>

          {currentState === "Login" ? (
            <p
              onClick={() => setCurrentState("Sign Up")}
              className="cursor-pointer"
            >
              Create account
            </p>
          ) : (
            <p
              onClick={() => setCurrentState("Login")}
              className="cursor-pointer"
            >
              Login Here
            </p>
          )}
        </div>

        {/* BUTTON */}
        <button className="bg-black text-white py-2 mt-2">
          {currentState === "Login" ? "Sign In" : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default Login;
