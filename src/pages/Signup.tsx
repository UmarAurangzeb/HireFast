import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FaGoogle, FaGithub, FaEye, FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components1/navbar.jsx";
import { useToast } from "@/hooks/use-toast.js";

// Validation schema
const registerSchema = z.object({
  firstName: z
    .string()
    .min(4, "First name should be at least 4 characters long")
    .max(48, "First name should be no longer than 48 characters"),
  lastName: z
    .string()
    .min(4, "Last name should be at least 4 characters long")
    .max(40, "Last name should be no longer than 40 characters"),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .length(11, "Phone number must be exactly 11 digits"),
  password: z
    .string()
    .min(5, "Password should be at least 5 characters long")
    .max(40, "Password should be no longer than 40 characters"),
  role: z.enum(["student", "recruiter"], {
    errorMap: () => ({
      message: "Role should be either student or recruiter",
    }),
  }),
});

const formdata = [
  { name: "firstName", label: "First Name", type: "text" },
  { name: "lastName", label: "Last Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone_number", label: "Phone Number", type: "text" },
  { name: "password", label: "Password", type: "password" },
];

type FormFields = z.infer<typeof registerSchema>;

export default function Signup() {
  const [togglePassword, setTogglePassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<FormFields>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    const res = await fetch("http://localhost:8000/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Registered successfully!",
      });
      navigate("/signin");
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-gray-50 to-white px-4 pt-24 pb-8">
        <div className="bg-white border w-full max-w-lg p-10 rounded-3xl shadow-2xl mt-10">
          <h1 className="text-4xl font-bold text-customPurple mb-2 text-center">Sign Up</h1>
          <p className="text-gray-500 text-lg mb-6 text-center">Create your account to get started.</p>
          <form
            className="space-y-5"
            onSubmit={handleSubmit(onSubmit)}
          >
            {/* First Name */}
            <div>
              <label htmlFor="firstName" className="block font-medium mb-1">First Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", { required: "First name is required", minLength: { value: 4, message: "First name should be at least 4 characters" }, maxLength: { value: 48, message: "First name should be no longer than 48 characters" } })}
                  className="w-full border rounded-lg py-3 pl-10 pr-4 mt-1 focus:outline-none focus:ring-2 focus:ring-customPurple text-lg bg-gray-50"
                  aria-label="First Name"
                  onBlur={() => trigger("firstName")}
                />
              </div>
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
              )}
            </div>
            {/* Last Name */}
            <div>
              <label htmlFor="lastName" className="block font-medium mb-1">Last Name</label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", { required: "Last name is required", minLength: { value: 4, message: "Last name should be at least 4 characters" }, maxLength: { value: 40, message: "Last name should be no longer than 40 characters" } })}
                  className="w-full border rounded-lg py-3 pl-10 pr-4 mt-1 focus:outline-none focus:ring-2 focus:ring-customPurple text-lg bg-gray-50"
                  aria-label="Last Name"
                  onBlur={() => trigger("lastName")}
                />
              </div>
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label htmlFor="email" className="block font-medium mb-1">Email</label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: "Email is required", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" } })}
                  className="w-full border rounded-lg py-3 pl-10 pr-4 mt-1 focus:outline-none focus:ring-2 focus:ring-customPurple text-lg bg-gray-50"
                  aria-label="Email"
                  onBlur={() => trigger("email")}
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            {/* Phone Number */}
            <div>
              <label htmlFor="phone_number" className="block font-medium mb-1">Phone Number</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type="tel"
                  id="phone_number"
                  {...register("phone_number", { required: "Phone number is required", minLength: { value: 11, message: "Phone number must be exactly 11 digits" }, maxLength: { value: 11, message: "Phone number must be exactly 11 digits" }, pattern: { value: /^\d{11}$/, message: "Phone number must be exactly 11 digits" } })}
                  className="w-full border rounded-lg py-3 pl-10 pr-4 mt-1 focus:outline-none focus:ring-2 focus:ring-customPurple text-lg bg-gray-50"
                  aria-label="Phone Number"
                  onBlur={() => trigger("phone_number")}
                />
              </div>
              {errors.phone_number && (
                <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
              )}
            </div>
            {/* Password */}
            <div>
              <label htmlFor="password" className="block font-medium mb-1">Password</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-customPurple text-lg" />
                <input
                  type={togglePassword ? "text" : "password"}
                  id="password"
                  {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password should be at least 5 characters" }, maxLength: { value: 40, message: "Password should be no longer than 40 characters" } })}
                  className="w-full border rounded-lg py-3 pl-10 pr-10 mt-1 focus:outline-none focus:ring-2 focus:ring-customPurple text-lg bg-gray-50"
                  aria-label="Password"
                  onBlur={() => trigger("password")}
                />
                <FaEye
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer text-xl"
                  onClick={() => setTogglePassword((prev) => !prev)}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>
            {/* Role */}
            <div>
              <label htmlFor="role" className="block font-medium mb-1">Role</label>
              <select
                id="role"
                defaultValue=""
                {...register("role", { required: "Role is required" })}
                className="w-full border rounded-lg py-3 mt-1 focus:ring-2 focus:ring-customPurple text-lg bg-gray-50"
                aria-label="Role"
                onBlur={() => trigger("role")}
              >
                <option value="" disabled>
                  Select your role
                </option>
                <option value="student">Student</option>
                <option value="recruiter">Recruiter</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
              )}
            </div>
            <Link
              to="/signin"
              className="text-sm text-customPurple underline hover:text-customPurple/80"
            >
              Already have an account? Sign in
            </Link>
            <button
              type="submit"
              className="w-full bg-customPurple text-white py-3 rounded-full text-lg font-Lato shadow-md hover:bg-customPurple/90 transition-all flex items-center justify-center gap-2"
              disabled={isSubmitting}
              aria-busy={isSubmitting}
            >
              {isSubmitting && <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>}
              {isSubmitting ? "Signing Up..." : "Sign Up"}
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t"></div>
            <span className="mx-2 text-gray-500">OR</span>
            <div className="flex-grow border-t"></div>
          </div>

          <button className="w-full flex items-center justify-center border rounded-full py-3 mb-2 hover:bg-gray-100 text-lg">
            <FaGithub className="mr-2" />
            Continue with GitHub
          </button>

          <button className="w-full flex items-center justify-center bg-blue-500 text-white rounded-full py-3 hover:bg-blue-600 text-lg">
            <FaGoogle className="mr-2" />
            Continue with Google
          </button>
        </div>
      </div>
    </>
  );
}
