import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    cardNo: '',
    nameOnCard: '',
    cvv: '',
    expiryDate: '',
    amount: state?.amount || 0,
    courseId: state?.courseId,
    learnerId: state?.learnerId,
    type: state?.type,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:8080/enrollment/enroll', formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert("Payment & Enrollment Successful");
      navigate('/learner'); // redirect after success
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold text-center mb-6">Payment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Card Number</label>
          <input
            type="text"
            name="cardNo"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNo}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Name on Card</label>
          <input
            type="text"
            name="nameOnCard"
            placeholder="John Doe"
            value={formData.nameOnCard}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block font-medium">CVV</label>
            <input
              type="text"
              name="cvv"
              placeholder="123"
              value={formData.cvv}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Expiry Date</label>
            <input
              type="text"
              name="expiryDate"
              placeholder="MM/YY"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>
        </div>
        <div>
          <label className="block font-medium">Amount</label>
          <input
            type="text"
            name="amount"
            value={formData.amount}
            readOnly
            className="w-full border px-3 py-2 bg-gray-100 rounded"
          />
        </div>
        <button type="submit" className="w-full bg-black text-white py-2 rounded hover:bg-zinc-800">
          Pay & Enroll
        </button>
      </form>
    </div>
  );
};

export default Payment;
