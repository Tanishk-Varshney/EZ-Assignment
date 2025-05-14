import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import Dashboard from '../components/Dashboard';
import ForgotPassword from '../components/ForgotPassword';
import ResetPassword from '../components/ResetPassword';
import App from '../App';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'register',
          element: <Register />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'forgot-password',
          element: <ForgotPassword />,
        },
        {
          path: 'reset-password/:token',
          element: <ResetPassword />,
        },
        {
          path: '',
          element: <Login />,
        },
      ],
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

export function RouterConfig() {
  return <RouterProvider router={router} />;
} 