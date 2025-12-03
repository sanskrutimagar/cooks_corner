// src/components/Profile.jsx
import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import RenderCards from './RenderCards2'; // Use RenderCards2
import EditRecipeModal from './EditRecipeModal'; // Import the modal
import backendContext from '../contex/backend/backendContext';
import { Loader2, Info } from 'lucide-react'; // For loading/alerts

const Profile = () => {
  const { host } = useContext(backendContext);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Add error state
  const navigate = useNavigate();

  // --- Modal State ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [recipeToEdit, setRecipeToEdit] = useState(null);
  const [alertMessage, setAlertMessage] = useState({ text: '', type: '' }); // For profile-level alerts

  // --- Alert Function ---
   const showAlert = (text, type, duration = 4000) => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage({ text: '', type: '' });
    }, duration);
  };

  // --- Fetch User Recipes ---
  const getUserCreatedRecipes = async () => {
    setLoading(true);
    setError(null); // Reset error on new fetch
    try {
      const token = localStorage.getItem('culinashareToken');
      if (!token) {
          navigate('/login'); // Redirect if not logged in
          return;
      }
      const res = await fetch(`${host}/api/foodresp/user-created`, {
        headers: { 'auth-token': token }
      });
      if (!res.ok) {
          if (res.status === 401) { // Handle unauthorized
              localStorage.removeItem('culinashareToken');
              navigate('/login');
              throw new Error('Session expired. Please log in again.');
          }
          throw new Error(`Failed to fetch recipes (Status: ${res.status})`);
      }
      const data = await res.json();
      setRecipes(data);
    } catch (err) {
      console.error("Fetch recipes error:", err);
      setError(err.message || 'Failed to load your recipes.'); // Set error message
      showAlert(err.message || 'Failed to load your recipes.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserCreatedRecipes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Fetch on mount

  // --- Delete Handler ---
  const deleteRecipe = async (recipeId) => {
    if (!window.confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) return;
    try {
      const token = localStorage.getItem('culinashareToken');
      const res = await fetch(`${host}/api/foodresp/delete/${recipeId}`, {
        method: 'DELETE',
        headers: { 'auth-token': token }
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.msg || `Failed to delete (Status: ${res.status})`);
      }
      // remove from UI
      setRecipes(prevRecipes => prevRecipes.filter(r => r._id !== recipeId));
      showAlert('Recipe deleted successfully.', 'success');
    } catch (err) {
      console.error('Error deleting recipe:', err);
      showAlert(`Error deleting recipe: ${err.message}`, 'danger');
    }
  };

  // --- Edit Modal Handlers ---
  const handleEditClick = (recipe) => {
    setRecipeToEdit(recipe);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setRecipeToEdit(null); // Clear the recipe data
  };

  // --- Update Recipe Handler (called by Modal's onSave) ---
  const handleUpdateRecipe = async (recipeId, updatedData) => {
    // Note: Loading state is handled within the modal, but you could add one here too if needed.
    try {
      const token = localStorage.getItem('culinashareToken');
      const response = await fetch(`${host}/api/foodresp/update/${recipeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': token
        },
        body: JSON.stringify(updatedData),
      });

      const json = await response.json();

      if (!response.ok) {
         const errorMessage = json?.msg || json?.message || `Update failed (Status: ${response.status})`;
         throw new Error(errorMessage);
      }

      // Update the recipe list in the state
      setRecipes(prevRecipes =>
        prevRecipes.map(recipe =>
          recipe._id === recipeId ? { ...recipe, ...json } : recipe // Replace with updated data from backend
        )
      );
      showAlert('Recipe updated successfully!', 'success');
      handleCloseModal(); // Close modal on successful save

    } catch (error) {
      console.error("Update Error:", error);
      // Show error within the modal using its own alert system, or pass a function to show profile alert
      // For simplicity, let's rely on the modal's internal alert for update errors.
      // We could pass `showAlert` down to the modal if needed: `onSave={(id, data) => handleUpdateRecipe(id, data, showAlert)}`
       showAlert(`Error updating recipe: ${error.message}`, 'danger'); // Show error on profile page as well
       // Optionally keep modal open on error: // handleCloseModal();
    }
    // No need for setIsSubmitting(false) here, it's managed in the modal
  };

  // --- Log Out Handler ---
  const handleLogOut = () => {
    localStorage.removeItem('culinashareToken');
    navigate('/');
  };

  return (
    <div className="profile2 px-4 sm:px-6 py-6 sm:py-8 max-w-7xl mx-auto min-h-screen"> {/* Increased max-width */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left mb-4 sm:mb-6 text-gray-800">
        My Created Recipes
      </h1>

      {/* Profile Level Alert Message */}
        {alertMessage.text && (
            <div
              className={`p-3 mb-4 rounded-md shadow-sm text-sm ${
                alertMessage.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' :
                'bg-red-100 text-red-700 border border-red-200'
              }`}
              role="alert"
            >
              <div className="flex items-center">
                <Info className="w-4 h-4 mr-2 flex-shrink-0" />
                <p>{alertMessage.text}</p>
              </div>
            </div>
        )}


      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-8 w-8 text-emerald-600 animate-spin" /> {/* Use Loader2 */}
        </div>
      ) : error ? ( // Display error message if fetch failed
         <div className="text-center py-10 px-4 bg-red-50 rounded-lg shadow-sm border border-red-200">
          <p className="text-red-700 font-medium">Could not load recipes.</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
          <button
            onClick={getUserCreatedRecipes}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white py-1.5 px-4 rounded-md text-sm transition-colors"
          >
            Retry
          </button>
        </div>
      ) : recipes.length > 0 ? ( // Check if recipes exist *after* loading and no error
        <RenderCards
          recipes={recipes}
          onDelete={deleteRecipe}
          onEdit={handleEditClick} // Pass the edit handler
        />
      ) : ( // Condition for no recipes *after* loading and no error
        <div className="text-center py-10 px-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-600">You haven't created any recipes yet.</p>
          <button
            onClick={() => navigate('/addRecipe')}
            className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-5 rounded-md text-sm transition-colors shadow-sm"
          >
            Create Your First Recipe
          </button>
        </div>
      )}

      {/* Render the Modal */}
      <EditRecipeModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModal}
        recipeData={recipeToEdit}
        onSave={handleUpdateRecipe} // Pass the update handler
      />

      {/* Log Out Button */}
      <div className="mt-8 sm:mt-12 flex justify-center">
        <button
          onClick={handleLogOut}
          className="custom_btn bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md text-sm sm:text-base transition-colors shadow hover:shadow-md"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default Profile;