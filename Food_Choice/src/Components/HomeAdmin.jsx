import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import HeadbarAdmin from "./HeadbarAdmin";
import { Chart } from "react-google-charts";

export default function HomeAdmin() {
  const [vegCount, setVegCount] = useState(0);
  const [nonVegCount, setNonVegCount] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [users, setUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const navigate = useNavigate();

  const data = [
    ["Type", "Numbers"],
    ["Veg", vegCount],
    ["Non-Veg", nonVegCount],
  ];

  const options = {
    pieHole: 0.3,
    is3D: false,
    legend: "none",
    pieSliceText: "label",
  };

  useEffect(() => {
    axios
      .get("http://localhost:5288/api/order/GetOrderCounts")
      .then((response) => {
        setVegCount(response.data.vegOrderCount);
        setNonVegCount(response.data.nonVegOrderCount);
        setTotalOrders(
          response.data.vegOrderCount + response.data.nonVegOrderCount
        );
      })
      .catch((error) => {
        console.error("There was an error fetching the order counts!", error);
      });

    // Fetch user counts
    axios
      .get("http://localhost:5288/api/Auth/countUsers")
      .then((response) => {
        setTotalUsers(response.data.count);
      })
      .catch((error) => {
        console.error("There was an error fetching the user counts!", error);
      });

    // Fetch user details
    axios
      .get("http://localhost:5288/api/Auth/users")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  return (
    <>
      <HeadbarAdmin />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="relative bg-green-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Veg Count</h2>
            <p className="text-2xl">{vegCount}</p>
          </div>
          <div className="relative bg-red-100 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold">Non-Veg Count</h2>
            <p className="text-2xl">{nonVegCount}</p>
          </div>
          <div
            className="relative bg-blue-100 p-6 rounded-lg shadow-md"
          >
            <h2 className="text-xl font-bold">Total Users</h2>
            <p className="text-2xl">{totalUsers}</p>
          </div>
          <div
            className="relative bg-yellow-100 p-6 rounded-lg shadow-md cursor-pointer"
            onClick={() => navigate("/orderReportAdmin")}
          >
            <h2 className="text-xl font-bold">Total Orders</h2>
            <p className="text-2xl">{totalOrders}</p>
          </div>
        </div>
        <div className="flex flex-row gap-2">
          <div className="w-1/2 mt-4">
            <Chart
              chartType="PieChart"
              data={data}
              width={"100%"}
              height={"400px"}
              options={options}
            />
          </div>
          <div className="bg-cyan-200 shadow-md rounded-lg w-1/2 h-96 mt-4 overflow-y-auto p-4">
            <h2 className="text-xl font-bold mb-4">Users</h2>
            <ul className="flex flex-col gap-2">
              {users.map((user) => (
                <li
                  key={user.uid}
                  className="flex flex-row justify-evenly items-center p-2 bg-white rounded-lg shadow-sm"
                >
                    <p className="font-bold w-1/2 pl-4">Uid:  {user.uid}</p>
                    <p className="w-1/2">UserName:  {user.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
