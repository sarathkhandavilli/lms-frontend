import { useState, useEffect } from 'react'
import './App.css'

import React from 'react';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseDetails from './pages/CourseDetails';
import Registration from './pages/Registration';
import Login from './pages/Login';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LearnerDashboard from './pages/LearnerDashboard';
import CreateSection from './components/CreateSection';
import CreateTopic from './components/CreateTopic';
import ProtectedRoute from './components/ProtectedRoute';
import AddMentorDetails from './pages/AddMentorDetails';
import Payment from './pages/Payment';
import CreateCategory from './pages/CreateCategory';

const App = () => {


  return (
    <>
    <Router>
      <Routes>

        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/mentor"
          element={
            <ProtectedRoute allowedRoles={["MENTOR"]}>
              <MentorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/learner"
          element={
            <ProtectedRoute allowedRoles={["LEARNER"]}>
              <LearnerDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/mentor/detail"
          element={
            <ProtectedRoute allowedRoles={["MENTOR"]}>
              <AddMentorDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["LEARNER"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Routes>

    </Router>
    </>
  );
};

export default App;
