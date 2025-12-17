import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/frontend-assests/assets";
import { Link, NavLink } from "react-router-dom";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  // outside click pe profile close
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative z-50 bg-white shadow-sm">

      <div className="flex items-center justify-between h-20 px-6 sm:px-10">

        {/* LOGO ONLY (TEXT REMOVED, LOGO BIG) */}
        <Link to="/" className="flex items-center">
          <img
            src={assets.logo}
            alt="VASHTRALAYA"
            className="w-80 h-50 object-contain"
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
            className="w-5 cursor-pointer hover:scale-110 transition"
            alt="search"
          />

          {/* PROFILE (CLICK BASED) */}
          <div ref={profileRef} className="relative">
            <img
              src={assets.profile_icon}
              className="w-5 cursor-pointer"
              alt="profile"
              onClick={() => setProfileOpen(!profileOpen)}
            />

            {profileOpen && (
              <div className="absolute right-0 mt-4 w-44 bg-white border rounded-xl shadow-lg">
                <Link
                  to="/profile"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-gray-100 rounded-t-xl"
                >
                  My Profile
                </Link>
                <Link
                  to="/orders"
                  onClick={() => setProfileOpen(false)}
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Orders
                </Link>
                <button
                  onClick={() => setProfileOpen(false)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-gray-100 rounded-b-xl"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* CART */}
          <Link to="/cart" className="relative">
            <img
              src={assets.cart_icon}
              className="w-5 cursor-pointer"
              alt="cart"
            />
            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
              12
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
  );
};

export default Navbar;
