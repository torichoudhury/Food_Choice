import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [UserID, setUserID] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:5288/api/Auth/login", {
        uid: UserID,
        password: password,
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        if (data.token) {
          // On successful login
          localStorage.setItem("token", data.token);
          localStorage.setItem("userName", data.name);
          localStorage.setItem("UID", UserID);

          // Check user role and redirect accordingly
          if (data.userType == "Admin") {
            navigate("/homeAdmin");
          } else {
            navigate("/home");
          }
        } else {
          // On unsuccessful login
          alert("Login failed: " + (data.message || "Unknown error"));
        }
      })
      .catch((error) => {
        // Handle error
        console.error("Error:", error);
        alert("An error occurred during login.");
      });
  };

  return (
    <div className="absolute flex flex-col justify-center items-center md:flex-row w-full md:w-[800px] h-auto md:h-[500px] ml-auto md:ml-[400px] mt-30 md:mt-20 gap-6">
      <form
        action="POST"
        onSubmit={handleSubmit}
        className="w-full md:w-11/12 max-w-[600px] p-10 bg-cyan-100 rounded-lg shadow-md"
      >
        <div className="mt-4">
          <div className="flex flex-col">
            <label className="text-lg font-medium text-black">UserID</label>
            <input
              id="UserID"
              name="UserID"
              type="text"
              required
              value={UserID}
              onChange={(e) => setUserID(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl p-1 mt-1 text-lg bg-transparent"
              placeholder="Enter your UserID"
              minLength={3}
            />
          </div>
          <div className="flex flex-col mt-4">
            <label className="text-lg font-medium text-black">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-gray-100 rounded-xl p-1 mt-1 bg-transparent text-lg"
              placeholder="Enter your password"
              minLength={8}
              required
            />
          </div>
          <div className="mt-4 flex flex-col gap-y-4">
            <button
              type="submit"
              className="active:scale-[.98] active:duration-75 transition-all hover:scale-[1.01] ease-in-out transform py-2 bg-violet-500 rounded-xl text-white font-bold text-lg"
            >
              Log In
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
