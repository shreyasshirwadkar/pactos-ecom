import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User } from "../types/user";

interface NavBarProps {
  user: User;
}

const NavBar: React.FC<NavBarProps> = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full bg-black text-white p-4">
      <div className="flex justify-between items-center">
        <Link className="text-xl font-bold" to="/">
          Marketplace
        </Link>
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
        <div
          className={`md:flex md:items-center md:gap-6 ${
            menuOpen ? "block" : "hidden"
          } w-full md:w-auto`}
        >
          <ul className="flex flex-col md:flex-row md:gap-6">
            <li>
              <Link className="block py-2 md:py-0 hover:text-gray-300" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 md:py-0 hover:text-gray-300"
                to="/add-product"
              >
                Sell Item
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 md:py-0 hover:text-gray-300"
                to="/my-products"
              >
                My Products
              </Link>
            </li>
            <li>
              <Link
                className="block py-2 md:py-0 hover:text-gray-300"
                to="/orders"
              >
                My Orders
              </Link>
            </li>
          </ul>
          <div className="mt-4 md:mt-0 text-white">Welcome, {user.name}</div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
