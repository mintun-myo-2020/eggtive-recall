"use client";

import { useState } from "react";

import { useAuthState } from "react-firebase-hooks/auth";

import Image from "next/image";

import { API_BASE_URL, API_ENDPOINTS } from "@/utils/api/endpoints";
import { auth, logout } from "../../utils/firebase";
import Link from "next/link";

type NavbarProps = {};

const cardURL = API_BASE_URL + API_ENDPOINTS.CARDS;

const Navbar: React.FC<NavbarProps> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, loading, error] = useAuthState(auth);

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
            <Link href="/home">
              <div className="hidden sm:block flex-shrink-0 items-center">
                <img
                  className="block lg:hidden h-10 w-auto"
                  src="/justEggLogo.png"
                  alt="Eggtive Logo"
                />
                <Image
                  className="hidden lg:block h-10 w-auto hover:scale-105 active:scale-95 cursor-pointer"
                  src="/whiteText.png"
                  height={40}
                  width={40}
                  alt="Eggtive Logo"
                  unoptimized={true}
                />
              </div>
            </Link>
            <div className="hidden sm:block sm:ml-6 items-center h-full">
              <div className="flex space-x-4">
                {/* Navigation Links */}
                <Link href="/home" className="navBtn">
                  Home
                </Link>
                <Link href="/about" className="navBtn">
                  About
                </Link>
                <Link href="/board" className="navBtn">
                  Board
                </Link>
                <Link href="/notebook" className="navBtn">
                  Notebook
                </Link>
              </div>
            </div>

            <div className="flex items-center ml-auto">
              {user?.emailVerified ? (
                <Link href="/home">
                  <button
                    className="flex items-center saveBtn"
                    onClick={logout}
                  >
                    <h2>Logout</h2>
                  </button>
                </Link>
              ) : (
                <Link href="/users/login">
                  <button className="flex items-center saveBtn">
                    <h2>Login</h2>
                  </button>
                </Link>
              )}
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
          <Link href="/home" className="miniNavBtn">
            Home
          </Link>
          <Link href="/about" className="miniNavBtn">
            About
          </Link>
          <Link href="/board" className="miniNavBtn">
            Board
          </Link>
          <Link href="/notebook" className="miniNavBtn">
            Notebook
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
