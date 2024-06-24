import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Components/Login";
import Order from "./Components/Order";
import Home from "./Components/Home";
import Master from "./Components/Master";
import OrderReport from "./Components/OrderReport";
import HomeAdmin from "./Components/HomeAdmin";
import OrderApproveAdmin from "./Components/OrderApproveAdmin";
import OrderReportAdmin from "./Components/OrderReportAdmin";
import UserMaster from "./Components/UserMaster";
import VendorDetails from "./Components/VendorDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          exact
          path="/"
          element={
            <div className="bg-blue-500 w-screen h-screen">
              <Login />
            </div>
          }
        />
        <Route
          path="/homeAdmin"
          element={
            <>
              <HomeAdmin />
            </>
          }
        />
        <Route
        path="/orderApproveAdmin"
        element={
          <>
            <OrderApproveAdmin />
          </>
        }
      />
      <Route
        path="/orderReportAdmin"
        element={
          <>
            <OrderReportAdmin />
          </>
        }
      />
        <Route
          path="/home"
          element={
            <>
              <Home />
            </>
          }
        />
        <Route
          path="/master"
          element={
            <>
              <Master />
            </>
          }
        />
        <Route
          path="/userMaster"
          element={
            <>
              <UserMaster />
            </>
          }
        />
        <Route
          path="/orderReport"
          element={
            <>
              <OrderReport />
            </>
          }
        />
         <Route
          path="/vendorDetails"
          element={
            <>
              <VendorDetails />
            </>
          }
        />
        <Route
          path="/order"
          element={
            <>
              <Order />
            </>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
