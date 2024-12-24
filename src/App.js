import LoginPage from "./Components/LoginPage";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Register from "./Components/Register";
import ForgotPassword from "./Components/ForgotPassword";
import Dashboard from "./Components/Dashboard";
import Account from "./Components/Account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route>
          <Route index element={<LoginPage />} />
          <Route path="Register" element={<Register />} />
          <Route path="ForgotPassword" element={<ForgotPassword />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="/Account/:id" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
