import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Signout from "../components/Homepage/Signout.tsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { authState } = useAuth();
  const location = useLocation();
  const [navbarColor, setNavbarColor] = useState("bg-gradient-to-b from-gray-50 to-white");
  const [textColor, setTextColor] = useState("text-customBlack");
  const [buttonTextColor, setButtonTextColor] = useState("text-customPurple");
  const [signUpButtonColor, setSignUpButtonColor] = useState(
    "bg-customPurple text-white"
  );
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setNavbarColor("bg-customPurple");
        setTextColor("text-white");
        setButtonTextColor("text-white");
        setSignUpButtonColor("bg-white text-customPurple");
      } else {
        setNavbarColor("bg-gradient-to-b from-gray-50 to-white");
        setTextColor("text-customBlack");
        setButtonTextColor("text-customPurple");
        setSignUpButtonColor("bg-customPurple text-white");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Helper to highlight current page
  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`${navbarColor} py-4 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-10 transition-colors duration-200`}
      aria-label="Main navigation"
    >
      <Link
        to="/"
        className={`text-3xl font-bold font-Montserrat focus:outline-none focus:ring-2 focus:ring-customPurple rounded ${textColor}`}
        aria-label="Go to homepage"
      >
        hireFAST
      </Link>
      <div className="flex items-center gap-2">
        {!authState.isAuthorized ? (
          <>
            <Link
              to="/signin"
              className={`mx-2 font-Lato px-4 py-2 rounded-full transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple ${buttonTextColor} ${isActive("/signin") ? "underline underline-offset-4" : "hover:bg-customPurple/10"}`}
              aria-label="Sign in"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className={`px-4 py-2 rounded-full font-Lato transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple ${signUpButtonColor} ${isActive("/signup") ? "ring-2 ring-customPurple" : "hover:drop-shadow-l hover:bg-customPurple/90"}`}
              aria-label="Sign up"
            >
              Sign up
            </Link>
          </>
        ) : (
          <Signout signUpButtonColor={signUpButtonColor} />
        )}
      </div>
    </nav>
  );
}
