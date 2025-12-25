import React, { useState, useEffect } from "react";
import { Bell, ShoppingCart, X, Search, User } from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 

const Navbar = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
//   const role = getUserRole();
//   const loggedIn = isLoggedIn();

//   // Fetch logged-in user profile
//   const fetchUser = async () => {
//     try {
//       const token = getToken();
//       if (!token) return;

//       const res = await axios.get("http://localhost:3000/user/me", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       console.log("User object:", user);

//       setUser(res.data);
//     } catch (err) {
//       console.error("Fetch user error:", err);
//     }
//   };

//   // Fetch notifications for the user
//   const fetchNotifications = async () => {
//     try {
//       const token = getToken();
//       if (!token) return;

//       const res = await axios.get("http://localhost:3000/notifications", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setNotifications(res.data);
//     } catch (err) {
//       console.error("Fetch notifications error:", err);
//     }
//   };

//   useEffect(() => {
//     if (loggedIn) fetchUser();
//   }, [loggedIn]);

//   useEffect(() => {
//     if (user) fetchNotifications();
//   }, [user]);

//   const handleSearch = (e) => {
//     e.preventDefault();
//     if (!searchQuery.trim()) return;
//     navigate(`/search?q=${searchQuery}`);
//     setSearchQuery("");
//   };

  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">

        {/* Left - Greeting */}
        <h1 className="text-2xl font-bold text-gray-800">
          Hello, <span className="text-amber-500">User</span>
        </h1>

        {/* Center - Search */}
        <form
        //   onSubmit={handleSearch}
          className="flex items-center bg-white border border-gray-200 rounded-full px-4 py-2 shadow-sm"
        >
          {/* <Search className="w-4 h-4 text-gray-400 mr-3" /> */}
          <input
            type="text"
            placeholder="Search food or restaurants"
            // value={searchQuery}
            // onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-sm text-gray-700"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-1.5 rounded-full text-sm hover:bg-amber-600 transition"
          >
            Search
          </button>
        </form>

        {/* Right - Actions */}
        <div className="flex items-center space-x-5">

          {/* Notifications */}
          {/* {loggedIn && user && (
            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
              >
                <Bell className="w-6 h-6 text-gray-700" />
                {notifications.some((n) => n.new) && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <div className="flex justify-between items-center p-3 border-b border-gray-100">
                    <h3 className="text-lg font-semibold">Notifications</h3>
                    <button onClick={() => setIsNotificationOpen(false)}>
                      <X className="w-5 h-5 text-gray-500 hover:text-black" />
                    </button>
                  </div>

                  <ul className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 && (
                      <li className="p-3 text-gray-500 text-sm">
                        No notifications
                      </li>
                    )}
                    {notifications.map((note) => (
                      <li
                        key={note._id || note.id}
                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          note.new ? "bg-gray-50" : ""
                        }`}
                      >
                        <p className="text-sm">{note.message}</p>
                        <span className="text-xs text-gray-400">{note.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )} */}

          {/* Cart */}
          {/* {(!loggedIn || role === "user") && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <ShoppingCart className="w-6 h-6 text-gray-700" />
            </button>
          )} */}

          {/* Profile / Signup */}
          {/* {!loggedIn ? (
            <Link
              to="/auth"
              className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-600 transition"
            >
              Signup
            </Link>
          ) : (
            <button
              onClick={() => navigate("/settings")}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <User className="w-6 h-6 text-gray-700" />
            </button>
          )} */}
          <Link
              to="/auth"
              className="bg-yellow-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-yellow-600 transition"
            >
              Signup
            </Link>
        </div>
      </div>

      {/* Cart Modal */}
      {/* {isCartOpen && <Cart setIsCartOpen={setIsCartOpen} />} */}
    </header>
  );
};

export default Navbar;
