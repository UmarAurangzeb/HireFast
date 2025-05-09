import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx'
import Navbar from "../components1/navbar.jsx";
import { FaEye, FaEnvelope, FaLock } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast.js";

const registerschema = z.object({
  email: z.string().email(),
  password: z.string().min(5),
});

type FormFields = z.infer<typeof registerschema>;
export default function Signin() {
  const { authState, setAuthState } = useAuth();
  const [togglePassword, settogglepassword] = useState(false)
  const { toast } = useToast();
  const Navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting }, trigger } = useForm<FormFields>(
    {
      resolver: zodResolver(registerschema),
      mode: 'onBlur',
      reValidateMode: 'onChange',
    }
  );
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const { email, password } = data;
    try {
      const res = await axios.post(
        "http://localhost:8000/user/login",
        {
          email: email,
          password: password
        },
        {
          withCredentials: true
        }
      );
      // console.log(res.data);
      // console.log("Sign in successfully");

      setAuthState({
        role: res.data.role,
        id: res.data.id,
        isAuthorized: true,
        loading: false
      })
      toast({
        title: "Success",
        description: "sign in successfull",
      });
      Navigate("/");

    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
      console.log("Sign in failed");
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex flex-col md:flex-row justify-center items-center bg-gradient-to-b from-gray-50 to-white px-4 pt-24 pb-8 min-h-screen">
        <div className="hidden md:flex flex-1 justify-center items-center">
          <h1 className="text-[60px] md:text-[80px] lg:text-[120px] font-Montserrat font-bold text-customBlack mx-10">
            hire<span className="text-customPurple">FAST</span>
          </h1>
        </div>
        <div className="flex flex-1 justify-center items-center w-full">
          <div className="bg-white w-full max-w-lg py-12 px-10 flex flex-col items-center border-2 rounded-3xl shadow-2xl mx-4">
            <h1 className="text-4xl font-bold text-customPurple mb-2 text-center">Sign In</h1>
            <p className="text-gray-500 text-lg mb-6 text-center">Welcome back! Please enter your details to sign in.</p>
            <form
              action={"#"}
              className="flex flex-col text-base mt-2 w-full relative space-y-4"
              onSubmit={handleSubmit(onSubmit)}
            >
              <label htmlFor="username" className="font-Roboto text-base mb-1">
                Email
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type="email"
                  id="username"
                  {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })}
                  autoComplete="off"
                  className="focus:outline-none active:outline-none ring-2 focus:ring-customPurple py-3 pl-10 pr-4 rounded-lg text-lg border border-gray-200 bg-gray-50 w-full"
                  aria-label="Email"
                  onBlur={() => trigger("email")}
                />
              </div>
              {errors.email && (
                <div className="text-red-600 text-sm">{errors.email.message}</div>
              )}
              <label htmlFor="password" className="font-Roboto text-base mb-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type={!togglePassword ? 'password' : 'text'}
                  {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password must be at least 5 characters" } })}
                  id="password"
                  className="focus:outline-none active:outline-none ring-2 focus:ring-customPurple py-3 pl-10 pr-10 rounded-lg text-lg border border-gray-200 bg-gray-50 w-full"
                  aria-label="Password"
                  onBlur={() => trigger("password")}
                />
                <FaEye className="absolute right-4 top-1/2 -translate-y-1/2 text-customPurple cursor-pointer text-xl" onClick={() => settogglepassword(prev => !prev)} />
              </div>
              {errors.password && (
                <div className="text-red-600 text-sm">{errors.password.message}</div>
              )}
              <div className="flex justify-between items-center w-full">
                <Link
                  to={"/signup"}
                  className="text-xs text-customPurple underline underline-offset-2 opacity-80 hover:opacity-100 font-Roboto"
                >
                  Don't have an account?
                </Link>
              </div>
              <button
                className="bg-customPurple text-white font-Lato rounded-full mt-4 py-3 text-lg shadow-md hover:bg-customPurple/90 transition-all flex items-center justify-center gap-2"
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
