import React from 'react'
import { Input } from "@/components/ui/input";
import Link from "next/link";

function NavBar() {
  return (
    <nav className="z-50 flex fixed w-full items-center backdrop-blur-xs justify-between bg-black/20 border-b border-white/10 p-4 text-[#fffffe]">
      <div className="place-items-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>
        Kebabadvisor
      </div>
      <div>
        <Input className="placeholder:text-white bg-[#fffffe]/20 rounded-2xl" type="text" placeholder="Search..." />
      </div>
      <div className="flex items-center gap-2">
        <Link href="/login" className="text-[#fffffe]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-person-fill" viewBox="0 0 16 16">
            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
          </svg>
        </Link>
        <Link href="/register" className="text-[#fffffe] hover:text-[#f45d48]">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-list" viewBox="0 0 16 16">
            <path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" />
          </svg>
        </Link>
      </div>
    </nav>
  );
}

export default NavBar
