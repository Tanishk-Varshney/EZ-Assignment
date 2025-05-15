import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiUpload, FiLogOut, FiUser } from 'react-icons/fi';
import GlassCard from './GlassCard';

const Navbar = ({ isAuthenticated, setIsAuthenticated }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '/#features' },
    { name: 'Testimonials', path: '/#testimonials' },
  ];

  const authLinks = isAuthenticated
    ? [
        {
          name: 'Upload',
          path: '/upload',
          icon: <FiUpload className="h-5 w-5" />,
        },
        {
          name: 'Dashboard',
          path: '/dashboard',
          icon: <FiUser className="h-5 w-5" />,
        },
        {
          name: 'Logout',
          onClick: handleLogout,
          icon: <FiLogOut className="h-5 w-5" />,
        },
      ]
    : [
        {
          name: 'Login',
          path: '/login',
        },
        {
          name: 'Sign Up',
          path: '/signup',
        },
      ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/50 backdrop-blur-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FileShare
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-white/80 hover:text-white transition-colors duration-200 ${
                  location.pathname === link.path ? 'text-white' : ''
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="flex items-center space-x-4">
              {authLinks.map((link) =>
                link.onClick ? (
                  <button
                    key={link.name}
                    onClick={link.onClick}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </button>
                ) : (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors duration-200"
          >
            {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <GlassCard className="mx-4 mt-2 p-4">
            <div className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`text-white/80 hover:text-white transition-colors duration-200 ${
                    location.pathname === link.path ? 'text-white' : ''
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-4">
                {authLinks.map((link) =>
                  link.onClick ? (
                    <button
                      key={link.name}
                      onClick={() => {
                        link.onClick();
                        setIsOpen(false);
                      }}
                      className="flex items-center space-x-2 w-full text-white/80 hover:text-white transition-colors duration-200"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </button>
                  ) : (
                    <Link
                      key={link.name}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center space-x-2 w-full text-white/80 hover:text-white transition-colors duration-200"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                    </Link>
                  )
                )}
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 