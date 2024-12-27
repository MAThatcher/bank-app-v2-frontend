import LoginPage from "./Components/LoginPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/Dashboard";
import Footer from "./Components/Footer";
import Header from "./Components/Header"
import AccountDetails from "./Components/AccountDetails";

function App() {
  return (
    <BrowserRouter>
    {/*<Header />*/}
      <Routes>
        <Route>
          <Route index element={<LoginPage />} />
          <Route path="Register" element={<Register />} />
          <Route path="ForgotPassword" element={<ForgotPassword />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="/account/:accountId" element={<AccountDetails />} />
          
        </Route>
      </Routes>
      {/*<Footer /> */}
    </BrowserRouter>
  );
}

export default App;
