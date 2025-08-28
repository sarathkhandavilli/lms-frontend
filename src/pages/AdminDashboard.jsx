import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import CreateCategory from './CreateCategory';
import ProfileAvatar from '../components/ProfileAvatar';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';


const AdminDashboard = () => {
  const token = localStorage.getItem('token');
  const [categories, setCategories] = useState([]);
  const [learners, setLearners] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [view, setView] = useState('categories');
  const [mentors, setMentors] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  const handleClose = () => {
    setShowModal(false);
    setShowUpdateModal(false);
    setSelectedCategoryId(null);
  };

  const handleUpdateCategory = (category) => {
    setSelectedCategoryId(category.id);
    setShowUpdateModal(true);
  };

  const handleDeleteMentor = async (mentorId,mentorImageName) => {
    if (!window.confirm('Are you sure you want to delete this mentor?')) return;

    try {
      await api.delete(`user/mentor/delete?mentorId=${mentorId}&mentorImageName=${mentorImageName}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Mentor deleted successfully');
      fetchUsers('MENTOR');
    } catch (error) {
      console.error('Failed to delete mentor:', error);
      toast.error('Failed to delete mentor');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await api.delete(`category/delete?categoryId=${categoryId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success('Category deleted successfully');
      fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error('Failed to delete category');
    }
  };

  const showEnrollments = async () => {
    setView('enrollments');
    try {
      const response = await api.get(`enrollment/fetch/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEnrollments(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchUsers = async (fetchRole) => {
    setView(fetchRole === 'LEARNER' ? 'learners' : 'mentors');

    try {
      const response = await api.get(`user/fetch/role-wise?role=${fetchRole}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchRole === 'LEARNER'
        ? setLearners(response.data.data)
        : setMentors(response.data.data);
    } catch (error) {
      // toast.error(`Failed to fetch ${fetchRole}s`);
      console.log(error);
    }
  };

  const fetchCategories = async () => {
    setView('categories');
    try {
      const response = await api.get('category/fetch/all?status=active');
      setCategories(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <>
      <Navbar onDashboardClick={fetchCategories} />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition text-sm sm:text-base"
            onClick={() => setShowModal(true)}
          >
            + Create Category
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`border px-4 py-2 rounded text-sm sm:text-base ${
              view === 'categories' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
            }`}
            onClick={fetchCategories}
          >
            Categories
          </button>
          <button
            className={`border px-4 py-2 rounded text-sm sm:text-base ${
              view === 'learners' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
            }`}
            onClick={() => fetchUsers('LEARNER')}
          >
            Learners
          </button>
          <button
            className={`border px-4 py-2 rounded text-sm sm:text-base ${
              view === 'mentors' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
            }`}
            onClick={() => fetchUsers('MENTOR')}
          >
            Mentors
          </button>
          <button
            className={`border px-4 py-2 rounded text-sm sm:text-base ${
              view === 'enrollments' ? 'bg-black text-white' : 'hover:bg-black hover:text-white'
            }`}
            onClick={showEnrollments}
          >
            Enrollments
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {view === 'categories' &&
            categories.map((category, index) => (
              <div key={index} className="border p-4 bg-gray-100 rounded shadow-sm flex flex-col justify-between">
                <h1 className="font-semibold text-lg truncate">{category.name}</h1>
                <p className="text-sm text-gray-600 line-clamp-3">{category.description}</p>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button
                    className="bg-black border px-3 py-1 rounded text-white hover:bg-zinc-800 text-sm"
                    onClick={() => handleUpdateCategory(category)}
                  >
                    Update
                  </button>

                  <button
                    className="bg-black border px-3 py-1 rounded text-white hover:bg-zinc-800 text-sm"
                    onClick={() => handleDeleteCategory(category.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}

          {view === 'learners' &&
            learners.map((learner, index) => (
              <div key={index} className="border p-4 bg-gray-100 rounded shadow-sm">
                <h2 className="font-medium text-base sm:text-lg">
                  {learner.firstName} {learner.lastName}
                </h2>
                <p className="text-sm text-gray-600 truncate">{learner.emailId}</p>
              </div>
            ))}

          {view === 'mentors' &&
            mentors.map((mentor, index) => (
              <div
                key={index}
                className="border p-4 rounded shadow-sm bg-gray-100 flex flex-col sm:flex-row gap-4 items-start"
              >
                <ProfileAvatar
                  userId={mentor.id}
                  firstName={mentor.firstName}
                  lastName={mentor.lastName}
                  profilePic={mentor.mentorDetail?.profilePic}
                />

                <div className="flex-1 min-w-0">
                  <h2 className="font-medium text-lg truncate">
                    {mentor.firstName} {mentor.lastName}
                  </h2>
                  <p className="text-sm text-gray-600 truncate">{mentor.emailId}</p>
                      <p className="text-sm text-gray-600">Phone: {mentor.phoneNo}</p>

                  {!mentor.mentorDetail || mentor.mentorDetail.id === 0 ? (
                    
                    <p>He hasn't uploaded details</p>
                  ) : (
                    <>
                      
                      <p className="mt-2 text-sm">
                        <strong>Age:</strong> {mentor.mentorDetail.age} <br />
                        <strong>Experience:</strong> {mentor.mentorDetail.experience} yrs
                      </p>
                      <p className="text-sm">
                        <strong>Qualification:</strong> {mentor.mentorDetail.qualification}
                      </p>
                      <p className="text-sm">
                        <strong>Profession:</strong> {mentor.mentorDetail.profession}
                      </p>
                    </>
                  )}
              
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      className="bg-black border px-3 py-1 rounded text-white hover:bg-zinc-800 text-sm"
                      onClick={() => handleDeleteMentor(mentor.id,mentor.mentorDetail?.profilePic)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {view === 'enrollments' &&
            enrollments.map((enrollment, index) => (
              <div key={index} className="border p-4 bg-gray-100 rounded shadow-sm">
                <h1 className="font-medium text-base sm:text-lg truncate">
                  Learner: {enrollment.learnerName}
                </h1>
                <p className="text-sm truncate">Mentor: {enrollment.mentorName}</p>
                <p className="text-sm truncate">Course: {enrollment.courseName}</p>
                <p className="text-sm truncate">Amount Paid: ₹{enrollment.amountPaid}</p>
              </div>
            ))}
        </div>
      </div>

      {showModal && <CreateCategory onClose={handleClose} onCategoryCreated={fetchCategories} />}

      {showUpdateModal && (
        <CreateCategory id={selectedCategoryId} onClose={handleClose} onCategoryCreated={fetchCategories} />
      )}
    </>
  );
};

export default AdminDashboard;
