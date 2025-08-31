import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const CreateCourse = ({ onClose }) => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('PAID');
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [authorNote, setAuthorNote] = useState('');
  const [prerequisite, setPrerequisite] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [categoryId, setCategoryId] = useState(0);
  const [categories, setCategories] = useState([]);
  const [isCreating, setIsCreating] = useState(false)

  const mentorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get(
          'category/fetch/all?status=active'
        );
        setCategories(response.data.data);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    if (isCreating) return; 
    setIsCreating(true);

    if (type !== 'FREE') {
      if (!title || !description || !categoryId || !type || !price || !authorNote || !prerequisite || !thumbnail) {
        toast.info('Please fill all required fields');
        setIsCreating(false);
        return;
      }
    }

    const formData = new FormData();
    formData.append('mentorId', mentorId);
    formData.append('categoryId', categoryId);
    formData.append('name', title);
    formData.append('description', description);
    formData.append('type', type);
    if (price !== '') formData.append('price', parseFloat(price));
    if (discount !== '') formData.append('discountInPercent', parseInt(discount));
    formData.append('authorCourseNote', authorNote);
    formData.append('prerequisite', prerequisite);
    formData.append('thumbnail', thumbnail);

    try {
      const response = await api.post('courses/add', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Course created successfully!');
      navigate(`/course/${response.data.data.id}`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to create course.');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-60 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Create New Course</h2>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-500 hover:text-black"
            disabled={isCreating}
          >
            &times;
          </button>
        </div>

        <div className="space-y-3">
          <input
            type="text"
            placeholder="Course Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <select
            className="w-full p-2 border rounded"
            value={categoryId}
            onChange={(e) => setCategoryId(Number(e.target.value))}
          >
            <option value={0}>Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>

          <select
            className="w-full p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="PAID">Paid</option>
            <option value="FREE">Free</option>
          </select>

          {type === 'PAID' && (
            <>
              <input
                type="number"
                placeholder="Price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border rounded"
              />

              <input
                type="number"
                placeholder="Discount (%)"
                value={discount}
                onChange={(e) => setDiscount(e.target.value)}
                className="w-full p-2 border rounded"
              />
            </>
          )}

          <textarea
            placeholder="Author Course Note"
            value={authorNote}
            onChange={(e) => setAuthorNote(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Prerequisite"
            value={prerequisite}
            onChange={(e) => setPrerequisite(e.target.value)}
            className="w-full p-2 border rounded"
          />

          <div className="w-full">
            <label
              htmlFor="thumbnail"
              className="block w-full text-center cursor-pointer bg-gray-200 hover:bg-gray-300 text-black py-2 rounded transition"
            >
              {thumbnail ? thumbnail.name : "📁 Choose Thumbnail Image"}
            </label>

            <input
              id="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              className="hidden"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={isCreating}
            className={`w-full py-2 rounded text-white ${isCreating ? "bg-gray-500" : "bg-black hover:bg-gray-800"}`}
          >
            {isCreating ? "Creating..." : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCourse;
