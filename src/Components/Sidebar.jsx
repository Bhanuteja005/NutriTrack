import { signOut } from "firebase/auth";
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth } from "../config/firebase";
import { useAuth } from '../context/AuthContext.jsx';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userSigned, setUserSigned } = useAuth();

  const logOut = async () => {
    try {
      await signOut(auth);
      setUserSigned(false);
      navigate("/"); // Redirect to login page after logout
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { name: 'Profile', path: '/profile', icon: 'fas fa-user' },
    { name: 'Goals Tracking', path: '/goaltracking', icon: 'fas fa-chart-line' },
    { name: 'Recipes', path: '/recipes', icon: 'fas fa-utensils' },
    { name: 'Bookmarks', path: '/bookmarks', icon: 'fas fa-bookmark' },
    { name: 'Shopping List', path: '/shoppinglist', icon: 'fas fa-shopping-cart' },
  ];

  return (
    <div className="h-screen bg-[#2E8B57] flex flex-col justify-between border-r border-white ">
      <div>
      <div className="font-semibold text-5xl p-5 text-white">NutriTrack</div>  
      <div className="text-sm font-medium text-white px-5 py-1">Your Personal Health Companion</div>
        <div className="pt-[10vh] grid-col-1 text-white text-xl font-medium p-4">
          {menuItems.map((item) => (
            <div
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`py-4 px-4 cursor-pointer border-b border-white ${location.pathname === item.path ? 'bg-white text-[#2E8B57]' : 'hover:bg-white hover:text-[#2E8B57]'}`}
            >
              <i className={item.icon} style={{ marginRight: '10px' }} />
              {item.name}
            </div>
          ))}
        </div>
      </div>
      <div className="text-white text-xl font-medium pb-8 p-4">
        {!userSigned ? (
          <div onClick={() => navigate("/")} className="py-4 px-4 cursor-pointer border-b border-white hover:bg-white hover:text-[#2E8B57]">Login</div>
        ) : (
          <div onClick={logOut} className="py-4 px-4 cursor-pointer border-b border-white hover:bg-white hover:text-[#2E8B57]">Logout</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;