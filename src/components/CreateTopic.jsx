import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateTopic = ({ sectionId, onClose, onTopicCreated }) => {
  const [topicData, setTopicData] = useState({
    topicNo: '',
    name: '',
    description: '',
    youtubeUrl: ''
  });

  const mentorId = localStorage.getItem('userId');
  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setTopicData({ ...topicData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const payload = {
      ...topicData,
      sectionId: parseInt(sectionId)
    };

    try {
      await axios.post('https://lms-backend-ol4a.onrender.com/courses/section/topic/add', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Topic added successfully');
      onClose();
      onTopicCreated();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add topic');
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl space-y-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Topic</h2>
          <button onClick={onClose} className="text-xl">&times;</button>
        </div>

        <input
          type="text"
          name="topicNo"
          placeholder="Topic No"
          value={topicData.topicNo}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="name"
          placeholder="Topic Name"
          value={topicData.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={topicData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <input
          type="text"
          name="youtubeUrl"
          placeholder="YouTube URL"
          value={topicData.youtubeUrl}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-black text-white py-2 rounded"
        >
          Add Topic
        </button>
      </div>
    </div>
  );
};

export default CreateTopic;
