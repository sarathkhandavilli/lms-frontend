import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const MentorImage = ({ fileName }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`https://lms-backend-ol4a.onrender.comuser/fetch/${fileName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
      } catch (error) {
        console.error('Error loading image:', error);
      }
    };

    if (fileName) {
      fetchImage();
    }
  }, [fileName]);

  return imageUrl ? (
    <img src={imageUrl} alt="Mentor Profile" className="w-32 h-32 rounded-full object-cover mx-auto mb-4" />
  ) : (
    <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4" />
  );
};

export default MentorImage;
