import React, { useState } from "react";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import {FaRandom} from "react-icons/fa";

// Icons for navbar right side
const SearchIcon = () => (
  <SearchBar
    className="w-6 h-6 text-white cursor-pointer"
    placeholder="Search..."
    aria-label="Search"/>
  
);


const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-[#0f111a] p-4 flex items-center justify-between sticky top-0 z-50">
      {/* Left: Hamburger menu and logo */}
      <div className="flex items-center gap-4">
        {/* Hamburger menu icon */}
        <button
          className="text-white focus:outline-none"
          onClick={toggleDropdown}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            viewBox="0 0 24 24"
          >
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* Logo */}
        <Link to="/" className="text-3xl font-extrabold flex items-center gap-1 select-none whitespace-nowrap">
          <span>S</span>
          <span className="text-pink-500">!</span>
          <span>anime</span>
        </Link>
      </div>

      {/* Right: Icons and language toggles */}
      <div className="flex items-center gap-6">
        {/* Icons */}
        <button aria-label="Search" className="hover:opacity-80">
          <SearchIcon />

        </button>

        <Link to="/random" className="hover:opacity-80">
        <FaRandom className="w-6 h-6 text-white cursor-pointer" />
        </Link>
  

        {/* Language toggles */}
        <div className="flex items-center gap-2">
          <button className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-semibold">en</button>
          <button className="bg-gray-700 text-white px-3 py-1 rounded text-xs font-semibold">jp</button>
        </div>

      </div>

      {/* Dropdown menu (optional) */}
      {isDropdownOpen && (
        <div className="absolute top-14 left-4 bg-gray-800 rounded shadow-lg py-2 w-40 z-50 flex flex-col space-y-2">
          <Link
            to="/new-releases"
            className="px-4 py-2 hover:bg-gray-700 text-white font-semibold"
            onClick={() => setIsDropdownOpen(false)}
          >
            NEW RELEASES
          </Link>
          <Link
            to="/updates"
            className="px-4 py-2 hover:bg-gray-700 text-white font-semibold"
            onClick={() => setIsDropdownOpen(false)}
          >
            UPDATES
          </Link>
          <Link
            to="/ongoing"
            className="px-4 py-2 hover:bg-gray-700 text-white font-semibold"
            onClick={() => setIsDropdownOpen(false)}
          >
            ONGOING
          </Link>
          <Link
            to="/recent"
            className="px-4 py-2 hover:bg-gray-700 text-white font-semibold"
            onClick={() => setIsDropdownOpen(false)}
          >
            RECENT
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
