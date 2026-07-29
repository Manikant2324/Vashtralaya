import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "../context/ShopContext";
import Title from "../components/Title";
import axios from "axios";
import { toast } from "react-toastify";

import { PageLoader } from "../components/Loader";

const Profile = () => {
  const { token, backendUrl, navigate } = useContext(ShopContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      toast.error("Please login to view profile");
      navigate("/login");
      return;
    }

    fetchProfile();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.post(
        backendUrl + "/api/user/profile",
        {},
        { headers: { token } }
      );

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        toast.error(response.data.message || "Failed to fetch profile");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message || "Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return null;
  }

  if (loading) {
    return <PageLoader text="Loading Profile Information..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <p className="text-center text-gray-600">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="border-t pt-16 min-h-screen">
      <div className="text-2xl mb-8">
        <Title text1={"MY"} text2={"PROFILE"} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        {/* Profile Information */}
        <div className="border rounded-lg p-6 bg-gray-50 shadow-md">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Personal Information
          </h3>

          <div className="space-y-6">
            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Full Name
              </p>
              <p className="text-gray-800 font-medium text-base">{user.name}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">Email</p>
              <p className="text-gray-800 font-medium text-base">{user.email}</p>
            </div>

            <div>
              <p className="text-gray-600 text-sm font-medium mb-1">
                Member Since
              </p>
              <p className="text-gray-800 font-medium text-base">
                {user.createdAt
                  ? new Date(user.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="border rounded-lg p-6 bg-gray-50 shadow-md">
          <h3 className="text-lg font-semibold mb-6 text-gray-800">
            Account Actions
          </h3>

          <div className="space-y-4">
            <button
              onClick={() => navigate("/orders")}
              className="w-full bg-black text-white py-3 px-4 rounded-lg hover:bg-gray-800 transition font-medium"
            >
              View My Orders
            </button>

            <button
              onClick={() => navigate("/cart")}
              className="w-full border-2 border-black text-black py-3 px-4 rounded-lg hover:bg-gray-100 transition font-medium"
            >
              View Shopping Cart
            </button>

            <button
              onClick={() => navigate("/collection")}
              className="w-full border-2 border-gray-300 text-gray-800 py-3 px-4 rounded-lg hover:border-gray-400 transition font-medium"
            >
              Continue Shopping
            </button>

            <button
              onClick={() => {
                localStorage.removeItem("token");
                sessionStorage.removeItem("token");
                navigate("/login");
                toast.success("Logged out successfully");
              }}
              className="w-full border-2 border-red-500 text-red-500 py-3 px-4 rounded-lg hover:bg-red-50 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
