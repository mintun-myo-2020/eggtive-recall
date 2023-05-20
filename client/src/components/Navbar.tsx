import { useState } from "react";
import Card from "./card/Card";
import { ICardData } from "../interfaces/interfaces";
import axios from "axios";
import { API_BASE_URL, API_ENDPOINTS } from "../api/endpoints";

type NavbarProps = {
  cards: ICardData[];
};

const cardURL = API_BASE_URL + API_ENDPOINTS.CARDS;


const Navbar: React.FC<NavbarProps> = ({ cards}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = (event: React.MouseEvent<HTMLDivElement>): void => {
    axios
      .post(cardURL, cards)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <nav className="overflow-x-auto bg-gray-800 sticky top-0 z-50">
      <div className=" mx-auto px-2 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
            {/* Logo */}
            <div className="hidden sm:block flex-shrink-0 flex items-center">
              <img
                className="block lg:hidden h-10 w-auto"
                src="/justEggLogo.png"
                alt="Eggtive Logo"
              />
              <img
                className="hidden lg:block h-10 w-auto hover:bg-gray-700 cursor-pointer"
                src="/whiteText.png"
                alt="Eggtive Logo"
              />
            </div>
            <div className="hidden sm:block sm:ml-6 flex items-center h-full">
              <div className="flex space-x-4">
                {/* Navigation Links */}
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium h-full"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium h-full"
                >
                  About
                </a>
                <a
                  href="#"
                  className="flex items-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium h-full"
                >
                  Contact
                </a>
              </div>
            </div>
            <div className="flex items-center saveBtn" onClick={handleSave}>
              <h2>save</h2>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile Navigation Links */}
      <div
        className={`sm:hidden ${isOpen ? "block" : "hidden"}`}
        id="mobile-menu"
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Home
          </a>
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
          >
            Contact
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
