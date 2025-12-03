import React, { useState, useEffect, useContext } from 'react';
import backendContext from '../contex/backend/backendContext';
import RenderCards from './RenderCards';

const Random10 = () => {
  const context = useContext(backendContext);
  const { host } = context;
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${host}/api/foodresp/random-recipes`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch recipes');
        }
        
        const json = await response.json();
        setRecipes(json);
        setError(null);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setError('Unable to load recipes. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipes();
  }, [host]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-3xl font-bold text-center mb-8 text-emerald-700">Discover Delicious Recipes</h2>
      
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mb-4"></div>
          <p className="text-gray-600">Finding delicious recipes for you...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6">
          <p>{error}</p>
        </div>
      )}
      
      {!isLoading && !error && recipes.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No recipes found at the moment. Please check back later!</p>
        </div>
      )}
      
      {!isLoading && !error && recipes.length > 0 && (
        <div className="mt-4">
          <div className="mb-6">
            <p className="text-gray-600 text-center">We've selected these recipes just for you. Enjoy exploring new flavors!</p>
          </div>
          <RenderCards recipes={recipes} />
        </div>
      )}
    </div>
  );
};

export default Random10;