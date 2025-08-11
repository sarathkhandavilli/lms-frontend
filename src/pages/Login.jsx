import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Adjust path if needed
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {

  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });



  const handleForgotPassword = () => {
    navigate('/forgot-password')
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://lms-backend-ol4a.onrender.comuser/login', form);
      const { token, role, userId, firstName, lastName } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
      localStorage.setItem('firstName', firstName);
      localStorage.setItem('lastName', lastName);

      toast.success(`SUCCESSFULLY LOGGED IN AS ${role}`);

      if (role === 'MENTOR') {
        navigate('/mentor', { state: { mentorId: userId } });
      } else if (role === 'ADMIN') {
        navigate('/admin', { state: { adminId: userId } });
      } else if (role === 'LEARNER') {
        navigate('/learner', { state: { learnerId: userId } });
      }
    } catch (error) {
      console.error(error);
      toast('Invalid credentials');
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
          <h2 className="text-2xl font-semibold text-center" >Login</h2>

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
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            Login
          </button>
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-black underline hover:text-black"
            >
              Forgot password?
            </button>
            </div>
        </form>
      </div>
    </>
  );
};

export default Login;
