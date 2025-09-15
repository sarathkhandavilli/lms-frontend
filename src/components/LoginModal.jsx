import React, { useState } from "react";
import axios from "axios";
import googleImage from "../assets/gbg.png";
import microsoftImage from "../assets/microsoft.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";

const LoginModal = ({ onClose, RegisterModal }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await api.post("user/login", form);
      const { token, role, userId, firstName, lastName } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", role);
      localStorage.setItem("userId", userId);
      localStorage.setItem("firstName", firstName);
      localStorage.setItem("lastName", lastName);

      toast.success(`✅ Welcome back, ${firstName || "Admin"}!`);

      if (role === "MENTOR") {
        window.location.href = "/mentor";
      } else if (role === "ADMIN") {
        window.location.href = "/admin";
      } else if (role === "LEARNER") {
        window.location.href = "/learner";
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 403) {
        toast.error("🚫 Your account is inactive. Contact support.");
      } else if (status === 404) {
        toast.warn("⚠️ No account found with this email. Please sign up.");
      } else if (status === 401) {
        toast.error("🔑 Incorrect password. Try again.");
      } else {
        toast.error("❌ Login failed. Please try again later.");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white border rounded-lg flex flex-col p-5 w-96 shadow-xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-lg font-semibold text-gray-700">Log in</h1>
          <button
            className="hover:cursor-pointer text-gray-500 hover:text-gray-800 transition text-2xl"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Register link */}
        <p className="text-gray-600 text-sm mb-4">
          New user?{" "}
          <button
            className="text-black-800 text-sm font-medium hover:underline"
            onClick={() => {
              onClose();
              RegisterModal();
            }}
          >
            Register Now
          </button>
        </p>

        {/* Social login buttons */}
        <div className="flex flex-col space-y-2">
          {/* Google */}
          <a
            href="http://localhost:8080/oauth2/authorization/google"
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md py-2 text-sm transition"
          >
            <img src={googleImage} alt="Google" className="w-5 h-5" />
            Continue with Google
          </a>

          {/* Microsoft */}
          <a
            href="http://localhost:8080/oauth2/authorization/microsoft"
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-md py-2 text-sm transition"
          >
            <img src={microsoftImage} alt="Microsoft" className="w-6 h-4" />
            Continue with Microsoft
          </a>
          
        </div>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-2 text-gray-500 text-sm">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-3 mb-4">
            {/* Email */}
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-500"
                required
              />
            </div>

            {/* Password */}
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black-500"
                required
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full bg-black hover:bg-zinc-800 text-white font-medium rounded-md py-2 mt-2 transition ${
              isLoggingIn ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginModal;
