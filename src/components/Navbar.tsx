"use client";

import Link from "next/link";
import logo from "@/../../public/images/logo-image.png";
import React, { useState, useEffect, ChangeEvent } from "react";
import { IoMdSearch } from "react-icons/io";
import debounce from "lodash/debounce";
import { useSearch } from "@/context/SearchProvider";
import { useAuth } from "@/context/AuthContext";
import { GiHamburgerMenu } from "react-icons/gi";
import { CgMenuMotion } from "react-icons/cg";
import "./Navbar.css";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { IoCartOutline } from "react-icons/io5";

const Navbar: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [showPopup, setShowPopup] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { setSearchQuery } = useSearch();
  const { user, logout } = useAuth();
  const { products } = useCart();

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedSetSearchQuery(event.target.value);
  };

  const debouncedSetSearchQuery = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  useEffect(() => {
    return () => {
      debouncedSetSearchQuery.cancel();
    };
  }, []);

  const totalQuantity = products.reduce(
    (sum, product) => sum + product.quantity,
    0
  );

  return (
    <nav className="navbar">
      <Link href={"/"}>
        <div className="flex items-center justify-between">
          <Image src={logo} width={40} height={40} alt="logo-image" />
          <h2 className="text-blue-700 font-bold text-xl"> ECart</h2>
        </div>
      </Link>
      <div className="search-container">
        <IoMdSearch />
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search..."
          value={inputValue}
          onChange={handleSearchChange}
        />
      </div>
      <div className="hamburger " onClick={toggleMenu}>
        {menuOpen ? <CgMenuMotion /> : <GiHamburgerMenu />}
      </div>
      <ul className={`menu-items ${menuOpen ? "open" : ""}`}>
        <Link href="/">
          <li>Home</li>
        </Link>
        <Link href="/cart">
          <li>
            <span className="flex justify-between items-center">
              <IoCartOutline size={30} /> <span className="bg-red-600 rounded-full px-[5px] -ml-2 -mt-3 text-white">{totalQuantity}</span>
            </span>
          </li>
        </Link>
        <div className="relative">
          {user ? (
            <div className="flex items-center space-x-4">
              <button className="username " onClick={togglePopup}>
                {user.username}
              </button>
              {showPopup && (
                <div className="popup">
                  <button onClick={logout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <li>Login</li>
            </Link>
          )}
        </div>
      </ul>
    </nav>
  );
};

export default Navbar;
