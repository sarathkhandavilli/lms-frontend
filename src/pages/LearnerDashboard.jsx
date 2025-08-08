import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';

const LearnerDashboard = () => {
  const learnerId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  const fetchMyCourses = async () => {
    try {
      const response = await axios.get(
        `https://lms-backend-ol4a.onrender.com/enrollment/fetch/learner-wise?learnerId=${learnerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourses(response.data.data);
    } catch (error) {
      console.error(error);
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

        {courses.length === 0 ? (
          <p className="text-center text-gray-600">No courses enrolled yet.</p>
        ) : (
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
                  {new Date(enrollment.enrollmentTime).toLocaleString()}
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
