import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';


const ProfileAvatar = ({  userId, firstName, lastName, profilePic }) => {

  const Role = localStorage.getItem('role');
  const UserId = localStorage.getItem('userId');
  const FirstName =  localStorage.getItem('firstName');
  const LastName = localStorage.getItem('lastName');
  const token = localStorage.getItem('token');

  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {

        let fileName = profilePic;

        if (Role === 'MENTOR' && !fileName) {
          const profileRes = await api.get(
            `user/fetch/mentor-id?mentorId=${UserId}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          fileName = profileRes.data.data.mentorDetail.profilePic;
        }

        if (fileName ) {
          const imageRes = await api.get(
            `user/fetch/${fileName}`,
            {
              responseType: 'blob',
            }
          );
          const imageBlobUrl = URL.createObjectURL(imageRes.data);
          setImageUrl(imageBlobUrl);
        }
      } catch (error) {
        console.error('Error fetching profile image', error);
      }
    };

    fetchImage();
  }, [Role, UserId, token, profilePic]);

  if ((Role === 'MENTOR' || Role === 'ADMIN') && imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={Role === 'MENTOR' ? 'Mentor' : 'Admin'}
        className="w-10 h-10 rounded-full object-cover"
      />
    );
  }

  const initials =
    Role === 'ADMIN'
      ? `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase()
      : `${FirstName?.charAt(0) || ''}${LastName?.charAt(0) || ''}`.toUpperCase();

  return (
    <div className="w-10 h-10 rounded-full bg-indigo-50 text-black flex items-center justify-center font-bold text-sm">
      {initials}
    </div>
  );
};

export default ProfileAvatar;
