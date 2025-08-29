import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const CreateSection = ({ courseId, onClose, onSectionCreated }) => {

  const mentorId = localStorage.getItem('userId');


  const [sectionData, setSectionData] = useState({
    sectionNo: '',
    name: '',
    description: '',
    mentorId: mentorId
  });

  const [isAdding, setIsAdding] = useState(false); 

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setSectionData({ ...sectionData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isAdding) return; // Prevent double clicks

    if (!sectionData.name || !sectionData.sectionNo || !sectionData.description) {
      toast.info('Please fill all required fields!');
      setIsAdding(false);
      return;
    }
    setIsAdding(true);

    const payload = {
      ...sectionData,
      courseId: parseInt(courseId),
    };

    try {
      const response = await api.post('courses/section/add', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Section added successfully');
      onSectionCreated(response.data.data?.id || null);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add section');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl space-y-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Section</h2>
          <button
            onClick={onClose}
            disabled={isAdding} // Disable while adding
            className={`text-xl ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &times;
          </button>
        </div>
        <input
          type="text"
          name="sectionNo"
          placeholder="Section No"
          value={sectionData.sectionNo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="name"
          placeholder="Section Name"
          value={sectionData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={sectionData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleSubmit}
          disabled={isAdding}
          className={`w-full py-2 rounded text-white ${isAdding ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}`}
        >
          {isAdding ? 'Adding...' : 'Add Section'}
        </button>
      </div>
    </div>
  );
};

export default CreateSection;
