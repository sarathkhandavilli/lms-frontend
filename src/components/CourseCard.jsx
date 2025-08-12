import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course, onEdit, onDelete, showActions }) => {
  const role = localStorage.getItem('role');
  const navigate = useNavigate();

  const goToCourse = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div className="bg-white border rounded-lg shadow-sm hover:shadow-lg transition duration-300 flex flex-col">
      <img
        src={`https://lms-backend-cr9o.onrender.com/courses/fetch/${course.thumbnailName}`}
        alt={course.name}
        className="w-full h-40 object-cover rounded-t-lg"
      />
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-md font-semibold text-black">{course.name}</h3>
          <div className="flex justify-between items-center mt-4 text-black">
            <span className="font-bold text-sm">
              
              ₹{ (course.price === 0 || course.discountInPercent === 100 )? 'Free' : course.price.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          { (role !== 'MENTOR' || !showActions ) && 
          <button
            onClick={goToCourse}
            className="w-full px-3 py-1 bg-black text-white rounded hover:bg-zinc-800"
          >
            View Course
          </button> }
          

          {role === 'MENTOR' && showActions && (
            <div className="flex justify-between gap-2">
              <button
                onClick={(e) => {
                  onEdit(course);
                }}
                className="flex-1 px-3 py-1 bg-black text-white rounded hover:bg-zinc-800"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(course.id);
                }}
                className="flex-1 px-3 py-1 bg-black text-white rounded hover:bg-zinc-800"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
