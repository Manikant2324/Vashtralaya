import React, { useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/frontend-assests/assets";
import { MdEmail, MdLock } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { ShopContext } from "../../context/ShopContext";

const AdminLogin = () => {
  const { backendUrl, setAdminToken, navigate } = useContext(ShopContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });

      if (response.data.success) {
        toast.success("Admin login successful!");
        setAdminToken(response.data.token);
        navigate("/admin/list");
      } else {
        toast.error(response.data.message || "Invalid admin credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message || "Admin login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center w-full py-12">
      <div className="bg-white shadow-xl rounded-2xl px-8 py-10 max-w-md w-full border border-gray-100 animate-fadeIn">
        <img
          src={assets.logo}
          alt="Vashtralaya Admin Logo"
          className="mx-auto mb-4 w-64 h-auto max-h-24 object-contain"
        />

        <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 tracking-tight">
          Admin Portal Authentication
        </h1>

        <form onSubmit={onSubmitHandler} className="space-y-4">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <MdEmail className="mr-2 text-gray-600 text-lg" /> Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder="admin@vashtralaya.com"
              required
              className="rounded-lg w-full px-4 py-2.5 border border-gray-300 outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
              <MdLock className="mr-2 text-gray-600 text-lg" /> Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder="Enter your admin password"
              required
              className="rounded-lg w-full px-4 py-2.5 border border-gray-300 outline-none focus:ring-2 focus:ring-black text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center justify-center gap-2 mt-4 w-full py-3 px-4 rounded-lg text-white bg-black hover:bg-gray-800 transition-all font-semibold text-sm cursor-pointer disabled:opacity-50"
          >
            <FiLogIn className="text-lg" /> {submitting ? "Authenticating..." : "Login to Admin Panel"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
