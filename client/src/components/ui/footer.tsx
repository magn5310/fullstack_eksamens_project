import { faBatteryFull } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-black text-gray-300 py-6 px-6">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} <strong>Batteri Bois</strong>. All rights reserved.
        </p>
        <p className="text-xs mt-2 text-gray-400">
          Crafted with care using React, Tailwind CSS, and a hint of caffeine <FontAwesomeIcon icon={faBatteryFull} className="inline-block w-4 h-4 text-green-400 ml-1" />
        </p>
      </div>
    </footer>
  );
}
