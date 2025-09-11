import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import googleImage from "../assets/gbg.png";

const RegisterModal = ({ onClose, LoginModal }) => {
  const navigate = useNavigate();

  const [googleRole, setGoogleRole] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // State for form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    role: "",
  });

  // Update form data
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.emailId.endsWith("@gmail.com")) {
      toast.warn("⚠️ Please use a Gmail address (must end with @gmail.com).");
      return;
    }

    setIsSendingOtp(true);

    try {
      const response = await api.post(
        `user/verifymail?email=${formData.emailId}`
      );

      if (response.status === 200) {
        toast.success(
          "📩 OTP sent to your email! Please check your inbox or spam folder."
        );
        onClose(); // Close modal before redirect
        navigate("/verify-otp", { state: { formData } });
      }
    } catch (error) {
      const status = error.response?.status;
      if (status === 400) {
        toast.warn(
          "⚠️ An account with this email already exists. Try logging in instead."
        );
      } else if (status === 500) {
        toast.error("❌ Server error while sending OTP. Please try again.");
      } else {
        toast.error("❌ Unable to send OTP. Check your internet connection.");
      }
    } finally {
      setIsSendingOtp(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white border rounded-md flex flex-col p-4 w-80 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-1">
          <h1 className="text-base font-semibold text-gray-700">Create Account</h1>
          <button
            className="text-gray-500 text-lg hover:cursor-pointer hover:text-gray-800 transition"
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Already have an account */}
        <p className="text-gray-600 text-sm mb-4">
          Already have an account?{" "}
          <button
            className="text-black-800 text-sm font-medium hover:underline"
            onClick={() => {
              onClose();
              LoginModal();
            }}
          >
            Log in
          </button>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-2 mb-2">
            <div className="flex flex-col w-1/2">
              <label className="text-xs font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black-500"
                placeholder="First Name"
                required
              />
            </div>
            <div className="flex flex-col w-1/2">
              <label className="text-xs font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-black-500"
                placeholder="Last Name"
                required
              />
            </div>
          </div>

          <div className="flex flex-col mb-2">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              name="emailId"
              type="email"
              value={formData.emailId}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-xs w-full mb-2"
              placeholder="Email"
              required
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-xs w-full mb-2"
              placeholder="Password"
              required
            />
          </div>

          <div className="flex flex-col mb-2">
            <label className="text-xs font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="border border-gray-300 rounded-md px-2 py-1 text-xs w-full mb-2"
              required
            >
              <option value="">Select Role</option>
              <option value="LEARNER">LEARNER</option>
              <option value="MENTOR">MENTOR</option>
            </select>
          </div>

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={isSendingOtp}
            className={`w-full bg-black hover:bg-zinc-800 text-white text-xs font-medium rounded-md py-1 mt-2 transition ${
              isSendingOtp ? "cursor-not-allowed opacity-60" : ""
            }`}
          >
            {isSendingOtp ? "Validating..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-2">
          <div className="flex-grow border-gray-300 border-t"></div>
          <span className="mx-2 text-gray-500 text-xs">or</span>
          <div className="flex-grow border-gray-300 border-t"></div>
        </div>

        {/* Google Section */}
        <div className="flex flex-col space-y-1">
          {/* <label className="text-xs font-medium text-gray-700">
            {googleRole === "" ? "Please Select Role to continue" : ""}
          </label>
          <select
            value={googleRole}
            onChange={(e) => setGoogleRole(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-xs focus:outline-none"
          >
            <option value="">Select Role</option>
            <option value="LEARNER">LEARNER</option>
            <option value="MENTOR">MENTOR</option>
          </select> */}
          <h2 className="flex justify-center text-sm text-gray-700">You will be registered as Learner.</h2>

          <a
            href='http://localhost:8080/oauth2/authorization/google?role'
            className={`w-full flex items-center justify-center gap-2 rounded-md py-2 text-xs font-medium transition ${
              "bg-gray-200 hover:bg-gray-300 text-gray-700 cursor-pointer"
            }`}
           
          >
            <img src={googleImage} alt="Google" className="w-5 h-5" />
            Continue with Google
          </a>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
