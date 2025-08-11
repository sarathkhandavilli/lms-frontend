import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import CreateCourse from '../components/CreateCourse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MentorDashboard = () => {
  const mentorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const [mentorDashboard, setMentorDashboard] = useState({});
  const [mentorCourses, setMentorCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [view, setView] = useState('courses');
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const updateCourse = (id) => {
    navigate(`/course/${id}`);
  };

  const deleteCourse = async (courseId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`https://lms-backend-ol4a.onrender.com/courses/delete?courseId=${courseId}&mentorId=${mentorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course deleted successfully');
      fetchMentorDashboard();
      showMentorCourses();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete course');
    }
  };

  const fetchMentorDashboard = async () => {
    try {
      const response = await axios.get(
        `https://lms-backend-ol4a.onrender.com/courses/mentor/dashboard?mentorId=${mentorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMentorDashboard(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showMentorCourses = async () => {
    setView('courses');
    try {
      const response = await axios.get(
        `https://lms-backend-ol4a.onrender.com/courses/fetch/mentor-wise?mentorId=${mentorId}&status=ACTIVE`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data)
      setMentorCourses(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const showEnrollmentsForMentor = async () => {
    setView('enrollments');
    try {
      const response = await axios.get(
        `https://lms-backend-ol4a.onrender.com/enrollment/fetch/mentor-wise?mentorId=${mentorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setEnrollments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (mentorId) {
      fetchMentorDashboard();
      showMentorCourses();
    }
  }, [mentorId]);

  return (
    <>
      <Navbar onDashboardClick={fetchMentorDashboard} />

      <div className="flex justify-center min-h-screen -mt-8 py-6">
        <div className="w-full max-w-4xl bg-white p-6 rounded-lg">
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-bold">Mentor Dashboard</h2>
            <button
              className="bg-black text-white px-4 py-2 rounded"
              onClick={() => setShowModal(true)}
            >
              + Create Course
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
              <div>
                <p className="text-sm text-gray-500">My Courses</p>
                <p className="text-2xl font-bold text-black">{mentorDashboard.totalActiveCourses || 0}</p>
              </div>
              <span className="text-blue-600 text-3xl">📘</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
              <div>
                <p className="text-sm text-gray-500">Total Purchases</p>
                <p className="text-2xl font-bold text-black">{mentorDashboard.totalCoursePurchases || 0}</p>
              </div>
              <span className="text-3xl">🧑‍🎓</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-bold text-black">₹{mentorDashboard.totalSale || 0}</p>
              </div>
              <span className="text-purple-600 text-3xl">💰</span>
            </div>

            <div className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border">
              <div>
                <p className="text-sm text-gray-500">Deleted Courses</p>
                <p className="text-2xl font-bold text-black">{mentorDashboard.totalDeletedCourses || 0}</p>
              </div>
              <span className="text-red-500 text-3xl">🗑️</span>
            </div>
          </div>

          <div className="flex gap-4 my-4">
            <button
              className={`border px-4 py-1 rounded-lg ${view === 'courses' ? 'bg-black text-white' : ''}`}
              onClick={showMentorCourses}
            >
              My Courses
            </button>
            <button
              className={`border px-4 py-1 rounded-lg ${view === 'enrollments' ? 'bg-black text-white' : ''}`}
              onClick={showEnrollmentsForMentor}
            >
              Enrollments
            </button>
          </div>

          <div>
            {view === 'courses' && (
              <>
                <h3 className="font-bold mb-2">My Courses</h3>
                {mentorCourses.length === 0 ? (
                  <p>No courses created.</p>
                ) : (
                  <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {mentorCourses.map((course) => (
                      <CourseCard
                        key={course.id}
                        course={course}
                        showActions={true}
                        onDelete={ () => deleteCourse(course.id)}
                        onEdit={() => navigate(`/course/${course.id}`)}
                      />
                    ))}
                  </ul>
                )}
              </>
            )}

            {view === 'enrollments' && (
              <>
                <h3 className="font-bold mb-2">Enrollments</h3>
                {enrollments.length === 0 ? (
                  <p>No enrollments found.</p>
                ) : (
                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {enrollments.map((enrollment, index) => (
                      <li key={index} className="border p-4 rounded bg-gray-50">
                        <p><strong>Learner:</strong> {enrollment.learnerName}</p>
                        <p><strong>Amount:</strong> ₹{enrollment.amount}</p>
                        <p><strong>Enrolled On:</strong> {enrollment.enrolledTime}</p>
                        <p><strong>Course:</strong> {enrollment.courseName}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <CreateCourse onClose={() => setShowModal(false)} />
      )}
    </>
  );
};

export default MentorDashboard;
