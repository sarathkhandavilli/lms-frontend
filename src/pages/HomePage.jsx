import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import CourseCard from '../components/CourseCard';
import Navbar from '../components/Navbar';
import api from '../api';
import LoginModal from '../components/LoginModal';
import RegisterModal from '../components/RegisterModal';

const HomePage = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const assignCategory = (id) => setCategory(id);
  const assignCourse = (id) => navigate(`/course/${id}`);

  // Fetch all courses
  const fetchAllCourses = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('courses/fetch/status-wise?status=active');
      setCourses(response.data.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchAllCourses(); }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('category/fetch/all?status=active');
        setCategories(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  // Search courses by name
  const searchByCourseName = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return fetchAllCourses();
    try {
      const response = await api.get(
        `courses/fetch/name-wise?courseName=${trimmedName}&status=active`
      );
      setCourses(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch courses by category
  useEffect(() => {
    const fetchCategoryCourses = async () => {
      if (category === 0) return fetchAllCourses();
      try {
        setIsLoading(true);
        const response = await api.get(
          `courses/fetch/category-wise?categoryId=${category}&status=ACTIVE`
        );
        setCourses(response.data.data);
      } catch (error) {
        setCourses([]);
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategoryCourses();
  }, [category]);

  return (
    <>
      {/* Pass modal control functions to Navbar */}
      <Navbar 
        openLoginModal={() => setShowLoginModal(true)} 
      />

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal 
          onClose={() => setShowLoginModal(false)} 
          RegisterModal={() => {
            setShowLoginModal(false);
            setShowRegisterModal(true);
          }}
        />
      )}

      {/* Register Modal */}
      {showRegisterModal && (
        <RegisterModal
          onClose={() => setShowRegisterModal(false)}
          LoginModal={() => {
            setShowRegisterModal(false);
            setShowLoginModal(true);
          }}
        />
      )}

      {/* Page Header */}
      <div className="text-center mt-4">
        <h1 className="text-3xl font-bold text-black">Explore Our Courses</h1>
        <p className="text-gray-600 mt-2">
          Discover high-quality courses taught by expert mentors. Start your learning journey today.
        </p>
      </div>

      {/* Search & Category */}
      <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4 mt-10 mb-8 px-4 w-full">
        {/* Search */}
        <div className="flex items-center border rounded-md overflow-hidden w-full sm:w-[350px] shadow-sm bg-white">
          <input
            type="text"
            placeholder="Search courses..."
            className="px-4 py-2 w-full text-black outline-none"
            onChange={(e) => {
              setName(e.target.value);
              if (!e.target.value.trim()) {
                fetchAllCourses();
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
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-black">
            ▼
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-6">Fetching courses...</div>
          ) : courses.length === 0 ? (
            <div className="col-span-full text-center py-6">
              No courses found. Try another category or search term.
            </div>
          ) : (
            courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onClick={() => assignCourse(course.id)}
              />
            ))
          )}
        </div>
      </div>

      
    </>
  );
};

export default HomePage;
