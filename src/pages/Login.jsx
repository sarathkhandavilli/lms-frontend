import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const setUser = (e) => {
    setForm({email: e.target.name, password: e.target.value})
  }

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      const response = await api.post('user/login', form);
      const { token, role, userId, firstName, lastName } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);

      toast.success(`✅ Welcome back, ${firstName || 'Admin'}!`);


      if (role === 'MENTOR') {
        navigate('/mentor', { state: { mentorId: userId } });
      } else if (role === 'ADMIN') {
        navigate('/admin', { state: { adminId: userId } });
      } else if (role === 'LEARNER') {
        navigate('/learner', { state: { learnerId: userId } });
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
    <>
      <Navbar />
      <div className="h-screen w-screen fixed top-0 mt-4 left-0 flex items-center justify-center bg-gray-100">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6"
        >
          <h2 className="text-2xl font-semibold text-center">Login</h2>

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@gmail.com"
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="password"
              className="w-full px-3 py-2 border rounded bg-gray-100 focus:outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoggingIn}
            className={`w-full py-2 rounded text-white transition ${
              isLoggingIn
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isLoggingIn ? 'Logging in...' : 'Login'}
          </button>

          <div className="flex flex-col text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-black underline hover:text-black"
            >
              Forgot password?
            </button>

            <h1>Demo Accounts</h1>

            <div className='flex justify-center gap-2 '>

              <button type='button'
              name='admin@lms.com'
              value='password_Admin'
              onClick={setUser}
              className="text-black underline hover:text-black"
              >
                 admin
              </button>
              <button type='button'
              name='brad@traversymedia.com'
              value='password_Brad'
              onClick={setUser}
              className="text-black underline hover:text-black"
              >
                 mentor
              </button>
              <button type='button'
              onClick={setUser}
              name='alice.smith@example.com'
              value='password_Alice'
              className="text-black underline hover:text-black">
                 learner
              </button>

            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default Login;
