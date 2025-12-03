import React, { useState, useEffect, useContext } from 'react';
import backendContext from '../contex/backend/backendContext';
import RenderCards from './RenderCards';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, BookOpen, AlertCircle } from 'lucide-react';

function FavoritesRecipes() {
  const navigate = useNavigate();
  const context = useContext(backendContext);
  const { host } = context;
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if(!localStorage.getItem('culinashareToken')){
      navigate('/login');
      return;
    }
    
    const fetchBookmarkedRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${host}/api/foodresp/user-bookmarks`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'auth-token': localStorage.getItem('culinashareToken')
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        
        const json = await response.json();
        setRecipes(json);
        setError(null);
      } catch (error) {
        console.error('Error fetching bookmarked recipes:', error);
        setError('Unable to load your favorite recipes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedRecipes();
  }, [host, navigate]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex items-center justify-center sm:justify-start mb-6">
        <Heart className="w-6 h-6 text-red-500 mr-2" />
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Favorite Recipes</h2>
      </div>
      
      {loading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 border-4 border-t-amber-500 border-gray-200 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <p className="text-red-700">{error}</p>
        </div>
      ) : recipes.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-4">You haven't saved any favorites yet.</p>
          <Link 
            to="/"
            className="inline-block px-5 py-3 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors"
          >
            Discover Recipes
          </Link>
        </div>
      ) : (
        <div className="w-full">
          <RenderCards recipes={recipes} />
        </div>
      )}
    </div>
  );
}

export default FavoritesRecipes;