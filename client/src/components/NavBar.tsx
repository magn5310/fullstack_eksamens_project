"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

function NavBar() {
  const [login, setLogin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <nav className="z-50 flex fixed w-full items-center backdrop-blur-xs justify-between bg-black/20 border-b border-white/10 p-4 text-[#fffffe]">
        <Link href="/" className="place-items-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
          </svg>
          <p>Kebabadvisor</p>
        </Link>
        <div>
          <Input className="placeholder:text-white bg-[#fffffe]/20 rounded-2xl" type="text" placeholder="Search..." />
        </div>
        <div className="flex items-center gap-2">
          {login ? (
            <Link href="/login" className="text-[#fffffe]">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
              </svg>
            </Link>
          ) : (
            <Link href="/login" className="text-[#fffffe]">
              Login
            </Link>
          )}

          <svg onClick={toggleMenu} xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-list cursor-pointer" viewBox="0 0 15 15">
            <path className={`top-line transition-transform duration-300 origin-center ${menuOpen ? "rotate-45 translate-x-[-2.5px] translate-y-[2px]" : ""}`} d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
            <path className={`middle-line transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`} d="M2.5 8a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
            <path className={`bottom-line transition-transform duration-300 origin-center ${menuOpen ? "-rotate-45 translate-x-[-3.3px] -translate-y-[3px]" : ""}`} d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
          </svg>
        </div>
      </nav>

      {/* Overlay */}
      <div className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`} onClick={closeMenu} />

      {/* Side Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-xl border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out ${menuOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-6 pt-20">
          <nav className="space-y-6">
            <Link href="/" className="block text-white text-xl hover:text-white/70 transition-colors" onClick={closeMenu}>
              Home
            </Link>
            <Link href="/list" className="block text-white text-xl hover:text-white/70 transition-colors" onClick={closeMenu}>
              Restaurants
            </Link>
            {/* Login/Profile section */}
            <div className="pt-6 border-t border-white/20">
              {login ? (
                <div className="space-y-4">
                  <Link href="/profile" className="block text-white text-xl hover:text-white/70 transition-colors" onClick={closeMenu}>
                    Profile
                  </Link>
                  <button
                    className="block text-white text-xl hover:text-white/70 transition-colors"
                    onClick={() => {
                      setLogin(false);
                      closeMenu();
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link href="/login" className="block text-white text-xl hover:text-white/70 transition-colors" onClick={closeMenu}>
                  Login / Sign Up
                </Link>
              )}
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default NavBar;
