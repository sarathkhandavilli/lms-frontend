import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust path if needed
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const EmailVerification = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await api.post(
        `forgotpassword/verifyMail?email=${email}`
      );
      
      if (response.status === 200) {
        toast.success('OTP sent successfully! Please check your inbox.');
      }

      navigate('/verify-otp', { state: { email: email } });

    } catch (err) {

      const status = err.response.status;
      if (status === 404) {
        toast.warn('Email not found!');
      } 
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen -mt-20 flex items-center justify-center pt-24">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Verify Your Email</h2>
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {isSubmitting ? 'Sending...' : 'Get OTP'}
          </button>
        </form>
      </div>
    </>
  );
};

export default EmailVerification;
