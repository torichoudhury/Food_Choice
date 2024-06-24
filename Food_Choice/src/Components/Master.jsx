import React, { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import HeadbarAdmin from "./HeadbarAdmin";

function getVendorNameById(vendorList, V_Id) {
  let vendor = vendorList.find(vendor => vendor.v_ID === V_Id);
  return vendor ? vendor.v_NAME : null; // Return null or handle if v_id is not found
}

function Master() {
  const [vendor, setVendor] = useState({
    V_Id: null,
    Name: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!vendor.V_Id) {
      alert("Please select a vendor");
      return;
    }
    if (!selectedFile) {
      alert("Please select a file to upload");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = () => {
      const base64Image = reader.result.split(",")[1];

      axios
        .post("http://localhost:5288/api/ImageUpload", {
          VendorId: vendor.V_Id,
          ImageData: base64Image,
        })
        .then((response) => {
          alert("File uploaded successfully!");
          // Refresh active images after upload
          axios
            .get("http://localhost:5288/api/ImageUpload/active")
            .then((response) => {
              setActiveImages(response.data);
            })
            .catch((error) => {
              console.error("There was an error fetching active images!", error);
            });
        })
        .catch((error) => {
          alert("There was an error uploading the file.");
          console.error("There was an error uploading the file!", error);
        });
    };
    reader.onerror = (error) => {
      console.error("There was an error reading the file!", error);
      alert("There was an error reading the file.");
    };
  };

  return (
    <>
      <HeadbarAdmin />
      <div className="flex flex-col w-screen h-screen items-center justify-center">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex flex-row mb-4 gap-4">
            <select
              id="vendor-select"
              value={vendor.Name}
              onChange={handleVendorChange}
              className="p-2 pl-10 text-sm text-gray-700"
            >
              <option value="">Select a vendor</option>
              {vendorList.map((vendor) => (
                <option key={vendor.v_ID} value={vendor.v_NAME}>
                  {vendor.v_NAME}
                </option>
              ))}
            </select>

            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              className="p-2 pl-10 text-sm text-gray-700"
            />
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
              <AddIcon />Upload Chart
            </button>
          </div>
        </form>
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
                <th className="px-4 py-2">Vendor ID</th>
                <th className="px-4 py-2">Vendor</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Active Status</th>
              </tr>
            </thead>
            <tbody>
              {activeImages.map((image) => (
                <tr key={image.chartId} className="text-center">
                  <td className="px-4 py-2">{image.vendorId}</td>
                  <td className="px-4 py-2">{getVendorNameById(vendorList, image.vendorId)}</td>
                  <td className="px-4 py-2">
                    <img
                      src={`data:image/jpeg;base64,${image.base64Image}`}
                      alt="chart"
                      className="max-h-20 max-w-11"
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

export default Master;
