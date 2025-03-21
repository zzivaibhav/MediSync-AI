import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Signup from './pages/signup';

// Create a browser router instead of using BrowserRouter component
const router = createBrowserRouter([
  {
    path: "/",
    element: <Signup />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
]);

function App() {
  return (
    <RouterProvider router={router} />
  );
}

export default App;
