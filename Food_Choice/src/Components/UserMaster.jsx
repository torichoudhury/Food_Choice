import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadbarAdmin from "./HeadbarAdmin";

const UserMaster = () => {
  const [userDetails, setUserDetails] = useState({
    uid: "",
    password: "",
    confirmPassword: "",
    name: "",
    useR_TYPE: "", // e.g., "Admin" or "User"
  });
  const [isNameValid, setIsNameValid] = useState(true); // State to track name validity
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validate user name to disallow special characters
    if (name === "name" && /[^\w\s]/.test(value)) {
      setIsNameValid(false);
    } else {
      setIsNameValid(true);
    }

    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const validatePassword = (password) => {
    // Regex to enforce password complexity
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (userDetails.password !== userDetails.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!validatePassword(userDetails.password)) {
      alert("Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.");
      return;
    }

    if (!isNameValid) {
      alert("User name should not contain special characters.");
      return;
    }

    axios
      .post("http://localhost:5288/api/Auth/signup", {
        uid: userDetails.uid,
        password: userDetails.password,
        name: userDetails.name,
        useR_TYPE: userDetails.useR_TYPE,
      })
      .then((response) => {
        alert("Registration successful!");
        navigate("/homeAdmin");
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("An error occurred during registration.");
      });
  };

  return (
    <>
      <HeadbarAdmin />
      <div className="flex flex-col justify-center items-center w-full h-auto mt-20 gap-6">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg p-10 bg-cyan-100 rounded-lg shadow-md"
        >
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-black">User ID</label>
            <input
              id="uid"
              name="uid"
              type="text"
              required
              value={userDetails.uid}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 rounded-xl p-1 mt-1 text-lg bg-transparent"
              placeholder="Enter your User ID"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-black">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={userDetails.password}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 rounded-xl p-1 mt-1 text-lg bg-transparent"
              placeholder="Enter your password"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-black">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              value={userDetails.confirmPassword}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 rounded-xl p-1 mt-1 text-lg bg-transparent"
              placeholder="Confirm your password"
            />
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-black">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={userDetails.name}
              onChange={handleChange}
              className={`w-full border-2 border-gray-100 rounded-xl p-1 mt-1 text-lg bg-transparent ${
                !isNameValid ? 'border-red-500' : ''
              }`}
              placeholder="Enter your name"
            />
            {!isNameValid && (
              <p className="text-sm text-red-500 mt-1">
                User name should not contain special characters.
              </p>
            )}
          </div>
          <div className="flex flex-col mb-4">
            <label className="text-lg font-medium text-black">User Type</label>
            <select
              id="useR_TYPE"
              name="useR_TYPE"
              required
              value={userDetails.useR_TYPE}
              onChange={handleChange}
              className="w-full border-2 border-gray-100 rounded-xl p-1 mt-1 text-lg bg-transparent"
            >
              <option value="" disabled>Select user type</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="w-full py-2 bg-violet-500 rounded-xl text-white font-bold text-lg"
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default UserMaster;
