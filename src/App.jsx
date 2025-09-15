import './App.css'

import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CourseDetails from './pages/CourseDetails';
import Registration from './pages/Registration';
import Login from './pages/Login';
import MentorDashboard from './pages/MentorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import LearnerDashboard from './pages/LearnerDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import AddMentorDetails from './pages/AddMentorDetails';
import Payment from './pages/Payment';
import EmailVerification from './pages/EmailVerification';
import OtpVerification from './pages/OtpVerification';
import ChangePassword from './pages/ChangePassword';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Analytics } from "@vercel/analytics/react"
import ScrollToTop from './components/ScrollToTop';
import RedirectHandler from './pages/RedirectHandler';
import DeleteData from './pages/DeleteData';

const App = () => {

  return (
    <>
    <Router>
      <ScrollToTop />
      <Routes>

        <Route path='/delete-data' element={ <DeleteData />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path='/forgot-password' element={ <EmailVerification />  } />
        <Route path='/verify-otp' element={ <OtpVerification />  } />
        <Route path='/change-password' element={ <ChangePassword />  } />
        <Route path='/redirect' element={<RedirectHandler />} />


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
            <ProtectedRoute allowedRoles={["LEARNER","MENTOR"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
      </Routes>

    </Router>

        <Analytics />

    <ToastContainer/>
    </>
  );
};

export default App;
