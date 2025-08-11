import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Registration = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem('role'); // Get role from localStorage

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

    try {
      await axios.post('https://lms-backend-ol4a.onrender.comuser/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      toast.success('Successfully registered!');
      navigate('/');
    } catch (error) {
      if (error.status == 400) {
        toast.warn("User with this email is already exists!")
      }
      console.error(error);
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
            className="w-full mt-5 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition text-sm"
          >
            {role === 'ADMIN' ? 'Register Admin' : 'Sign Up'}
          </button>
        </form>
      </div>
    </>
  );
};

export default Registration;
