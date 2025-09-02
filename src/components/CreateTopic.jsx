import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';

const CreateTopic = ({ courseId, sectionId, onClose, onTopicCreated }) => {

  const mentorId = localStorage.getItem("userId");

  const [topicData, setTopicData] = useState({
    topicNo: '',
    name: '',
    description: '',
    youtubeUrl: '',
    mentorId:mentorId,
    courseId:courseId
  });

  const [isAdding, setIsAdding] = useState(false);

  const token = localStorage.getItem('token');

  const handleChange = (e) => {
    setTopicData({ ...topicData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (isAdding) return;
    setIsAdding(true);

    if (!topicData.name || !topicData.topicNo || !topicData.description || !topicData.youtubeUrl) {
      toast.info('please fill all required fields!')
      setIsAdding(false);
      return ;
    }

    const payload = {
      ...topicData,
      sectionId: parseInt(sectionId)
    };

    try {
      await api.post('courses/section/topic/add', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      toast.success('Topic added successfully');
      onTopicCreated();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to add topic');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 backdrop-blur-md flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-[500px] shadow-xl space-y-4">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Add Topic</h2>
          <button
            onClick={onClose}
            disabled={isAdding}
            className={`text-xl ${isAdding ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            &times;
          </button>
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
          disabled={isAdding}
          className={`w-full py-2 rounded text-white ${isAdding ? 'bg-gray-500' : 'bg-black hover:bg-gray-800'}`}
        >
          {isAdding ? 'Adding...' : 'Add Topic'}
        </button>
      </div>
    </div>
  );
};

export default CreateTopic;
