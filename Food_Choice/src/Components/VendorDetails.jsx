import React, { useEffect, useState } from "react";
import axios from "axios";
import Headbar from "./Headbar";

function getVendorNameById(vendorList, V_Id) {
  let vendor = vendorList.find(vendor => vendor.v_ID === V_Id);
  return vendor ? vendor.v_NAME : null; // Return null or handle if v_id is not found
}

function VendorDetails() {
  const [vendor, setVendor] = useState({
    V_Id: null,
    Name: "",
  });
  const [vendorList, setVendorList] = useState([]);
  const [activeImages, setActiveImages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5288/api/Vendor")
      .then((response) => {
        setVendorList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the vendor data!", error);
      });

    axios
      .get("http://localhost:5288/api/ImageUpload/active")
      .then((response) => {
        setActiveImages(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching active images!", error);
      });
  }, []);

  const handleVendorChange = (event) => {
    const selectedVendor = vendorList.find(
      (vendor) => vendor.v_NAME === event.target.value
    );
    if (selectedVendor) {
      setVendor({
        V_Id: selectedVendor.v_ID,
        Name: event.target.value,
      });
    } else {
      setVendor({
        V_Id: null,
        Name: "",
      });
    }
  };

  return (
    <>
      <Headbar />
      <div className="flex flex-col w-screen h-screen items-center justify-center">
        <div
          className="w-11/12 h-3/5 mt-4 p-4 rounded-2xl"
          style={{
            background:
              "linear-gradient(145deg, rgba(173, 216, 230, 0.6), rgba(30, 144, 255, 0.4))",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
          }}
        >
          <table className="w-full">
            <thead className="bg-blue-500 text-white">
              <tr className="text-center">

                <th className="px-4 py-2">Vendor</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Active Status</th>
              </tr>
            </thead>
            <tbody>
              {activeImages.map((image) => (
                <tr key={image.chartId} className="text-center">
                  <td className="px-4 py-2">{getVendorNameById(vendorList, image.vendorId)}</td>
                  <td className="px-4 py-2">
                    <img
                      src={`data:image/jpeg;base64,${image.base64Image}`}
                      alt="chart"
                      className="max-h-20 max-w-20"
                    />
                  </td>
                  <td className="px-4 py-2">{image.activeStatus === "true" ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default VendorDetails;
