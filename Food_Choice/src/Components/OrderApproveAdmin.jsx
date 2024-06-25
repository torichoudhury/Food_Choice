import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import HeadbarAdmin from "./HeadbarAdmin";

function OrderApproveAdmin() {
  const [orders, setOrders] = useState([]);
  const [ordersView, setOrdersView] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5288/api/order/GetActiveOrders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the orders!", error);
      });
  }, []);

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(
        `http://localhost:5288/api/Order/UpdateOrderStatus/${orderId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: newStatus,
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      axios
        .get("http://localhost:5288/api/order/GetActiveOrders")
        .then((response) => {
          setOrders(response.data);
        })
        .catch((error) => {
          setOrders([]);
        });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    axios
      .get(`http://localhost:5288/api/Order/GetOrderDetails`)
      .then((response) => {
        setOrdersView(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  return (
    <>
      <HeadbarAdmin />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Manage Orders</h1>
        <div className="overflow-x-auto">
          {orders.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="py-2 px-4 border-b">Order ID</th>
                  <th className="py-2 px-4 border-b">Customer Name</th>
                  <th className="py-2 px-4 border-b">Order Date</th>
                  <th className="py-2 px-4 border-b">Vendor Name</th>
                  <th className="py-2 px-4 border-b">Food Code</th>
                  <th className="py-2 px-4 border-b">Current Status</th>
                  <th className="py-2 px-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const vendor = ordersView.find((v) => v.v_ID === order.v_ID);
                  return (
                    <tr
                      className="bg-blue-100 text-center"
                      key={order.ordeR_ID}
                    >
                      <td className="py-2 px-4 border-b">{order.ordeR_ID}</td>
                      <td className="py-2 px-4 border-b">{order.uid}</td>
                      <td className="py-2 px-4 border-b">{order.ordeR_DATE}</td>
                      <td className="py-2 px-4 border-b">
                        {vendor ? vendor.v_NAME : "Unknown"}
                      </td>
                      <td className="py-2 px-4 border-b">{vendor ? vendor.fooD_CODE: "Unknown"}</td>
                      <td className="py-2 px-4 border-b">
                        {order.ordeR_STATUS==1?'Pending':'Not Pending'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        <button
                          className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                          onClick={() => updateOrderStatus(order.ordeR_ID, 2)}
                        >
                          Approve
                        </button>
                        <button
                          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                          onClick={() => updateOrderStatus(order.ordeR_ID, 0)}
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div>No pending orders</div>
          )}
        </div>
      </div>
    </>
  );
}

export default OrderApproveAdmin;
