import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MentorImage from '../components/MentorImage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const AddMentorDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mentorForm, setMentorForm] = useState({
    age: '',
    experience: '',
    qualification: '',
    profession: '',
    profilePic: null,
  });

  const [refreshDetails, setRefreshDetails] = useState(false);
  const [previewPic, setPreviewPic] = useState(null);
  const [mentorDetails, setMentorDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const mentorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  //fetching mentor details
  useEffect(() => {
    const fetchMentorFullProfile = async () => {
      setIsLoading(true);

      try {
        const response = await api.get(
          `user/fetch/mentor-id?mentorId=${mentorId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const mentor = response.data.data;
        const detail = mentor.mentorDetail;

        if (detail) {
          setMentorDetails({
            age: detail.age,
            experience: detail.experience,
            qualification: detail.qualification,
            profession: detail.profession,
            profilePic: detail.profilePic,
            fullName: `${mentor.firstName} ${mentor.lastName}`
          });
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      } catch (err) {
        console.error('Mentor not found, show form');
        setShowForm(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentorFullProfile();
  }, [mentorId, token, refreshDetails]);

  
  const handleMentorFormChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      const file = files[0];
      setMentorForm((prev) => ({
        ...prev,
        [name]: file,
      }));
      setPreviewPic(URL.createObjectURL(file));
    } else {
      setMentorForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  
  const handleMentorSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = new FormData();
    form.append('age', mentorForm.age);
    form.append('experience', mentorForm.experience);
    form.append('qualification', mentorForm.qualification);
    form.append('profession', mentorForm.profession);
    form.append('profilePic', mentorForm.profilePic);
    form.append('mentorId', mentorId);

    try {
      await api.post('/user/mentordetail/add', form, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Mentor details submitted successfully!');
      setShowForm(false);
      setPreviewPic(null);
      setRefreshDetails((prev) => !prev);
    } catch (error) { 
      console.error(error);
      toast.error('Error submitting mentor details');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateClick = () => {
    setIsUpdating(true);
    setShowForm(true);
    setIsUpdating(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-black text-lg font-medium">Fetching mentor details...</p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen text-white px-4">
      {showForm ? (
        <form
          onSubmit={handleMentorSubmit}
          className="bg-white text-black rounded-lg shadow-xl p-8 w-full max-w-md space-y-4"
        >
          <h2 className="text-2xl font-semibold mb-4 text-center text-black">Add Mentor Details</h2>

          <input
            type="number"
            name="age"
            placeholder="Age"
            onChange={handleMentorFormChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="number"
            name="experience"
            placeholder="Experience"
            onChange={handleMentorFormChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="qualification"
            placeholder="Qualification"
            onChange={handleMentorFormChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <input
            type="text"
            name="profession"
            placeholder="Profession"
            onChange={handleMentorFormChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
          />

          <div className="w-full">
            <label
              htmlFor="profilePic"
              className="block w-full text-center cursor-pointer bg-gray-200 hover:bg-gray-300 text-black py-2 rounded transition"
            >
              {mentorForm.profilePic ? mentorForm.profilePic.name : "📁 Choose Profile Picture"}
            </label>

            <input
              id="profilePic"
              type="file"
              name="profilePic"
              accept="image/*"
              onChange={handleMentorFormChange}
              required
              className="hidden"
            />
          </div>

          {previewPic && (
            <img
              src={previewPic}
              alt="Profile Preview"
              className="mt-4 w-24 h-24 object-cover rounded-full mx-auto border border-gray-300"
            />
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white py-2 rounded transition ${
              isSubmitting ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
            }`}
          >
            {isSubmitting ? 'Updating...' : 'Submit'}
          </button>
        </form>
      ) : (
        mentorDetails && (
          <div className="bg-white text-black shadow-xl rounded-lg p-8 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-2 text-center">Mentor Profile</h2>
            <p className="text-xl font-medium text-center mb-4">{mentorDetails.fullName}</p>

            {mentorDetails.profilePic && (
              <div className="flex justify-center mb-4">
                <MentorImage fileName={mentorDetails.profilePic} />
              </div>
            )}

            <div className="space-y-2 text-sm">
              <p><strong>Age:</strong> {mentorDetails.age}</p>
              <p><strong>Experience:</strong> {mentorDetails.experience} years</p>
              <p><strong>Qualification:</strong> {mentorDetails.qualification}</p>
              <p><strong>Profession:</strong> {mentorDetails.profession}</p>
            </div>

            <button
              onClick={handleUpdateClick}
              disabled={isUpdating}
              className={`w-full text-white py-2 mt-6 rounded transition ${
                isUpdating ? 'bg-gray-500 cursor-not-allowed' : 'bg-black hover:bg-gray-800'
              }`}
            >
              {isUpdating ? 'Updating...' : 'Update'}
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AddMentorDetails;
