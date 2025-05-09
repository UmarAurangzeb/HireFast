import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Signout from '../components/Homepage/Signout.tsx';
import { useAuth } from '../context/AuthContext.jsx'
// import Navbar from '../components/Navbar.jsx';
import Navbar from "../components1/navbar.jsx";
import { FaRocket, FaSearch, FaUserCheck, FaUserEdit } from "react-icons/fa";

export default function Home() {
  const { authState } = useAuth();
  console.log('authState from home', authState);
  const [selectedFeature, setSelectedFeature] = useState("AboutUs");
  const [userType, setUserType] = useState('');
  // console.log("authstate from home", authState);
  useEffect(() => {
    setUserType(authState.role === 'recruiter' || authState.role === 'admin' ? 'employer' : 'student');
  }, [authState]);
  console.log("userType from home", userType);
  const featureText = {
    QuickJobSearch:
      "Easily search for companies and jobs using filters like company name, job title, and location. Find relevant opportunities without the hassle.",
    RealTimeTracking:
      "Track your job application status in real-time and stay updated on where you stand in the hiring process.",
    ProfileManagement:
      "Create, update, or delete your profile at any time. Manage your personal information and qualifications effortlessly.",
    AboutUs:
      "hireFAST is designed to revolutionize job application processes at university events like DevDay and Procom. By providing a digital platform, we streamline recruitment for students and companies alike. With hireFAST, students can quickly apply to job postings, manage their profiles, and track their application progress—all in one place. For employers, the platform offers an easy way to post jobs, manage applicants, and monitor progress in real-time. Our goal is to eliminate outdated methods and provide a smooth, efficient hiring experience that connects students with potential employers without the hassle.",
  };
  return (
    <div>
      <Navbar />
      <section className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col justify-center items-start pt-24 pb-8">
        <h1 className="text-[48px] md:text-[90px] lg:text-[150px] font-Montserrat font-bold text-customBlack mx-10 mb-2">
          hire<span className="text-customPurple">FAST</span>
        </h1>
        <div className="w-full md:w-3/4 text-wrap mt-4 xl:mt-0">
          <p className="text-lg md:text-xl lg:text-2xl font-Roboto text-customBlack mx-11 mb-2 whitespace-pre-line">
            hireFAST streamlines university event recruitment by simplifying student profiles and job applications, eliminating long queues and inefficient QR-code processes. It ensures a seamless experience for events like DevDay and Procom, letting students focus on their future.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 mt-6 mx-10">
          <Link to={userType === 'employer' ? '/company/Add' : 'applynow'}>
            <button className="bg-customPurple text-white px-8 py-4 rounded-full hover:drop-shadow-l font-Lato flex items-center gap-2 text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple">
              <FaRocket className="text-xl" />
              {userType === 'employer' ? 'Post Job' : "Apply Now"}
            </button>
          </Link>
          {userType !== 'employer' && <Link to={'/company/findcompanies'}>
            <button className="bg-black text-white px-8 py-4 rounded-full hover:drop-shadow-l font-Lato flex items-center gap-2 text-lg transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple">
              <FaSearch className="text-xl" />
              Find Companies
            </button>
          </Link>}
        </div>
      </section>

      <section className="bg-gradient-to-b from-gray-50 to-white py-12 px-6">
        <div className="mx-auto flex flex-col md:flex-row md:items-start gap-8">
          <div className="w-full md:w-1/4 flex flex-row md:flex-col space-y-0 md:space-y-8 space-x-4 md:space-x-0 mb-8 md:mb-0">
            <button
              className={`font-Lato text-lg px-4 py-4 rounded-full border-2 flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple
          ${selectedFeature === "QuickJobSearch"
                  ? "bg-customPurple text-customWhite shadow-lg"
                  : "bg-customWhite text-customBlack border-customWhite hover:border-customPurple"}
                `}
              onClick={() => setSelectedFeature("QuickJobSearch")}
              aria-pressed={selectedFeature === "QuickJobSearch"}
            >
              <FaSearch /> Quick Job Search
            </button>

            <button
              className={`font-Lato text-lg px-4 py-4 rounded-full border-2 flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple
          ${selectedFeature === "RealTimeTracking"
                  ? "bg-customPurple text-customWhite shadow-lg"
                  : "bg-customWhite text-customBlack border-customWhite hover:border-customPurple"}
                `}
              onClick={() => setSelectedFeature("RealTimeTracking")}
              aria-pressed={selectedFeature === "RealTimeTracking"}
            >
              <FaUserCheck /> Real-Time Application Tracking
            </button>

            <button
              className={`font-Lato text-lg px-4 py-4 rounded-full border-2 flex items-center gap-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-customPurple
          ${selectedFeature === "ProfileManagement"
                  ? "bg-customPurple text-customWhite shadow-lg"
                  : "bg-customWhite text-customBlack border-customWhite hover:border-customPurple"}
                `}
              onClick={() => setSelectedFeature("ProfileManagement")}
              aria-pressed={selectedFeature === "ProfileManagement"}
            >
              <FaUserEdit /> Profile Management
            </button>
          </div>

          <div className="w-full md:w-3/4 md:pl-16">
            <h2 className="font-Montserrat text-4xl md:text-6xl text-customPurple mb-4 transition-all duration-150">
              {selectedFeature.replace(/([A-Z])/g, " $1")}
            </h2>
            <p className="font-Roboto text-customBlack text-base py-4 text-[20px]">
              {featureText[selectedFeature]}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
