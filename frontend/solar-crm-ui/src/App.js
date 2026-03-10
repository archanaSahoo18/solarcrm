import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Users from "./pages/Users";
import Dashboard from "./components/Dashboard";
import Pipeline from "./components/Pipeline";
import AddCustomer from "./components/AddCustomer";

import Layout from "./layout/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout Routes */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/register" element={<Register />} />
          <Route path="/users" element={<Users />} />
          <Route path="/add-customer" element={<AddCustomer />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
}

export default App;