import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar'; // Adjust path if needed
import { useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';


const OtpVerification = () => {

  const role = localStorage.getItem('role');

  const navigate = useNavigate();
  const location = useLocation();
  const email = location?.state?.email;
  const formData = location?.state?.formData;

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
        if (!formData?.emailId || formData.emailId.trim() === "") {
          console.log('entered into  forgot password otp')
          // Forgot Password Flow
          const response = await api.post(
            `forgotpassword/verifyOtp/${otp}/${email}`
          );
          if (response.status === 200) {
            toast.success('✅ OTP verified! You can now reset your password.');
            navigate('/change-password', { state: { email } });
          }
        } else {
          console.log(formData)
          console.log('entered into registration otp')
          // Registration Flow
          const response = await api.post(
            `user/verifyotp/${otp}/${formData.emailId}`
          );
          if (response.status === 200) {
            try {
              await api.post('user/register', formData, {
                headers: { 'Content-Type': 'application/json' },
              });

              if (role?.length === 5) {
                toast.success('✅ Admin registered!');
              } else {
                toast.success('🎉 Registration complete! Welcome aboard.');
              }

              navigate('/', { state: { formData } });
            } catch (regErr) {
              toast.error('❌ Registration failed. Please try again.');
            }
          }
        }
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          toast.warn('⚠️ Incorrect OTP. Please try again.');
        } else if (status === 417) {
          toast.error('⏳ OTP expired. Please request a new one.');
        } else {
          toast.error('❌ OTP verification failed. Please try again later.');
        }
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
