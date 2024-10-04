
import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, Navigate, useNavigate } from "react-router-dom";
import Signout from '../components/Homepage/Signout.tsx';
import { useAuth } from '../context/AuthContext.jsx'


export default function Home() {
  const { authState } = useAuth();
  const [navbarColor, setNavbarColor] = useState("bg-customWhite");
  const [textColor, setTextColor] = useState("text-customBlack");
  const [buttonTextColor, setButtonTextColor] = useState("text-customPurple");
  const [signUpButtonColor, setSignUpButtonColor] = useState(
    "bg-customPurple text-white"
  );

  const [selectedFeature, setSelectedFeature] = useState("AboutUs");

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

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 1) {
        setNavbarColor("bg-customPurple");
        setTextColor("text-white");
        setButtonTextColor("text-white");
        setSignUpButtonColor("bg-white text-customPurple");
      } else {
        setNavbarColor("bg-customWhite");
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

  return (
    <div>
      <nav
        className={`${navbarColor} py-4 px-6 flex justify-between items-center fixed top-0 left-0 w-full z-10 transition-colors duration-200`}
      >
        <div className={`text-3xl font-bold font-montserrat ${textColor}`}>
          hireFAST
        </div>
        <div>
          {!authState.isAuthorized ?
            (<>
              <Link to="signin"
                className={`mx-6 font-lato ${buttonTextColor}`}
              >
                Sign in
              </Link>
              <Link to="signup"
                className={`px-4 py-2 rounded-full hover:drop-shadow-l font-lato ${signUpButtonColor}`}
              >
                Sign up
              </Link>
            </>) :
            <Signout signUpButtonColor={signUpButtonColor} />
          }
        </div>
      </nav>

      <section className="min-h-screen bg-customWhite flex flex-col justify-center items-start">
        <h1 className="text-[200px] font-montserrat font-bold text-customBlack mx-10 -mt-20">
          hire<span className="text-customPurple">FAST</span>
        </h1>
        <div className=' w-3/4 text-wrap'>
          <p className="text-[18px] font-roboto text-customBlack mx-11 -mt-10 whitespace-pre-line">
            hireFAST streamlines university event recruitment by simplifying student
            profiles and job applications, eliminating long queues and inefficient QR-code processes. It ensures a seamless experience for events like DevDay and Procom, letting students focus on their future.
          </p>
        </div>
        <Link to="/applynow">
  <button className="bg-customPurple text-white px-8 py-4 rounded-full hover:drop-shadow-l font-lato mx-10 mt-6">
    Apply Now
  </button>
</Link>
      </section>

      <section className="bg-customWhite py-12 px-6">
        <div className="container mx-auto flex">
          <div className="w-1/4 flex flex-col space-y-11">
            <button
              className={`font-roboto text-lg px-4 py-4 rounded-full border-2 
                ${selectedFeature === "QuickJobSearch"
                  ? "bg-customPurple text-customWhite"
                  : "bg-customWhite text-customBlack border-customWhite hover:border-customPurple"
                }`}
              onClick={() => setSelectedFeature("QuickJobSearch")}
            >
              Quick Job Search
            </button>

            <button
              className={`font-roboto text-lg px-4 py-4 rounded-full border-2 
                ${selectedFeature === "RealTimeTracking"
                  ? "bg-customPurple text-customWhite"
                  : "bg-customWhite text-customBlack border-customWhite hover:border-customPurple"
                }`}
              onClick={() => setSelectedFeature("RealTimeTracking")}
            >
              Real-Time Application Tracking
            </button>

            <button
              className={`font-roboto text-lg px-4 py-4 rounded-full border-2 
                ${selectedFeature === "ProfileManagement"
                  ? "bg-customPurple text-customWhite"
                  : "bg-customWhite text-customBlack border-customWhite hover:border-customPurple"
                }`}
              onClick={() => setSelectedFeature("ProfileManagement")}
            >
              Profile Management
            </button>
          </div>

          {/* Right Section - Dynamic Text */}
          <div className="w-3/4 pl-16">
            <h2 className="font-montserrat text-8xl text-customPurple mb-4">
              {selectedFeature.replace(/([A-Z])/g, " $1")}
            </h2>
            <p className="font-roboto text-customBlack text-base py-4 text-[20px]">
              {featureText[selectedFeature]}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
