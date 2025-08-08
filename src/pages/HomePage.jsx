import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';

const HomePage = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(0);

  const assignCategory = (id) => {
    setCategory(id);
  };

  const assignCourse = (id) => {
    navigate(`/course/${id}`);
  };

  const fetchAllcourses = async () => {
    try {
      const response = await axios.get(
        'https://lms-backend-ol4a.onrender.com/courses/fetch/status-wise?status=active'
      );
      setCourses(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllcourses();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          'https://lms-backend-ol4a.onrender.com/category/fetch/all?status=active'
        );
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const searchByCourseName = async () => {
    const trimmedName = name.trim();
    if (trimmedName !== '') {
      try {
        const response = await axios.get(
          `https://lms-backend-ol4a.onrender.com/courses/fetch/name-wise?courseName=${trimmedName}&status=active`
        );
        setCourses(response.data.data);
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    const fetchCategoryCourses = async () => {
      if (category !== 0) {
        try {
          const response = await axios.get(
            `https://lms-backend-ol4a.onrender.com/courses/fetch/category-wise?categoryId=${category}&status=ACTIVE`
          );
          setCourses(response.data.data);
        } catch (error) {
          console.log(error);
        }
      } else {
        fetchAllcourses();
      }
    };

    fetchCategoryCourses();
  }, [category]);

  return (
    <>
      <Navbar />

      <div className="text-center mt-4">
        <h1 className="text-3xl font-bold text-black">Explore Our Courses</h1>
        <p className="text-gray-600 mt-2">
          Discover high-quality courses taught by expert mentors. Start your learning journey today.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4 mt-10 mb-8 px-4 w-full">
        {/* Search Input */}
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-[350px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search courses..."
            className="px-4 py-2 w-full text-black outline-none"
            onChange={(e) => {
              setName(e.target.value);
              if (e.target.value.trim() === '') {
                fetchAllcourses();
                setCategory(0);
              }
            }}
          />
          <button
            onClick={searchByCourseName}
            className="px-4 py-2 bg-white text-black border-l hover:bg-black hover:text-white transition"
          >
            🔍
          </button>
        </div>

        {/* Category Dropdown */}
        <div className="relative w-full sm:w-[200px]">
          <select
            className="appearance-none w-full border px-4 py-2 pr-10 rounded-md text-black shadow-sm bg-white cursor-pointer"
            onChange={(e) => assignCategory(Number(e.target.value))}
          >
            <option value={0}>All Categories</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
            ▼
          </div>
        </div>
      </div>

      {/* Course List */}
      <div className="px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onClick={() => assignCourse(course.id)}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default HomePage;
