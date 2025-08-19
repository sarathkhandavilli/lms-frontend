import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import ProfileAvatar from './ProfileAvatar';
import 'react-toastify/dist/ReactToastify.css';


const Navbar = () => {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const [role, setRole] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mentorImage, setMentorImage] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role') || '';
    const fName = localStorage.getItem('firstName') || '';
    const lName = localStorage.getItem('lastName') || '';
    const profileImage = localStorage.getItem('profileImage') || '';

    setRole(storedRole);
    setFirstName(fName);
    setLastName(lName);
    setMentorImage(profileImage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      // Close dropdown only if click is outside dropdownRef
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      // Close mobile menu only if click is outside mobileMenuRef and hamburger button
      if (
        mobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target) &&
        !e.target.closest('#mobile-menu-button')
      ) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  const toggleDropdown = () => setDropdownOpen((v) => !v);
  const toggleMobileMenu = () => setMobileMenuOpen((v) => !v);

  const handleLogout = () => {
    localStorage.clear();
    setRole('');
    navigate('/', { replace: true });
    window.location.reload();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: logo + nav */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <img src={logo} alt="Logo" className="h-24 w-24 rounded-full" />
            </button>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
              >
                Courses
              </button>
              {role && (
                <button
                  onClick={() => {
                    if (role === 'ADMIN') navigate('/admin');
                    else if (role === 'MENTOR') navigate('/mentor');
                    else if (role === 'LEARNER') navigate('/learner');
                  }}
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Dashboard
                </button>
              )}
            </nav>
          </div>

          {/* Right: Auth / profile */}
          <div className="flex items-center space-x-4" ref={dropdownRef}>
            {/* Mobile menu button */}
            <button
              id="mobile-menu-button"
              onClick={toggleMobileMenu}
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-900"
              aria-label="Toggle menu"
            >
              {/* Hamburger icon */}
              <svg
                className="h-6 w-6 text-gray-900"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {mobileMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>

            {role ? (
              <div className="relative">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <ProfileAvatar
                    firstName={firstName}
                    lastName={lastName}
                    profilePic={mentorImage}
                  />
                 <div className="hidden md:block text-left">
                    {firstName === '' && lastName === '' ? (
                      <p className="text-sm font-medium">Admin</p>
                    ) : (
                      <p className="text-sm font-medium">{`${firstName} ${lastName}`}</p>
                    )}
                    <p className="text-xs text-gray-500 capitalize">{role}</p>
                  </div>
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-50">
                    {role === 'MENTOR' && (
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate('/mentor/detail');
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Mentor Details
                      </button>
                    )}

                    {role === 'ADMIN' && (
                      <button
                        onClick={() => {
                          setMobileMenuOpen(false);
                          navigate('/register');
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                      >
                        Register Admin
                      </button>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => navigate('/register')}
                  className="hidden md:inline-block px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 transition"
                >
                  Register
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="hidden md:inline-block px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      {mobileMenuOpen && (
        <nav
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-gray-200 shadow-md"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigate('/');
              }}
              className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              Courses
            </button>

            {role && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (role === 'ADMIN') navigate('/admin');
                  else if (role === 'MENTOR') navigate('/mentor');
                  else if (role === 'LEARNER') navigate('/learner');
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
              >
                Dashboard
              </button>
            )}

            {role ? (
              <>
                {role === 'MENTOR' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/mentor/detail');
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Mentor Details
                  </button>
                )}

                {role === 'ADMIN' && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/register');
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                  >
                    Register Admin
                  </button>
                )}
                
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/register');
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Register
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    navigate('/login');
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
