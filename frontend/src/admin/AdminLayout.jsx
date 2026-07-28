import React, { useContext } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';
import AdminSidebar from './components/AdminSidebar';
import AdminLogin from './pages/AdminLogin';
import { assets } from '../assets/frontend-assests/assets';
import { FiLogOut, FiShoppingBag } from 'react-icons/fi';

const AdminLayout = () => {
  const { adminToken, adminLogout } = useContext(ShopContext);
  const navigate = useNavigate();

  if (!adminToken) {
    return <AdminLogin />;
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Integrated Admin Header */}
      <div className="flex items-center py-4 px-[4%] justify-between bg-white border-b border-gray-200 sticky top-0 z-40 shadow-xs">
        <div className="flex items-center gap-6 sm:gap-10">
          <Link to="/" className="flex items-center group py-1 overflow-visible">
            <img 
              className="h-16 sm:h-20 md:h-24 w-auto object-contain max-w-none transform sm:scale-125 origin-left transition-transform duration-300 group-hover:scale-130 cursor-pointer" 
              src={assets.logo} 
              alt="Vashtralaya Logo" 
            />
          </Link>
          <span className="bg-black text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest shadow-xs">
            Admin Panel
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 border border-gray-300 text-gray-700 px-4 py-2 rounded-full text-xs font-semibold hover:bg-gray-100 transition cursor-pointer"
          >
            <FiShoppingBag className="text-sm" />
            View Store Frontend
          </button>

          <button
            onClick={adminLogout}
            className="flex items-center gap-2 bg-black text-white px-5 py-2 rounded-full text-xs font-semibold hover:bg-gray-800 transition cursor-pointer"
          >
            <FiLogOut className="text-sm" />
            Admin Logout
          </button>
        </div>
      </div>

      <div className="flex w-full">  
        <AdminSidebar />        

        <div className="w-[78%] mx-auto ml-[max(3vw,15px)] my-8 text-gray-600 text-base pr-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
