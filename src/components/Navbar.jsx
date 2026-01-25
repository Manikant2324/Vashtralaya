import React, { useState } from "react";
import { assets } from "../assets/frontend-assests/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const { setShowSearch, getCartCount } = useContext(ShopContext);

  return (
    <>
      {/* FIXED NAVBAR */}
      <div className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between h-20 px-6 sm:px-10">

          {/* LOGO */}
          <Link to="/" className="flex items-center">
            <img
              src={assets.logo}
              alt="VASHTRALAYA"
              className="w-64 object-contain"
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden sm:flex gap-10 text-sm font-medium tracking-widest text-gray-600">
            {["/", "/collection", "/about", "/contact"].map((path, i) => {
              const labels = ["HOME", "COLLECTION", "ABOUT", "CONTACT"];
              return (
                <NavLink
                  key={i}
                  to={path}
                  className={({ isActive }) =>
                    `relative group ${isActive ? "text-black" : ""}`
                  }
                >
                  {labels[i]}
                  <span className="absolute left-0 -bottom-2 h-[2px] w-0 bg-black transition-all duration-300 group-hover:w-full"></span>
                </NavLink>
              );
            })}
          </ul>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-6">

            {/* SEARCH */}
            <img
              src={assets.search_icon}
              className="w-5 cursor-pointer"
              onClick={() => setShowSearch(true)}
              alt="search"
            />

            {/* PROFILE → DIRECT LOGIN */}
            <Link to="/login">
              <img
                src={assets.profile_icon}
                className="w-5 cursor-pointer"
                alt="profile"
              />
            </Link>

            {/* CART */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className="w-5 cursor-pointer"
                alt="cart"
              />
              <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {getCartCount()}
              </span>
            </Link>

            {/* MOBILE MENU ICON */}
            <img
              src={assets.menu_icon}
              onClick={() => setVisible(true)}
              className="w-5 cursor-pointer sm:hidden"
              alt="menu"
            />
          </div>
        </div>

        {/* MOBILE MENU */}
        <div
          className={`fixed top-0 right-0 h-full bg-white shadow-xl transition-all duration-300 ${
            visible ? "w-full" : "w-0"
          } overflow-hidden`}
        >
          <div className="flex flex-col text-gray-700">

            <div
              onClick={() => setVisible(false)}
              className="flex items-center gap-4 p-5 border-b cursor-pointer"
            >
              <img
                src={assets.dropdown_icon}
                className="h-4 rotate-180"
                alt="back"
              />
              <p className="tracking-widest">BACK</p>
            </div>

            {["/", "/collection", "/about", "/contact"].map((path, i) => {
              const labels = ["HOME", "COLLECTION", "ABOUT", "CONTACT"];
              return (
                <NavLink
                  key={i}
                  to={path}
                  onClick={() => setVisible(false)}
                  className="py-5 pl-8 border-b tracking-widest hover:bg-gray-100"
                >
                  {labels[i]}
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* SPACER */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
