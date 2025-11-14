import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Ticket,CircleUserRound, Users } from "lucide-react";

export default function Header() {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-white/60 text-white"
      : "text-white hover:bg-red-700";

  return (
    <header className="bg-[#D62828] text-white h-16 flex items-center justify-between pl-4 py-0 shadow-md">
      <h1 className="font-bold text-lg">R.BEST PARKING</h1>

      <nav className="flex h-full">
        <Link
          to="/dash"
          className={`flex justify-center items-center h-full px-5 py-2 text-sm font-semibold transition-colors ${isActive(
            "/dash"
          )}`}
        >
          <Ticket />
        </Link>

        <Link
          to="/abonados"
          className={`flex justify-center items-center px-5 py-2 text-sm font-semibold transition-colors ${isActive(
            "/abonados"
          )}`}
        >
          <Users />
        </Link>
        <Link
          to="/profile"
          className={`flex justify-center items-center px-5 py-2 text-sm font-semibold transition-colors ${isActive(
            "/profile"
          )}`}
        >
         <CircleUserRound size={29}  />
        </Link>
      </nav>
    </header>
  );
}
