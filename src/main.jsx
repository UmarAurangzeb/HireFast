import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home.jsx";
import Signup from "./pages/Signup.tsx";
import ApplyJobs from "./pages/ApplyJobs.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./Routes/ProtectedRoutes.tsx";
import StudentDashboard from "./pages/StudentDashboard.tsx";
import RecruiterDashboard from "./pages/RecruiterDashboard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Company from "./pages/Company.tsx";
import SpecificCompany from "./pages/SpecificCompany.jsx";
import AddCompany from "./pages/AddCompany.tsx";
import { Toaster } from "@/components/ui/toaster"
import FindCompanies from "./pages/FindCompanies.tsx";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/Company",
    element:
      <Company />,
    children: [
      {
        path: ":id",
        element: <SpecificCompany />
      },
      {

        path: "Add/:id?",

        element:
          <ProtectedRoute role={["admin", "recruiter"]}>
            <AddCompany />
          </ProtectedRoute>
      },
      {
        path: "findcompanies",
        element: <FindCompanies />
      },


    ],
  },
  {
    path: "/dashboard",
    element:
      <Dashboard />,
    children: [
      {
        path: "admin",
        element:
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
      },
      {
        path: "student",
        element:
          <ProtectedRoute role={["student", "admin"]}>
            <StudentDashboard />
          </ProtectedRoute>
      },
      {
        path: "recruiter",
        element:
          <ProtectedRoute role={["recruiter", "admin"]}>
            <RecruiterDashboard />
          </ProtectedRoute>
      },
    ]
  },
  {
    path: "/signin",
    element: <SignIn />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },

  {
    path: "/applynow",
    element: <ApplyJobs />
  },

]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider >
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  </StrictMode>
);
