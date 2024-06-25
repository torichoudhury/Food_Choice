import React, { useState, useEffect } from "react";
import axios from "axios";
import Headbar from "./Headbar";
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

function OrderReport() {
  const [orders, setOrders] = useState([]);
  const UID = localStorage.getItem("UID");

  useEffect(() => {
    axios
      .get(`http://localhost:5288/api/Order/GetOrderDetailsByID/${UID}`)
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [UID]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(orders.map(order => ({
      "Order Date": new Date(order.ordeR_DATE).toLocaleDateString(),
      "Vendor Name": order.v_NAME,
      "Category": order.catA_NAME,
      "Food Code": order.fooD_CODE,
      "Current Status": order.ordeR_STATUS === 2
        ? "Approved"
        : order.ordeR_STATUS === 0
        ? "Rejected"
        : "Pending"
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([wbout], { type: "application/octet-stream" }), 'OrderReport.xlsx');
  };

  return (
    <>
      <Headbar />
      <div
        className="w-11/12 h-3/5 mt-4 p-4 rounded-2xl mx-auto"
        style={{
          background:
            "linear-gradient(145deg, rgba(173, 216, 230, 0.6), rgba(30, 144, 255, 0.4))",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div className="flex flex-col items-center justify-center">
          <button 
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={exportToExcel}
          >
            Download Excel File
          </button>
          <div className="w-full overflow-x-auto">
            <table className="w-full">
              <thead className="bg-blue-500 text-white">
                <tr className="text-center">
                  <th className="px-4 py-2">Order Date</th>
                  <th className="px-4 py-2">Vendor Name</th>
                  <th className="px-4 py-2">Category</th>
                  <th className="px-4 py-2">Food Code</th>
                  <th className="px-4 py-2">Current Status</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {orders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-3 px-6 whitespace-nowrap">
                      {new Date(order.ordeR_DATE).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      {order.v_NAME}
                    </td>
                    <td className="py-3 px-6 whitespace-nowrap">
                      {order.catA_NAME}
                    </td>
                    <td className="py-3 px-6">{order.fooD_CODE}</td>
                    <td className="py-3 px-6">
                      {order.ordeR_STATUS === 2
                        ? "Approved"
                        : order.ordeR_STATUS === 0
                        ? "Rejected"
                        : "Pending"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderReport;
