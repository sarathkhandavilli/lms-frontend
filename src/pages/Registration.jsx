import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';


const Registration = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem('role'); // Get role from localStorage
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    phoneNo: '',
    role: role === 'ADMIN' ? 'ADMIN' : '', // Directly set role to ADMIN if the role is ADMIN
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSendingOtp(true)
    console.log(formData)

    try {
        const response = await api.post(`user/verifymail?email=${formData.emailId}`);
        if (response.status === 200) {
          toast.success('📩 OTP sent to your email! Please check your inbox or spam folder.');
          navigate('/verify-otp', { state: { formData } });
        }
      } catch (error) {
        const status = error.response?.status;
        if (status === 400) {
          toast.warn("⚠️ An account with this email already exists. Try logging in instead.");
        } else if (status === 500) {
          toast.error("❌ Server error while sending OTP. Please try again.");
        } else {
          toast.error("❌ Unable to send OTP. Check your internet connection.");
        }
      } finally {
        setIsSendingOtp(false)
      }

  };

  return (
    <>
      <Navbar />
      <div className="flex items-center -mt-8 justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm" // reduced padding & width
        >
          <h2 className="text-lg font-semibold flex justify-center mb-2">
            {role === 'ADMIN' ? 'Register Admin' : 'Sign Up'}
          </h2>
          {/* Conditionally render the description */}
          {role !== 'ADMIN' && (
            <p className="text-gray-500 mb-6 text-sm">
              Create a new account to access our courses
            </p>
          )}

          {/* Form fields */}
          {role !== 'ADMIN' ? (
            <div className="space-y-3">
              <input
                name="firstName"
                type="text"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your first name"
                onChange={handleChange}
                required
              />
              <input
                name="lastName"
                type="text"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your last name"
                onChange={handleChange}
                required
              />
              <input
                name="emailId"
                type="email"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
              <input
                name="phoneNo"
                type="tel"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your phone number"
                onChange={handleChange}
                minLength="10"
                maxLength="10"
                required
              />
              <select
                name="role"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                onChange={handleChange}
                required
              >
                <option value="">Select Role</option>
                <option value="MENTOR">MENTOR</option>
                <option value="LEARNER">LEARNER</option>
              </select>
            </div>
          ) : (
            // If the role is ADMIN, don't show the role selection and directly send 'ADMIN'
            <div className='space-y-3'>
              <input
                name="emailId"
                type="email"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your email"
                onChange={handleChange}
                required
              />
              <input
                name="password"
                type="password"
                className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
                placeholder="Enter your password"
                onChange={handleChange}
                required
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSendingOtp}
            className={`w-full mt-5 py-2 rounded-md transition text-sm ${
              isSendingOtp
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-black hover:bg-gray-900 text-white'
            }`}
          >
            {isSendingOtp
              ? 'Sending OTP...'
              : role === 'ADMIN'
              ? 'Register Admin'
              : 'Sign Up'}
          </button>

        </form>
      </div>
    </>
  );
};

export default Registration;
