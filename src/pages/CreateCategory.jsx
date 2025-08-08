import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CreateCategory = ({ id, onClose, onCategoryCreated }) => {
  
  const categoryId = id;
  const [formData, setFormData] = useState({ name: '', description: '' });
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    try {
      if (categoryId) {
        // Update
        await axios.put(
          'https://lms-backend-ol4a.onrender.com/category/update',
          { id: parseInt(categoryId), ...formData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Category updated successfully!');
      } else {
        // Create
        await axios.post(
          'https://lms-backend-ol4a.onrender.com/category/add',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        alert('Category created successfully!');
      }

      if (onCategoryCreated) onCategoryCreated();
      if (onClose) onClose();

    } catch (error) {
      console.error(error);
      alert('Failed to save category');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {categoryId ? "Update Category" : "Create New Category"}
          </h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Category Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          >
            {categoryId ? "Update Category" : "Create New Category"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
