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
        className="w-11/12 h-[38rem] mt-12 ml-16 flex items-center justify-center relative"
        style={{
          background:
            "linear-gradient(145deg, rgba(173, 216, 230, 0.6), rgba(30, 144, 255, 0.4))",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="bg-white shadow-lg rounded-lg p-4 w-full h-3/4 m-20 flex flex-col justify-between relative">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{user.name}</h1>
            <p className="text-2xl text-gray-600">Your UID: {user.uid}</p>
          </div>
          <div className="absolute bottom-6 right-4">
            <Link
              to="/orders"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md"
            >
              Go to Orders
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
