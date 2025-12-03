import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backendContext from '../../contex/backend/backendContext';

const Login = (props) => {
  // Accessing context to get the backend host
  const context = useContext(backendContext);
  const { host } = context;

  // State for storing user input (email and password)
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  // State for managing alert messages
  const [alertMessage, setAlertMessage] = useState({ text: "", type: "" });

  // Hook for programmatic navigation
  let navigate = useNavigate();

  // Event handler for input changes
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Function to display an alert message and redirect after a delay
  const showAlert = (text, type) => {
    setAlertMessage({ text, type });

    // Set timeout to clear the alert and redirect after 3 seconds
    setTimeout(() => {
      if(type === 'success'){
        navigate("/");
        setAlertMessage({ text: "", type: "" });
      } else {
        setAlertMessage({ text: "", type: "" });
      }
    }, 1000);
  };

  // Event handler for login form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Make a POST request to the login endpoint
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: credentials.email, password: credentials.password }),
      });

      // Parse the JSON response
      const json = await response.json();

      // Check if the login was successful
      if (json.success) {
        // Save authentication token and user role to local storage
        localStorage.setItem("culinashareToken", json.authtoken);

        // Clear input fields
        setCredentials({ email: "", password: "" });

        // Show success message
        showAlert('Successfully logged in', 'success');
      } else {
        // Show error message
        showAlert("Incorrect credentials, try again later", "danger");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-white p-10 rounded-xl shadow-lg">
        {alertMessage.text && (
          <div 
            className={`p-4 mb-4 text-sm rounded-lg ${
              alertMessage.type === 'success' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`} 
            role="alert"
          >
            {alertMessage.text}
          </div>
        )}
        
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-green-600 hover:text-green-500">
              Join here
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={credentials.email}
                onChange={onChange}
              />
              <small id="emailHelp" className="text-xs text-gray-500">
                We'll never share your email with anyone else.
              </small>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={onChange}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-green-600 hover:text-green-500">
                Forgot your password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;