import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useState } from 'react';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Dashboard from '../pages/Dashboard';
import Upload from '../pages/Upload';

const RouterConfig = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: 'login',
          element: <Login setIsAuthenticated={setIsAuthenticated} />,
        },
        {
          path: 'signup',
          element: <Signup setIsAuthenticated={setIsAuthenticated} />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'upload',
          element: <Upload />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export { RouterConfig }; 