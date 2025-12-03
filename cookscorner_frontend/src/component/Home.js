import React from 'react';
import Random10 from './Random10';
import SearchRecipes from './SearchRecipes';
import Footer from './Footer';

function Home() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Delicious Recipes</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            Find the perfect meal for any occasion with our collection of hand-picked recipes
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4">
        {/* Search Section */}
        <div className="py-4">
          <SearchRecipes />
        </div>

        {/* Divider */}
        <div className="relative py-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="bg-gray-50 px-4 text-sm text-gray-500">OR</span>
          </div>
        </div>

        {/* Recommendations Section */}
        <div className="py-8">
          <div className="flex items-center justify-center mb-8">
            <div className="h-1 w-6 bg-emerald-500 rounded-full mr-2"></div>
            <h2 className="text-3xl font-bold text-gray-800 text-center">Today's Recommendations</h2>
            <div className="h-1 w-6 bg-emerald-500 rounded-full ml-2"></div>
          </div>
          <Random10 />
        </div>
      </div>

      {/* Footer section */}
      <div className="mt-12">
        <Footer />
      </div>
    </div>
  );
}

export default Home;