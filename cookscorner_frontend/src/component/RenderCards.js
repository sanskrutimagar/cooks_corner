import React from 'react';
import { Link } from 'react-router-dom';

const RenderCards = ({ recipes }) => {
  // Check if recipes is an array
  if (!Array.isArray(recipes) || recipes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <p className="text-gray-500 text-lg font-medium">No recipes found</p>
      </div>
    );
  }

  // If recipes is an array, proceed with mapping
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {recipes.map((recipe) => (
        <Link 
          to={`/detailedRecipe/${recipe._id}`} 
          key={recipe._id}
          className="group transform transition-transform duration-300 hover:scale-[1.02]"
        >
          <div className="bg-gradient-to-br from-teal-50 to-emerald-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-emerald-200">
            <div className="relative pb-[65%] overflow-hidden">
              <img 
                className="absolute h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110" 
                src={recipe.recipeImage} 
                alt={recipe.recipeName} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold text-xl text-emerald-800 mb-2 line-clamp-1">
                {recipe.recipeName}
              </h3>
              
              <div className="flex items-center text-emerald-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  {recipe.preparationTime} mins
                </p>
              </div>

             
              
              {recipe.difficulty && (
                <div className="mt-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    recipe.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    recipe.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RenderCards;