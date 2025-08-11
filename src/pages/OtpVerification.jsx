import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust path if needed
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;

  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Clear any previous error message

    try {
      // Send OTP and email to the API for verification
      const response = await axios.post(
        `https://lms-backend-ol4a.onrender.comforgotpassword/verifyOtp/${otp}/${email}`
      );
      
      if (response.status === 200) {
        toast.success('OTP verified successfully!');
        navigate('/change-password', { state: { email: email } }); // Navigate to password change page
      }
    } catch (err) {
      console.error(err);
      setError('Failed to verify OTP. Please try again.');
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
          <h2 className="text-2xl font-semibold text-center">Verify OTP</h2>

          {/* OTP input */}
          <div>
            <label htmlFor="otp" className="block text-sm font-medium mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
              required
            />
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {isSubmitting ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </>
  );
};

export default OtpVerification;
