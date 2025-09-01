import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import { handleTokenExpiration } from '../components/HandleTokenExpiration';
import { useNavigate } from 'react-router-dom';


const CreateCategory = ({ id, onClose, onCategoryCreated }) => {

  const navigate = useNavigate();
  const categoryId = id;
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formData.name || !formData.description) {
      toast.info('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      if (categoryId) {

        await api.put(
          'category/update',
          { id: parseInt(categoryId), ...formData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category updated successfully!');

      } else {

        await api.post(
          'category/add',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success('Category created successfully!');

      }

      if (onCategoryCreated) onCategoryCreated();
      if (onClose) onClose();

    } catch (error) {
      if (error.response && error.response.status === 401) {
                toast.info('session expired please login again!')
          }
      handleTokenExpiration(error,navigate)
      console.error(error);
      toast.error('Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl space-y-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {categoryId ? "Update Category" : "Create New Category"}
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className={`text-xl font-bold ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &times;
          </button>
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
            disabled={isSubmitting}
            className={`w-full py-2 rounded text-white ${
              isSubmitting ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isSubmitting
              ? categoryId
                ? 'Updating...'
                : 'Creating...'
              : categoryId
              ? 'Update Category'
              : 'Create New Category'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCategory;
