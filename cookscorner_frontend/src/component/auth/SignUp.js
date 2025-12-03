import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import backendContext from '../../contex/backend/backendContext';

const SignUp = (props) => {
  // Accessing context to get the backend host
  const context = useContext(backendContext);
  const { host } = context;

  // State for storing user input (name, email, password, etc.)
  const [credentials, setCredentials] = useState({
    username: '',
    email: '',
    password: '',
    cpassword: '',
  });

  // State for managing alert messages
  const [alertMessage, setAlertMessage] = useState({ text: '', type: '' });

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Event handler for input changes
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  // Function to display an alert message and redirect after a delay
  const showAlert = (text, type) => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      if (type === 'success') {
        // Redirect to "/" after a successful sign-up
        navigate('/');
        setAlertMessage({ text: '', type: '' });
      } else {
        // Clear the alert without redirecting for other cases
        setAlertMessage({ text: '', type: '' });
      }
    }, 1500); // Message will disappear after 1.5 seconds
  };

  // Event handler for sign-up form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = credentials;

    try {
      // Make a POST request to the createuser endpoint
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password }),
      });

      // Parse the JSON response
      const json = await response.json();
      console.log(json);

      localStorage.setItem('culinashareToken', json);

      if (json) {
        // Show success message
        showAlert('Successfully signed in', 'success');
      } else {
        // Show error message
        showAlert('Incorrect credentials, try again later', 'danger');
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
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Create Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-green-600 hover:text-green-500">
              Log in here
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md -space-y-px">
            <div className="mb-4">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                minLength={2}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Enter username"
                value={credentials.username}
                onChange={onChange}
              />
            </div>
            
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
                placeholder="Enter email"
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
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={credentials.password}
                onChange={onChange}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="cpassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                autoComplete="new-password"
                required
                minLength={6}
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={credentials.cpassword}
                onChange={onChange}
              />
              {credentials.cpassword && credentials.password !== credentials.cpassword && (
                <small className="text-xs text-red-500">
                  Passwords do not match
                </small>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={credentials.cpassword !== credentials.password}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                credentials.cpassword !== credentials.password
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500'
              } transition-colors duration-200`}
            >
              Create Account
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;