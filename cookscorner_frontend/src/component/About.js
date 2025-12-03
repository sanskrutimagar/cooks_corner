import React from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate

const About = () => {
  const navigate = useNavigate(); // 2. Get the navigate function using the hook

  const features = [
    {
      title: "Create an Account",
      description: "Sign up for free and join our vibrant community of food lovers from around the world.",
      icon: "👤",
      color: "bg-emerald-100"
    },
    {
      title: "Share Recipes",
      description: "Showcase your culinary creations and inspire others with your favorite dishes and cooking techniques.",
      icon: "📝",
      color: "bg-teal-100"
    },
    {
      title: "Discover & Learn",
      description: "Explore thousands of recipes from different cuisines and skill levels to expand your cooking repertoire.",
      icon: "🔍",
      color: "bg-cyan-100"
    },
    {
      title: "Bookmark Favorites",
      description: "Save recipes you love for quick and easy access whenever inspiration strikes in the kitchen.",
      icon: "🔖",
      color: "bg-blue-100"
    },
    {
      title: "Connect & Communicate",
      description: "Exchange cooking tips, share food stories, and build connections with fellow food enthusiasts.",
      icon: "💬",
      color: "bg-indigo-100"
    },
    {
      title: "Personalize Experience",
      description: "Get tailored recipe recommendations based on your preferences, dietary restrictions, and cooking history.",
      icon: "✨",
      color: "bg-purple-100"
    }
  ];

  // 3. Update handleClick to use the navigate function
  function handleClick() {
    // Check if user is logged in (optional but good practice)
    const token = localStorage.getItem('culinashareToken');
    if (token) {
      navigate('/addRecipe'); // Navigate to add recipe page if logged in
    } else {
      navigate('/login'); // Or redirect to login page if not logged in
    }
    // If the button *always* goes to addRecipe regardless of login status:
    // navigate('/addRecipe');
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-emerald-700 mb-6">About Cook's Corner</h1>
        <div className="w-24 h-1 bg-emerald-500 mx-auto mb-8 rounded-full"></div>
        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          Your go-to platform for sharing and discovering delicious recipes from a community of passionate food lovers around the world.
        </p>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg p-8 mb-16 text-white">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
            <div className="text-6xl md:text-8xl flex space-x-4">
              <span role="img" aria-label="Chef">👩‍🍳</span>
              <span role="img" aria-label="Food" className="hidden md:inline">🥘</span>
            </div>
          </div>
          <div className="md:w-2/3 md:pl-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-white text-opacity-90 leading-relaxed">
              At Cook's Corner, we believe that food has the power to bring people together across cultures and distances. Our mission is to create a vibrant community where cooking enthusiasts can share their passion, discover new recipes, and inspire each other's culinary journeys.
            </p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className={`rounded-lg p-6 shadow-md transition duration-300 hover:shadow-lg ${feature.color}`}>
              <div className="flex items-start">
                <span className="text-4xl mr-4" role="img" aria-label={feature.title}>
                  {feature.icon}
                </span>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Community Section */}
      <div className="bg-gray-50 rounded-lg p-8 border border-gray-200">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800">Join Our Cook's Corner Community</h2>
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <div className="text-5xl">
            <span role="img" aria-label="Chef">👩‍🍳</span>
          </div>
          <div className="text-5xl">
            <span role="img" aria-label="Food">🥘</span>
          </div>
          <div className="text-5xl">
            <span role="img" aria-label="Heart">❤️</span>
          </div>
          <div className="text-5xl">
            <span role="img" aria-label="Community">👥</span>
          </div>
        </div>
        <p className="text-center text-lg text-gray-700 max-w-2xl mx-auto">
          Whether you're a professional chef, a home cook, or someone just starting their culinary adventure,
          there's a place for you at Cook's Corner. Start sharing your recipes and join thousands of
          food enthusiasts in celebrating the universal joy of cooking!
        </p>
        <div className="flex justify-center mt-8">
          <button onClick={handleClick} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg shadow transition duration-300 transform hover:scale-105">
            Join Cook's Corner Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;