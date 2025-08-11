import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ChangePassword = () => {

  const navigate = useNavigate();
  const location = useLocation();

  const email = location?.state?.email;

  if (!email) {
    toast.warn('No email found. Please go back to the OTP page.');
    navigate('/otp-verification');
    return;
  }

  const [passwords, setPasswords] = useState({
    password: '',
    repeatPassword: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccessMessage('');

    if (passwords.password !== passwords.repeatPassword) {
      setError('Passwords do not match!');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        `https://lms-backend-ol4a.onrender.comforgotpassword/changePassword/${email}`,
        passwords
      );

      if (response.status === 200) {
        setSuccessMessage('Password changed successfully!');
        toast.success('Password changed successfully!');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to change password. Please try again.');
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
          <h2 className="text-2xl font-semibold text-center">Change Your Password</h2>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              New Password
            </label>
            <input
              type="password"
              name="password"
              value={passwords.password}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="repeatPassword" className="block text-sm font-medium mb-1">
              Re-enter New Password
            </label>
            <input
              type="password"
              name="repeatPassword"
              value={passwords.repeatPassword}
              onChange={handlePasswordChange}
              placeholder="Re-enter new password"
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm text-center">{successMessage}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {isSubmitting ? 'Changing...' : 'Change Password'}
          </button>
        </form>
      </div>
    </>
  );
};

export default ChangePassword;
