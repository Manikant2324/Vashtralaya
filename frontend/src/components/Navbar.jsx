import { assets } from "../assets/frontend-assests/assets";
import { Link, NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import { ShopContext } from "../context/ShopContext";

function Navbar() {
  const [visible, setVisible] = useState(false);

  const {
    setShowSearch,
    getCartCount,
    navigate,
    token,
    setToken,
    setCartItems,
  } = useContext(ShopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
  };

  return (
    <>
      {/* NAVBAR */}
      <div className="fixed h-28 top-0 left-0 w-full z-50 bg-white shadow-sm">
        <div className="flex items-center justify-between py-0 px-0 font-medium max-w-[1400px] mx-auto">

          {/* LOGO */}
          <Link to="/" className="flex items-center group">
            <img
              src={assets.hello}
              alt="VASHTRALAYA"
              className="w-58 sm:w-44 md:w-52 object-contain
                         transition-transform duration-300
                         group-hover:scale-105 cursor-pointer"
            />
          </Link>

          {/* DESKTOP MENU */}
          <ul className="hidden sm:flex gap-6 text-sm text-gray-700">
            {["/", "/collection", "/about", "/contact"].map((path, i) => (
              <NavLink
                key={i}
                to={path}
                className="flex flex-col items-center gap-1 group"
              >
                <p>
                  {path === "/"
                    ? "HOME"
                    : path.replace("/", "").toUpperCase()}
                </p>
                <hr className="w-0 h-[2px] bg-black border-none transition-all duration-300 group-hover:w-full" />
              </NavLink>
            ))}
          </ul>

          {/* RIGHT ICONS */}
          <div className="flex items-center gap-6">
            {/* SEARCH */}
            <img
              onClick={() => setShowSearch(true)}
              src={assets.search_icon}
              className="w-5 cursor-pointer hover:scale-110 transition"
              alt="search"
            />

            {/* PROFILE */}
            <div className="group relative">
              <img
                onClick={() => (token ? null : navigate("/login"))}
                src={assets.profile_icon}
                className="w-5 cursor-pointer hover:scale-110 transition"
                alt="profile"
              />

              {token && (
                <div className="hidden group-hover:block absolute right-0 pt-4">
                  <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded shadow">
                    <p className="cursor-pointer hover:text-black">My Profile</p>
                    <p
                      onClick={() => navigate("/orders")}
                      className="cursor-pointer hover:text-black"
                    >
                      Orders
                    </p>
                    <p
                      onClick={logout}
                      className="cursor-pointer hover:text-black"
                    >
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* CART */}
            <Link to="/cart" className="relative">
              <img
                src={assets.cart_icon}
                className="w-5 min-w-5"
                alt="cart"
              />
              <p className="absolute -right-2 -bottom-2 w-4 text-center leading-4 bg-black text-white rounded-full text-[8px]">
                {getCartCount()}
              </p>
            </Link>

            {/* MOBILE MENU ICON */}
            <img
              onClick={() => setVisible(true)}
              src={assets.menu_icon}
              alt="menu"
              className="w-5 cursor-pointer sm:hidden"
            />
          </div>
        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 bg-white transition-all duration-300 ${
          visible ? "w-full" : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="flex items-center gap-4 p-4 cursor-pointer"
          >
            <img
              className="h-4 rotate-180"
              src={assets.dropdown_icon}
              alt="back"
            />
            <p>Back</p>
          </div>

          {["/", "/collection", "/about", "/contact"].map((path, i) => (
            <NavLink
              key={i}
              onClick={() => setVisible(false)}
              className="py-3 pl-6 border-b"
              to={path}
            >
              {path === "/"
                ? "Home"
                : path.replace("/", "").toUpperCase()}
            </NavLink>
          ))}
        </div>
      </div>

      {/* SPACER */}
      <div className="h-24"></div>
    </>
  );
}

export default Navbar;
