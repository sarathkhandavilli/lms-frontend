import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MentorImage from '../components/MentorImage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const AddMentorDetails = () => {
  const [mentorForm, setMentorForm] = useState({
    age: '',
    experience: '',
    qualification: '',
    profession: '',
    profilePic: null,
  });

  const [mentorDetails, setMentorDetails] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const mentorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMentorFullProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/fetch/mentor-id?mentorId=${mentorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
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
            fullName: mentor.firstName + ' ' + mentor.lastName
          });
          setShowForm(false);
        } else {
          setShowForm(true);
        }
      } catch (err) {
        console.error('Mentor not found, show form');
        setShowForm(true);
      }
    };

    fetchMentorFullProfile();
  }, [mentorId, token]);

  const handleMentorFormChange = (e) => {
    const { name, value, files } = e.target;
    setMentorForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleMentorSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append('age', mentorForm.age);
    form.append('experience', mentorForm.experience);
    form.append('qualification', mentorForm.qualification);
    form.append('profession', mentorForm.profession);
    form.append('profilePic', mentorForm.profilePic);
    form.append('mentorId', mentorId);

    try {
      const response = await axios.post(
        'http://localhost:8080/user/mentordetail/add',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMentorDetails(response.data.data);
      setShowForm(false);
    } catch (error) {
      console.error(error);
      toast.error('Error submitting mentor details');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen  text-white px-4">
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
          <input
            type="file"
            name="profilePic"
            accept="image/*"
            onChange={handleMentorFormChange}
            required
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
          />
          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Submit
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
              onClick={() => setShowForm(true)}
              className="w-full bg-black text-white py-2 mt-6 rounded hover:bg-gray-800 transition"
            >
              Update
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default AddMentorDetails;
