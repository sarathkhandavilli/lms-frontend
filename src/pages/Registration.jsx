import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

const Registration = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    emailId: '',
    password: '',
    phoneNo: '',
    role: '',
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
      await axios.post('https://lms-backend-ol4a.onrender.com/user/register', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      alert('Successfully registered!');
      navigate('/');
    } catch (error) {
      console.error(error);
      alert('Registration failed');
    }
  };

  return (
    <>
    <Navbar/>
    <div className="flex items-center -mt-8 justify-center min-h-screen bg-gray-100">
  <form
    onSubmit={handleSubmit}
    className="bg-white rounded-lg shadow-md p-6 w-full max-w-sm" // reduced padding & width
  >
    <h2 className="text-lg font-semibold mb-1">Sign Up</h2>
    <p className="text-gray-500 mb-6 text-sm">
      Create a new account to access our courses
    </p>

    <div className="space-y-3"> {/* reduced spacing */}
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
        required
      />
      <select
        name="role"
        className="w-full px-3 py-2 bg-gray-100 rounded-md focus:outline-none"
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        {/* <option value="ADMIN">ADMIN</option> */}
        <option value="MENTOR">MENTOR</option>
        <option value="LEARNER">LEARNER</option>
      </select>
    </div>

    <button
      type="submit"
      className="w-full mt-5 bg-black text-white py-2 rounded-md hover:bg-gray-900 transition text-sm"
    >
      Sign Up
    </button>
  </form>
</div>

    </>
  );
};

export default Registration;
