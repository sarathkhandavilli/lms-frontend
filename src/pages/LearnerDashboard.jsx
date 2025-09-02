import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleTokenExpiration } from '../components/HandleTokenExpiration';
import api from '../api';

const LearnerDashboard = () => {
  const learnerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [role,setRole] = useState('')
  const [isLoading, setIsLoading] = useState(false);

  let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


  const fetchMyCourses = async () => {
    try {
      setIsLoading(true)
      const response = await api.get(
        `enrollment/fetch/learner-wise?learnerId=${learnerId}&userTimeZone=${userTimeZone}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      console.log(response.data.data)
      setCourses(response.data.data);
    } catch (error) {
    if (error.response && error.response.status === 401) {
          toast.info('session expired please login again!')
    }
      handleTokenExpiration(error,navigate,setRole)
      console.error("Error after handling token expiration" + error);
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    fetchMyCourses();
  }, []);

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <>
      <Navbar onDashboardClick={fetchMyCourses} />

      <div className="min-h-screen  bg-gray-100 py-8 px-4">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          My Enrolled Courses
        </h2>

        {courses.length === 0 && !isLoading ? (
          <p className="text-center text-gray-600">No courses enrolled yet.</p>
        ) : isLoading ? (<div className='text-center text-gray-600'> Fetching your courses... </div>) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {courses.map((enrollment, index) => (
              <div
                key={index}
                onClick={() => handleCourseClick(enrollment.courseId)}
                className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-1 transition duration-300 cursor-pointer"
              >
                <h3 className="text-lg font-semibold mb-2 text-black">
                  {enrollment.courseName}
                </h3>
                <p className="text-sm text-gray-700">
                  <strong>Amount Paid:</strong> ₹{enrollment.amountPaid}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Enrollment ID:</strong> {enrollment.enrollmentId}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Enrollment Time:</strong>{' '}
                  {enrollment.enrollmentTime}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LearnerDashboard;
