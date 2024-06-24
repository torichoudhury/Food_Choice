import React, { useState, useEffect } from "react";
import axios from "axios";
import Food from "./Food";
import AddIcon from "@mui/icons-material/Add";
import Headbar from "./Headbar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function Order() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [vendor, setVendor] = useState({
    V_Id: null,
    Name: "",
  });
  const [category, setCategory] = useState({
    C_Id: null,
    C_Name: "",
  });
  const [foodCode, setFoodCode] = useState({
    F_Id: null,
    F_Name: "",
  });
  const [image, setImage] = useState("");
  const [food, setFood] = useState([]);
  const [vendorList, setVendorList] = useState([]);
  const [foodCodeList, setFoodCodeList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const UID = localStorage.getItem("UID");

  //Vendor
  useEffect(() => {
    axios
      .get("http://localhost:5288/api/Vendor")
      .then((response) => {
        setVendorList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the vendor data!", error);
      });
  }, []);

  //Catagory
  useEffect(() => {
    axios
      .get("http://localhost:5288/api/Category")
      .then((response) => {
        setCategoryList(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the category data!", error);
      });
  }, []);

  //menu image
  useEffect(() => {
    if (vendor.V_Id) {
      axios
        .get(
          `http://localhost:5288/api/ImageUpload/active/vendor/${vendor.V_Id}`
        )
        .then((response) => {
          if (response.data[0] != null) {
            setImage(response.data[0].base64Image);
          }
        })
        .catch((error) => {
          console.error("There was an error fetching the food codes!", error);
        });
    }
  }, [vendor]);

  //food code dependent on vendor and catagory
  useEffect(() => {
    if (category.C_Id && vendor.V_Id) {
      axios
        .get(
          `http://localhost:5288/api/Food/GetFoodCodes?vendorId=${vendor.V_Id}&categoryId=${category.C_Id}`
        )
        .then((response) => {
          setFoodCodeList(response.data);
        })
        .catch((error) => {
          console.error("There was an error fetching the food codes!", error);
        });
    }
  }, [category, vendor]);

  //food code
  useEffect(() => {
    setFoodCode({
      F_Id: null,
      F_Name: "",
    }); // Reset food code when vendor or category changes
  }, [vendor, category]);

  useEffect(() => {
    setImage("");
  }, [vendor]);

  function deleteFood(id) {
    setFood((prevFood) => prevFood.filter((foodItem, index) => index !== id));
  }

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

  const handleCategoryChange = (event) => {
    const selectedCategory = categoryList.find(
      (category) => category.catA_NAME === event.target.value
    );
    if (selectedCategory) {
      setCategory({
        C_Id: selectedCategory.c_ID,
        C_Name: event.target.value,
      });
    } else {
      setCategory({
        C_Id: null,
        C_Name: "",
      });
    }
  };

  const handleFoodCodeChange = (event) => {
    const selectedFood = foodCodeList.find(
      (food) => food.fooD_CODE === event.target.value
    );
    if (selectedFood) {
      setFoodCode({
        F_Id: selectedFood.id,
        F_Name: event.target.value,
      });
    } else {
      setFoodCode({
        F_Id: null,
        F_Name: "",
      });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!selectedDate || !vendor.V_Id || !category.C_Id || !foodCode.F_Id) {
      alert("All fields are required!");
      return;
    }
    const formattedDate = selectedDate.toLocaleDateString("en-CA"); // Format as YYYY-MM-DD
    const newFoodItem = {
      date: formattedDate,
      vendor: vendor.Name,
      category: category.C_Name,
      foodCode: foodCode.F_Name,
      v_ID: vendor.V_Id,
      c_ID: category.C_Id,
      f_MENU_ID: foodCode.F_Id,
      ordeR_DATE: formattedDate,
      createD_DATE: formattedDate,
    };
    
    setFood((prevFood) => {
      // Check if the formattedDate already exists in the current state
      const dateExists = prevFood.some(item => item.date === formattedDate);
    
      if (dateExists) {
        // If the date exists, display an error and return the previous state
        alert('Same order date');
        return prevFood;
      } else {
        // If the date is unique, add the new item to the state
        return [...prevFood, newFoodItem];
      }
    });
    
    setSelectedDate(null);
    setVendor({ V_Id: null, Name: "" });
    setCategory({ C_Id: null, C_Name: "" });
    setFoodCode({ F_Id: null, F_Name: "" });
  };

  const handleAddOrder = (event) => {
    event.preventDefault();

    const orderData = food.map((foodItem) => ({
      uid: UID,
      v_ID: foodItem.v_ID,
      c_ID: foodItem.c_ID,
      f_MENU_ID: foodItem.f_MENU_ID,
      ordeR_DATE: foodItem.ordeR_DATE,
      createD_DATE: foodItem.createD_DATE,
    }));
    console.log(orderData);

    axios
      .post("http://localhost:5288/api/Order/AddOrder", orderData)
      .then((response) => {
        alert("Success");
        setFood([]);
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          if (
            error.response.data ===
            "One or more orders with the same ORDER_DATE and UID already exist."
          ) {
            alert(
              "An order with the same date and user already exists. Please choose a different date or modify your order."
            );
          } else {
            alert(
              "There was an error submitting the order: " + error.response.data
            );
          }
        } else {
          console.error("There was an error submitting the order!", error);
          alert("An unexpected error occurred. Please try again later.");
        }
      });
  };

  return (
    <>
      <Headbar />
      <div className="flex flex-col w-screen h-screen items-center justify-center">
        <div class="overflow-y-auto h-80 w-screen hover:overflow-scroll flex items-center justify-center m-8">
          {!image ? (
            ""
          ) : (
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt="chart"
              className="max-h-50 max-w-50"
            />
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex mb-4 gap-4">
            <div className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
              <DatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                minDate={new Date()}
                dateFormat="dd-MM-yyyy"
                className="w-full bg-transparent text-gray-700"
                placeholderText="Select date"
              />
            </div>

            <input
              className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={vendor.Name}
              onChange={handleVendorChange}
              list="vendor"
              placeholder="Choose a Vendor"
            />

            <input
              className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={category.C_Name}
              onChange={handleCategoryChange}
              list="category"
              placeholder="Choose a Category"
            />

            <input
              className="shadow appearance-none border rounded w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              value={foodCode.F_Name}
              onChange={handleFoodCodeChange}
              list="foodCode"
              placeholder="Food Code"
            />

            <button
              type="submit"
              className="flex items-center justify-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              <AddIcon />
            </button>
          </div>

          <datalist id="vendor">
            {vendorList.map((vendor, index) => (
              <option key={index} value={vendor.v_NAME} />
            ))}
          </datalist>

          <datalist id="category">
            {categoryList.map((category, index) => (
              <option key={index} value={category.catA_NAME} />
            ))}
          </datalist>

          <datalist id="foodCode">
            {foodCodeList.map((food, index) => (
              <option key={index} value={food.fooD_CODE} />
            ))}
          </datalist>

          <button
            onClick={handleAddOrder}
            type="submit"
            className="fixed bottom-4 right-4 bg-purple-600 hover:bg-violet-800 text-white font-bold py-2 px-4 rounded"
          >
            Submit
          </button>
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
                <th className="px-4 py-2">Day</th>
                <th className="px-4 py-2">Vendor</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Food Code</th>
                <th className="px-4 py-2"> </th>
              </tr>
            </thead>

            <tbody className="text-center">
              {food.map((foodItem, index) => (
                <Food
                  key={index}
                  id={index}
                  day={foodItem.date}
                  vendor={foodItem.vendor}
                  category={foodItem.category}
                  foodCode={foodItem.foodCode}
                  onDelete={deleteFood}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default Order;
