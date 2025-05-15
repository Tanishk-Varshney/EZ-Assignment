import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUpload, FiShield, FiShare2, FiClock, FiUsers, FiLock } from 'react-icons/fi';
import GlassCard from '../components/GlassCard';

const Home = () => {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.animate-on-scroll');
      elements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible = elementTop < window.innerHeight && elementBottom > 0;
        if (isVisible) {
          element.classList.add('opacity-100', 'translate-y-0');
          element.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <FiUpload className="h-8 w-8" />,
      title: 'Easy Upload',
      description: 'Drag and drop your files or click to browse. Simple and intuitive interface.',
    },
    {
      icon: <FiShield className="h-8 w-8" />,
      title: 'Secure Storage',
      description: 'Your files are encrypted and stored securely with enterprise-grade protection.',
    },
    {
      icon: <FiShare2 className="h-8 w-8" />,
      title: 'Quick Sharing',
      description: 'Share files instantly with anyone using secure, time-limited access links.',
    },
    {
      icon: <FiClock className="h-8 w-8" />,
      title: '24/7 Access',
      description: 'Access your files anytime, anywhere. Your digital storage is always available.',
    },
    {
      icon: <FiUsers className="h-8 w-8" />,
      title: 'Collaboration',
      description: 'Work together seamlessly with real-time updates and shared access.',
    },
    {
      icon: <FiLock className="h-8 w-8" />,
      title: 'Privacy Control',
      description: 'Full control over who can access your files and for how long.',
    },
  ];

  const testimonials = [
    {
      quote: "FileShare has revolutionized how our team handles file sharing. It's fast, secure, and incredibly user-friendly.",
      author: "Sarah Johnson",
      role: "Project Manager",
    },
    {
      quote: "The security features give me peace of mind when sharing sensitive documents. Highly recommended!",
      author: "Michael Chen",
      role: "Security Analyst",
    },
    {
      quote: "Best file sharing solution I've used. The interface is clean and the features are exactly what we needed.",
      author: "Emily Rodriguez",
      role: "Creative Director",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Share Files Securely with{' '}
            <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              FileShare
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-8">
            The most secure and user-friendly way to share files with your team and clients.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
            >
              Get Started
            </Link>
            <Link
              to="/login"
              className="px-8 py-3 bg-white/10 text-white rounded-lg font-medium hover:bg-white/20 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Powerful Features</h2>
            <p className="text-xl text-white/60">
              Everything you need to share files securely and efficiently
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <GlassCard
                key={index}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-500"
              >
                <div className="text-blue-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What Our Users Say</h2>
            <p className="text-xl text-white/60">Trusted by professionals worldwide</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <GlassCard
                key={index}
                className="animate-on-scroll opacity-0 translate-y-8 transition-all duration-500"
              >
                <p className="text-white/80 mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-white">{testimonial.author}</p>
                  <p className="text-white/60">{testimonial.role}</p>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-black/50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">FileShare</h3>
              <p className="text-white/60">
                Secure file sharing made simple. Share your files with confidence.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/" className="text-white/60 hover:text-white transition-colors duration-200">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/#features" className="text-white/60 hover:text-white transition-colors duration-200">
                    Features
                  </Link>
                </li>
                <li>
                  <Link to="/#testimonials" className="text-white/60 hover:text-white transition-colors duration-200">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Account</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="text-white/60 hover:text-white transition-colors duration-200">
                    Login
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="text-white/60 hover:text-white transition-colors duration-200">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/privacy" className="text-white/60 hover:text-white transition-colors duration-200">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-white/60 hover:text-white transition-colors duration-200">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-white/10 text-center text-white/60">
            <p>&copy; {new Date().getFullYear()} FileShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 