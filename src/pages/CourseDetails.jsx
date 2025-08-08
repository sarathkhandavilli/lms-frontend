import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CreateSection from '../components/CreateSection';
import CreateTopic from '../components/CreateTopic';

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const userId = localStorage.getItem('userId');

  const [courseDetails, setCourseDetails] = useState(null);
  const [expandedSection, setExpandedSection] = useState(null);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showTopicModal, setShowTopicModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  const fetchCourseDetailsForLearner = async () => {
    try {
      const response = await axios.get(
        `https://lms-backend-ol4a.onrender.com/courses/fetch/course-user-id?cid=${id}&uid=${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCourseDetails(response.data.data);
      setIsEnrolled(true);
    } catch (error) {
      if (error.response?.status === 404) setIsEnrolled(false);
    }
  };

  const fetchCourseDetails = async () => {
    try {
      const response = await axios.get(
        `https://lms-backend-ol4a.onrender.com/courses/fetch/course-id?courseId=${id}`
      );
      setCourseDetails(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const enrollLearner = async (courseId) => {
    try {
      const data = {
        courseId,
        learnerId: parseInt(userId),
        type: courseDetails.type,
        amount: 0,
      };
      await axios.post('https://lms-backend-ol4a.onrender.com/enrollment/enroll', data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Enrolled successfully!');
      setIsEnrolled(true);
    } catch (err) {
      alert('Enrollment failed');
    }
  };

  useEffect(() => {
    fetchCourseDetailsForLearner();
  }, []);

  useEffect(() => {
    if (isEnrolled === false) fetchCourseDetails();
  }, [isEnrolled]);

  const toggleSection = (index) => {
    setExpandedSection((prev) => (prev === index ? null : index));
  };

  if (!courseDetails) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center min-h-screen text-xl font-medium text-gray-700">
          Loading...
        </div>
      </>
    );
  }

  const discountedPrice = (
    courseDetails.price -
    (courseDetails.price * courseDetails.discountInPercent) / 100
  ).toFixed(2);

  const validSections = courseDetails.courseSectionDtos?.filter(
    (section) => section.name && section.sectionNo && section.id !== 0
  );

  return (
    <>
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10 bg-white shadow-xl rounded-lg -mt-6 mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">
          {courseDetails.name}
        </h1>

        <div className="space-y-3 text-gray-700 text-sm sm:text-base">
          <p><span className="font-semibold">Description:</span> {courseDetails.description}</p>
          <p><span className="font-semibold">Author Note:</span> {courseDetails.authorCourseNote}</p>
          <p>
            <span className="font-semibold">Price:</span>{' '}
            {courseDetails.price === 0 ? (
              <span className="text-green-600 font-bold">Free</span>
            ) : (
              <>
                <span className="line-through text-red-600">₹{courseDetails.price.toFixed(2)}</span>{' '}
                <span className="text-green-600 font-bold">₹{discountedPrice}</span>
              </>
            )}
          </p>
          <p><span className="font-semibold">Discount:</span> {courseDetails.discountInPercent}%</p>
          <p><span className="font-semibold">Type:</span> {courseDetails.type}</p>
          <p><span className="font-semibold">Prerequisite:</span> {courseDetails.prerequisite}</p>
        </div>

        {!isEnrolled && (role === 'LEARNER' || !role) && (
          <button
            onClick={() => {
              if (!role) {
                alert("Please login");
                return;
              }
              if (courseDetails.price > 0) {
                navigate(`/payment`, {
                  state: {
                    courseId: courseDetails.courseId,
                    learnerId: parseInt(userId),
                    amount: discountedPrice,
                    type: courseDetails.type,
                  },
                });
              } else {
                enrollLearner(courseDetails.courseId);
              }
            }}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-zinc-800 transition"
          >
            Enroll Now
          </button>
        )}

        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Sections</h2>

          {role === 'MENTOR' && parseInt(courseDetails.mentorId) === parseInt(userId) && (
            <button
              className="bg-black text-white px-4 py-2 rounded mb-4 hover:bg-black transition"
              onClick={() => setShowSectionModal(true)}
            >
              + Add Section
            </button>
          )}

          {validSections?.length > 0 && (
            <ul className="space-y-4">
              {validSections.map((section, index) => (
                <li key={index} className="bg-gray-50 rounded-lg shadow-sm transition-all">
                  <button
                    onClick={() => toggleSection(index)}
                    className="w-full flex justify-between items-center p-4 font-semibold text-black hover:bg-black-100"
                  >
                    <span>{section.sectionNo}. {section.name}</span>
                    <span className="text-sm text-black-500">
                      {expandedSection === index ? '▲' : '▼'}
                    </span>
                  </button>

                  {expandedSection === index && (
                    <div className="bg-white border-t border-black-200 px-4 py-4">
                      <p className="text-gray-600 mb-3">{section.description}</p>

                      {role === 'MENTOR' && parseInt(courseDetails.mentorId) === parseInt(userId) && (
                        <button
                          className="bg-black text-white px-4 py-2 rounded mb-4 hover:bg-black transition"
                          onClick={() => {
                            setSelectedSectionId(section.id);
                            setShowTopicModal(true);
                          }}
                        >
                          + Add Topic
                        </button>
                      )}

                      {section.courseSectionTopicDtos?.length > 0 && (
                        <ul className="space-y-3 mt-4">
                          {section.courseSectionTopicDtos.map((topic, idx) => (
                            <li key={idx} className="border-b pb-2">
                              <h4 className="font-semibold text-black-600">
                                {topic.topicNo} {topic.name}
                              </h4>
                              <p className="text-sm text-gray-700">{topic.description}</p>
                              {( (isEnrolled || role === 'MENTOR') && (topic.youtubeUrl !== null)) && (
                                <p className="mt-1 text-black">
                                  ▶️ <a href={topic.youtubeUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-black">Watch Video</a>
                                </p>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modals */}
      {showSectionModal && (
        <CreateSection
          courseId={id}
          onClose={() => setShowSectionModal(false)}
          onSectionCreated={() => window.location.reload()}
        />
      )}

      {showTopicModal && (
        <CreateTopic
          sectionId={selectedSectionId}
          onClose={() => setShowTopicModal(false)}
          onTopicCreated={() => window.location.reload()}
        />
      )}
    </>
  );
};

export default CourseDetails;
