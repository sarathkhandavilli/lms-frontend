import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import CourseCard from '../components/CourseCard';
import { useNavigate } from 'react-router-dom';
import CreateCourse from '../components/CreateCourse';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { handleTokenExpiration } from '../components/HandleTokenExpiration';
import api from '../api';


const MentorDashboard = () => {
  const mentorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');
  const [isDashboard,setIsDashboard] = useState(false)

  const [mentorDashboard, setMentorDashboard] = useState({});
  const [mentorCourses, setMentorCourses] = useState([]);
  const [mentorEnrollments, setMentorEnrollments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [view, setView] = useState('courses');
  const [showModal, setShowModal] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [userDetails,setUserDetails] = useState({});
  const [mentorToken, setMentorToken] = useState('');
  const UserId = localStorage.getItem('userId');

  const navigate = useNavigate();


  
  useEffect( () => {

    const fetchUserDetails = async () => {

      setMentorToken(localStorage.getItem('token'))
      console.log(token)
      try {
        const response =  await api.get(
            `user/checkUserStatus?status=INACTIVE&mentorId=${UserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          console.log("data "+ response.data)
        setUserDetails(response.data);
      } catch(error) {
        console.log(error)
      }
      
    }
    fetchUserDetails();
    
})



  if (userDetails === 'INACTIVE') {
    toast.info("your account was deactivated! please contact admin")
    localStorage.clear();
                navigate('/');
  } else {
    console.log(userDetails)
  }

  const updateCourse = (id) => {
    navigate(`/course/${id}`);
  };

  const deleteCourse = async (courseId,categoryId,thumbnailName) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this course?");
    if (!confirmDelete) return;

    try {
      await api.delete(`courses/delete?courseId=${courseId}&mentorId=${mentorId}&categoryId=${categoryId}&thumbnailName=${thumbnailName}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Course deleted successfully');
      showMentorCourses();
      fetchMentorDashboard();
      
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete course');
    }
  };

  const fetchMentorDashboard = async () => {


    try {
      const response = await api.get(
        `courses/mentor/dashboard?mentorId=${mentorId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setIsDashboard(true)
      }
      setMentorDashboard(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
                toast.info('session expired please login again!')
          }
      handleTokenExpiration(error,navigate)
      console.log(error);
    }
  };

  const showMentorCourses = async () => {
    setView('courses');
    setIsLoading(true);
    try {
      const response = await api.get(
        `courses/fetch/mentor-wise?mentorId=${mentorId}&status=ACTIVE`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data.data)
      setMentorCourses(response.data.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
                toast.info('session expired please login again!')
          }
      handleTokenExpiration(error,navigate)
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  let userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log(userTimeZone)

  const showEnrollmentsByMentor = async () => {
    setView('mentorenrollments')
    setIsLoading(true)
    try {
      const response = await api.get(
        `enrollment/fetch/learner-wise?learnerId=${mentorId}&userTimeZone=${userTimeZone}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      console.log(response.data.data)
      setMentorEnrollments(response.data.data);
    } catch(error) {
      if (error.response && error.response.status === 401) {
                toast.info('session expired please login again!')
          }
      handleTokenExpiration(error,navigate)
      console.log(error);
    } finally {
      setIsLoading(false)
    }
  }

  const handleCourseClick = (courseId) => {
    navigate(`/course/${courseId}`);
  };

  const showEnrollmentsForMentor = async () => {
    setView('enrollments');
    setIsLoading(true)
    try {
      const response = await api.get(
        `enrollment/fetch/mentor-wise?mentorId=${mentorId}&userTimeZone=${userTimeZone}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setEnrollments(response.data.data);
      fetchMentorDashboard();
    } catch (error) {
      if (error.response && error.response.status === 401) {
                toast.info('session expired please login again!')
          }
      handleTokenExpiration(error,navigate)
      console.log(error);
    } finally {
      setIsLoading(false)
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
              onClick={isDashboard ? showMentorCourses : null}
            >
              My Courses
            </button>
            <button
              className={`border px-4 py-1 rounded-lg ${view === 'enrollments' ? 'bg-black text-white' : ''}`}
              onClick={showEnrollmentsForMentor}
            >
              Course Enrollments
            </button>

            <button
              className={`border px-4 py-1 rounded-lg ${view === 'mentorenrollments' ? 'bg-black text-white' : ''}`}
              onClick={showEnrollmentsByMentor}
            >
              My Enrollments
            </button>
          </div>

          <div>
            {view === 'courses' && (
              isLoading ? (
                <div>Fetching Courses...</div>
              ) : (
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
                          onDelete={() => deleteCourse(course.id, course.categoryId, course.thumbnailName)}
                          onEdit={() => navigate(`/course/${course.id}`)}
                        />
                      ))}
                    </ul>
                  )}
                </>
              )
            )}

            {view === 'enrollments' && (
              
              isLoading ? (
                <div>Fetching course enrollments...</div>
              ) : (
                <>
                  <h3 className="font-bold mb-2">Course Enrollments</h3>
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
              )
            )}

            {view === 'mentorenrollments' && (
              
              isLoading ? (
                <div>Fetching your enrollments...</div>
              ) : (
                <>
                <h3 className="font-bold mb-2">My Enrollments</h3>
                {mentorEnrollments.length === 0 ? (
                  <p>no courses enrolled</p>
                ) : (

                  <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {mentorEnrollments.map( (enrollment,index) => (
                    <li
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
                    </li>
                  ))}
                    </ul>
                )}
                  
              
                </>
              )
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
