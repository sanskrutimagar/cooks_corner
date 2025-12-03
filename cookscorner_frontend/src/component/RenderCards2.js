// src/components/RenderCards2.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Edit3 } from 'lucide-react'; // Import Edit icon

const RenderCards = ({ recipes, onDelete, onEdit }) => { // Add onEdit prop
  if (!Array.isArray(recipes) || recipes.length === 0) {
    // ... (no change needed here)
     return (
      <div className="flex justify-center items-center min-h-[200px] w-full">
        <p className="text-gray-500 text-lg font-medium">No recipes found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {recipes.map(recipe => (
        <div key={recipe._id} className="relative group">

          {/* Action Buttons Container */}
          <div className="absolute top-2 right-2 z-10 flex space-x-1.5">
            {/* Edit Button */}
            {onEdit && (
              <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation if clicking button area
                    e.stopPropagation();
                    onEdit(recipe)
                }}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-md transition"
                title="Edit Recipe" // Add title for accessibility
              >
                <Edit3 className="h-4 w-4 text-blue-600" /> {/* Use Edit icon */}
              </button>
            )}

            {/* Delete Button */}
            {onDelete && (
              <button
                onClick={(e) => {
                    e.preventDefault(); // Prevent link navigation
                    e.stopPropagation();
                    onDelete(recipe._id)
                }}
                className="bg-white bg-opacity-80 hover:bg-opacity-100 p-1.5 rounded-full shadow-md transition"
                 title="Delete Recipe" // Add title
              >
                <Trash2 className="h-4 w-4 text-red-600" /> {/* Use Trash icon */}
              </button>
            )}
          </div>

          <Link
            to={`/detailedRecipe/${recipe._id}`}
            className="block transform transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="bg-gradient-to-br from-teal-50 to-emerald-100 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 h-full border border-emerald-200">
              <div className="relative pb-[65%] overflow-hidden">
                <img
                  className="absolute h-full w-full object-cover transform transition-transform duration-500 group-hover:scale-110"
                  src={recipe.recipeImage || '/placeholder-image.jpg'} // Add a placeholder
                  alt={recipe.recipeName}
                  onError={(e) => { e.target.onerror = null; e.target.src='/placeholder-image.jpg'; }} // Basic error handling
                />
                <div
                  className="absolute inset-0 bg-gradient-to-t from-emerald-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg xl:text-xl text-emerald-800 mb-1.5 line-clamp-1">
                  {recipe.recipeName}
                </h3>

                <div className="flex items-center text-emerald-700 text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg"
                       className="h-4 w-4 mr-1" /* Adjusted size */
                       fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p>{recipe.preparationTime} mins</p>
                </div>

                {recipe.difficulty && (
                  <div className="mt-2.5">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${ /* Adjusted padding */
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
        </div>
      ))}
    </div>
  );
};

export default RenderCards;