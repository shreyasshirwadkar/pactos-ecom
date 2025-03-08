import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import ProductDetail from "./pages/ProductDetail";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import Orders from "./pages/Orders";
import MyProducts from "./pages/MyProducts";
import { User } from "./types/user";

const App: React.FC = () => {
  const user: User = {
    id: "user123",
    name: "Test User",
  };

  return (
    <Router>
      <div className="App">
        <NavBar user={user} />
        <div className="container mt-4">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/products/:id"
              element={<ProductDetail user={user} />}
            />
            <Route path="/add-product" element={<AddProduct user={user} />} />
            <Route
              path="/edit-product/:id"
              element={<EditProduct user={user} />}
            />
            <Route path="/orders" element={<Orders user={user} />} />
            <Route path="/my-products" element={<MyProducts user={user} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
