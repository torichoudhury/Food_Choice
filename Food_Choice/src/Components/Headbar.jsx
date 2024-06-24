import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Headbar() {
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDropdownItemClick = (path) => {
    navigate(path);
    setDropdownOpen(false); // Close dropdown after navigating
  };

  return (
    <div className="flex items-center justify-between bg-gray-800 p-4 text-white">
      <div>
        <a
          href="https://github.com/torichoudhury"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </div>
      <div className="text-lg flex justify-center h-2/3 w-4/5">
        Welcome, {userName}
      </div>
      <div>
        <ul className="flex justify-between">
          <li>
            <button
              onClick={() => navigate("/home")}
              className="block py-2 px-5 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
            >
              Home
            </button>
          </li>
          <li className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center justify-between w-full py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
            >
              Order{" "}
              <svg
                className={`w-2.5 h-2.5 ${
                  dropdownOpen ? "transform rotate-180" : ""
                } ms-2.5`}
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {/* Dropdown menu */}
            <div
              className={`${
                dropdownOpen ? "block" : "hidden"
              } absolute top-full left-0 mt-1 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow-lg dark:bg-gray-800 dark:divide-gray-600`}
            >
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-400">
                <li>
                  <button
                    onClick={() => handleDropdownItemClick("/order")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    Place Order
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleDropdownItemClick("/orderReport")}
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white w-full text-left"
                  >
                    View Orders
                  </button>
                </li>
              </ul>
            </div>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Headbar;
