import React from 'react';
import { NavLink } from 'react-router-dom';
import { assets } from '../../assets/frontend-assests/assets';

const AdminSidebar = () => {
  return (
    <div className="w-[18%] min-h-screen border-r-2 border-gray-200 bg-white"> 
      <div className="flex flex-col gap-4 pt-6 pl-[20%] text-[15px]">
        <NavLink 
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l hover:bg-gray-100 transition" 
          to="/admin/add"
        >
          <img className="w-5 h-5 object-contain" src={assets.quality_icon || assets.search_icon} alt="add_icon" />
          <p className="hidden md:block font-medium">Add Items</p>
        </NavLink>

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l hover:bg-gray-100 transition" 
          to="/admin/list"
        >
          <img className="w-5 h-5 object-contain" src={assets.quality_icon || assets.search_icon} alt="list_icon" />
          <p className="hidden md:block font-medium">List Items</p>
        </NavLink>

        <NavLink 
          className="flex items-center gap-3 border border-gray-300 border-r-0 px-3 py-2 rounded-l hover:bg-gray-100 transition" 
          to="/admin/orders"
        >
          <img className="w-5 h-5 object-contain" src={assets.quality_icon || assets.search_icon} alt="order_icon" />
          <p className="hidden md:block font-medium">Orders</p>
        </NavLink>
      </div>
    </div>
  );
};

export default AdminSidebar;
