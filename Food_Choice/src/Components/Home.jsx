import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Headbar from "./Headbar";

function Home() {
  const [user, setUser] = useState({ name: "", uid: "" });

  useEffect(() => {
    const name = localStorage.getItem("userName");
    const uid = localStorage.getItem("UID");
    if (name && uid) {
      setUser({ name, uid });
    }
  }, []);

  return (
    <>
      <Headbar />
      <div
        className="w-11/12 h-[38rem] mt-12 mx-auto flex items-center justify-center"
        style={{
          background:
            "linear-gradient(145deg, rgba(173, 216, 230, 0.6), rgba(30, 144, 255, 0.4))",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md flex flex-col items-center text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {user.name}</h1>
          <p className="text-2xl text-gray-600 mb-6">UID: {user.uid}</p>
        
        </div>
      </div>
    </>
  );
}

export default Home;
