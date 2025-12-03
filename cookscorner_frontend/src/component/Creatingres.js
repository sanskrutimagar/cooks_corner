import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ChefHat, Clock, PlusCircle, MinusCircle, Image, FileText, Tag, Info, ArrowLeft, UploadCloud, X, Loader2 } from 'lucide-react'; // Removed Youtube icon
import backendContext from '../contex/backend/backendContext';

// --- Cloudinary Configuration ---
const CLOUDINARY_CLOUD_NAME = "db2jsjrrn";
const CLOUDINARY_UPLOAD_PRESET = "culinashare_unsigned";
const CLOUDINARY_UPLOAD_URL=`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// --- End Cloudinary Configuration ---


const Creatingres = () => {
  const context = useContext(backendContext);
  const { host } = context;
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({
    recipeName: '',
    preparationTime: '',
    ingredients: [{ name: '', quantity: '' }],
    recipeImage: '',
    // youtubeLink: '', // Removed youtubeLink
    details: '',
    options: []
  });

  const [alertMessage, setAlertMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- State for Image Upload ---
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null);
  // --- End State for Image Upload ---

  useEffect(() => {
    if (!localStorage.getItem('culinashareToken')) {
      navigate('/login');
    }
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [navigate, imagePreview]);

  const onChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'options') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setCredentials(prev => ({ ...prev, options: selectedOptions }));
    } else if (name === 'ingredients') {
      const newIngredients = [...credentials.ingredients];
      if (e.target.classList.contains('name')) {
        newIngredients[index].name = value;
      } else if (e.target.classList.contains('quantity')) {
        newIngredients[index].quantity = value;
      }
      setCredentials(prev => ({ ...prev, ingredients: newIngredients }));
    } else {
      setCredentials(prev => ({ ...prev, [name]: value }));
    }
  };

  const addIngredientField = () => {
    setCredentials(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '' }]
    }));
  };

  const removeIngredientField = (index) => {
    const newIngredients = [...credentials.ingredients];
    newIngredients.splice(index, 1);
    setCredentials(prev => ({ ...prev, ingredients: newIngredients }));
  };

  const showAlert = (text, type) => {
    setAlertMessage({ text, type });
    const timeoutDuration = type === 'success' ? 2000 : 3500; // Adjusted timings
    setTimeout(() => {
      if (type === 'success' && !isSubmitting) { // Prevent navigation if still submitting (e.g., image upload success but main form fail)
         navigate('/'); // Only navigate on final success
         // Clear form maybe?
      }
      setAlertMessage({ text: '', type: '' }); // Clear message regardless
    }, timeoutDuration);
  };


  // --- Image Handling Functions (Unchanged) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setCredentials(prev => ({ ...prev, recipeImage: '' }));
      setUploadProgress(0);
    } else {
      setImageFile(null);
      setImagePreview(null);
      setCredentials(prev => ({ ...prev, recipeImage: '' }));
      if (file) showAlert('Please select a valid image file.', 'danger');
    }
  };

  const uploadImage = async (fileToUpload) => {
    if (!fileToUpload) {
        showAlert('No image selected for upload.', 'danger');
        return null;
    }
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        console.error("Cloudinary config missing.");
        showAlert('Image upload configuration error.', 'danger');
        return null;
    }
    setIsUploading(true);
    setUploadProgress(0);
    const formData = new FormData();
    formData.append('file', fileToUpload);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });
      setIsUploading(false);
      if (response.data && response.data.secure_url) {
        // Don't show alert here, wait for main form submission alert
        // showAlert('Image uploaded successfully!', 'success');
        setCredentials(prev => ({ ...prev, recipeImage: response.data.secure_url })); // Set the URL in state
        return response.data.secure_url;
      } else {
          throw new Error("Cloudinary response missing secure_url");
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error.response ? error.response.data : error);
      setIsUploading(false);
      setUploadProgress(0);
      showAlert(`Image upload failed: ${error.response?.data?.error?.message || error.message || 'Server error'}.`, 'danger');
      return null;
    }
  };

  const clearImageSelection = () => {
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      setCredentials(prev => ({ ...prev, recipeImage: '' }));
      setUploadProgress(0);
      setIsUploading(false);
      const fileInput = document.getElementById('recipeImageFile');
      if (fileInput) fileInput.value = '';
  }
  // --- End Image Handling Functions ---


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      showAlert('Please wait for the image to finish uploading.', 'warning');
      return;
    }

    setIsSubmitting(true);
    let finalImageUrl = credentials.recipeImage;

    // Upload image if a new file selected but not uploaded yet
    if (imageFile && !finalImageUrl) {
      showAlert('Uploading image...', 'info'); // Inform user
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) {
        // Error handled in uploadImage, just stop submission
        setIsSubmitting(false);
        return;
      }
      finalImageUrl = uploadedUrl;
    }

    // Destructure credentials *after* image handling
    const {
      recipeName,
      preparationTime,
      ingredients,
      details,
      options
    } = credentials;

    // Validation
    if (!recipeName || !preparationTime || ingredients.length === 0 || ingredients.some(ing => !ing.name || !ing.quantity) || !details ) {
        showAlert('Please fill Recipe Name, Prep Time, Ingredients, and Instructions.', 'danger');
        setIsSubmitting(false);
        return;
    }
     if (!finalImageUrl) { // Check final URL after potential upload
         showAlert('Please select and upload a recipe image.', 'danger');
         setIsSubmitting(false);
         return;
     }

    try {
      const response = await fetch(`${host}/api/foodresp/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('culinashareToken')
        },
        body: JSON.stringify({
          recipeName,
          preparationTime,
          ingredients,
          recipeImage: finalImageUrl,
          youtubeLink: '', // Send empty string or omit if backend handles missing field
          details,
          options
        }),
      });

      const json = await response.json();
      if (response.ok) {
        showAlert('Recipe saved successfully!', 'success');
        // Consider resetting form here
        // setCredentials({ ...initial state ... });
        // clearImageSelection();
      } else {
         const errorMessage = json?.error || json?.message || 'Error saving recipe.';
        showAlert(errorMessage, 'danger');
      }
    } catch (error) {
      console.error("Submit Error:", error);
      showAlert('Network or server error. Please try again.', 'danger');
    } finally {
      // Keep submitting false until navigation happens or error alert timeout completes
      // setIsSubmitting(false); // Moved this to be handled by showAlert logic implicitly
    }
  };

  // Category options (Unchanged)
  const categoryOptions = [
    { value: 'starter', label: 'Starter' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'non vegetarian', label: 'Non Vegetarian' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'quick recipes', label: 'Quick Recipes' },

  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-8">
      <div className="w-full px-2 sm:px-4 my-5 max-w-4xl mx-auto"> {/* Adjusted max-width */}
        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to recipes
        </button>

        {/* Alert Message Area */}
        {alertMessage.text && (
          <div
            className={`p-4 mb-6 rounded-lg shadow-md animate-fade-in border-l-4 ${
              alertMessage.type === 'success' ? 'bg-green-50 text-green-800 border-green-500' :
              alertMessage.type === 'warning' ? 'bg-yellow-50 text-yellow-800 border-yellow-500' :
              alertMessage.type === 'info'    ? 'bg-blue-50 text-blue-800 border-blue-500' :
              'bg-red-50 text-red-800 border-red-500' // danger
            }`}
            role="alert"
          >
            <div className="flex items-center">
              <Info className="w-5 h-5 mr-2 flex-shrink-0" />
              <p className="font-medium">{alertMessage.text}</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="text-center mb-8">
           <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-4 shadow-sm">
            <ChefHat className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">Create Your Recipe</h1>
          <p className="text-gray-600 max-w-lg mx-auto">Share your culinary creativity with the world.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl border border-amber-100/50">
          {/* Recipe Name */}
          <div className="mb-6">
            <label htmlFor="recipeName" className="block text-sm font-semibold text-gray-700 mb-2">Recipe Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              id="recipeName" name="recipeName"
              value={credentials.recipeName}
              required minLength={2} onChange={onChange}
              placeholder="e.g., Grandma's Apple Pie"
            />
          </div>

          {/* Preparation Time */}
          <div className="mb-6">
            <label htmlFor="preparationTime" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-amber-500" /> Preparation Time
            </label>
            <div className="relative">
              <input
                type="number"
                className="w-full pl-4 pr-16 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
                id="preparationTime" name="preparationTime"
                value={credentials.preparationTime}
                required min="1" onChange={onChange}
                placeholder="e.g., 30"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-sm text-gray-500">minutes</div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ingredients</label>
            <div className="bg-amber-50/60 p-4 rounded-xl mb-3 space-y-3"> {/* Added space-y */}
              {credentials.ingredients.map((ingredient, index) => (
                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center"> {/* Increased gap */}
                  {/* Ingredient Name Input */}
                  <div className="flex-1 w-full sm:w-auto">
                    <input
                      type="text"
                      className="name w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition" // Adjusted style
                      name="ingredients"
                      placeholder="Ingredient name (e.g., Flour)"
                      value={ingredient.name} required
                      onChange={(e) => onChange(e, index)}
                    />
                  </div>
                  {/* Quantity Input & Action Buttons */}
                  <div className="flex gap-2 w-full sm:w-auto items-center"> {/* Use flex-row */}
                    <input
                      type="text"
                      className="quantity flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition" // Adjusted style
                      name="ingredients"
                      placeholder="Quantity (e.g., 2 cups)"
                      value={ingredient.quantity} required
                      onChange={(e) => onChange(e, index)}
                    />
                     {/* Show Remove button only if more than one ingredient */}
                     {credentials.ingredients.length > 1 && (
                       <button
                         type="button"
                         className="flex-shrink-0 p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 hover:text-red-700 transition"
                         onClick={() => removeIngredientField(index)}
                         title="Remove Ingredient"
                       >
                         <MinusCircle className="w-5 h-5" />
                       </button>
                     )}
                  </div>
                </div>
              ))}
            </div>
             {/* Add Ingredient Button - always visible if needed */}
             <button
                type="button"
                className="w-full py-2.5 border-2 border-dashed border-amber-300 rounded-xl text-amber-600 font-medium hover:bg-amber-50/80 transition-colors flex items-center justify-center text-sm"
                onClick={addIngredientField}
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Another Ingredient
              </button>
          </div>

          {/* --- Recipe Image Upload Section --- */}
           <div className="mb-6">
                <label htmlFor="recipeImageFile" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <Image className="w-5 h-5 mr-2 text-amber-500" />
                    Recipe Image*
                </label>
                <div className="mt-1 p-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-amber-400 transition-colors duration-200 bg-white">
                    {imagePreview ? (
                        // Display Preview and Actions
                        <div className="text-center">
                            <div className="relative inline-block group mb-4">
                                <img src={imagePreview} alt="Recipe preview" className="max-h-60 w-auto object-contain rounded-lg shadow-md mx-auto"/>
                                <button
                                    type="button"
                                    onClick={clearImageSelection}
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 leading-none shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-600"
                                    title="Remove image"
                                    disabled={isUploading}
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                            {/* Show upload button only if file selected, not uploading, and no URL yet */}
                            {imageFile && !isUploading && !credentials.recipeImage && (
                                <button
                                    type="button"
                                    onClick={() => uploadImage(imageFile)}
                                    className="mt-2 w-full max-w-xs mx-auto flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                                >
                                    <UploadCloud className="w-5 h-5 mr-2" /> Upload Now
                                </button>
                            )}
                        </div>
                    ) : (
                        // Display Upload Placeholder
                        <div className="text-center py-6">
                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <label
                                htmlFor="recipeImageFile"
                                className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-700 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500 transition"
                            >
                                <span>Upload an image</span>
                                <input id="recipeImageFile" name="recipeImageFile" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" disabled={isUploading}/>
                            </label>
                            <p className="text-sm text-gray-500 mt-1">or drag and drop</p>
                            <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    )}

                    {/* Upload Progress Indicator */}
                    {isUploading && (
                        <div className="w-full mt-4 text-center">
                            <Loader2 className="w-6 h-6 text-amber-500 animate-spin inline-block mr-2" />
                            <p className="text-sm font-medium text-gray-700 inline-block align-middle">Uploading... {uploadProgress}%</p>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 overflow-hidden">
                                <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        </div>
                    )}
                    {/* Display URL after successful upload (via credentials state) */}
                    {credentials.recipeImage && !isUploading && (
                        <p className="mt-3 text-center text-xs text-green-600">
                            Image Uploaded! ✅
                        </p>
                    )}
                </div>
                {!imagePreview && !isUploading && <p className="text-xs text-gray-500 mt-1">* Image is required</p>}
            </div>
            {/* --- End Recipe Image Upload --- */}

          {/* Removed YouTube Link Section */}

          {/* Details */}
          <div className="mb-6">
            <label htmlFor="details" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <FileText className="w-5 h-5 mr-2 text-amber-500" /> Recipe Instructions*
            </label>
            <textarea
              className="w-full px-4 py-3 h-48 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all"
              id="details" name="details"
              value={credentials.details} required
              onChange={onChange}
              placeholder="1. Preheat oven...\n2. Mix ingredients...\n3. Bake for..."
            />
             <p className="text-xs text-gray-500 mt-1">* Instructions are required</p>
          </div>

          {/* Options */}
          <div className="mb-8">
            <label htmlFor="options" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <Tag className="w-5 h-5 mr-2 text-amber-500" /> Categories (Optional)
            </label>
            <p className="text-xs text-gray-500 mb-2">Select one or more categories that fit your recipe (Hold Ctrl/Cmd to select multiple).</p>
            <select
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all duration-200 bg-white"
              id="options" name="options"
              multiple size={categoryOptions.length} // Show all options
              value={credentials.options}
              onChange={onChange}
            >
              {categoryOptions.map(option => (
                <option key={option.value} value={option.value} className="py-1.5 px-2 hover:bg-amber-50 transition-colors">
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className={`w-full sm:w-auto px-10 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 flex items-center justify-center ${ (isSubmitting || isUploading) ? 'opacity-60 cursor-not-allowed' : 'hover:from-amber-600 hover:to-orange-600'}`}
            >
              {isSubmitting ? (
                  <> <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Saving Recipe... </>
              ) : isUploading ? (
                  <> <Loader2 className="w-6 h-6 mr-2 animate-spin" /> Uploading Image... </>
              ) : (
                'Save Recipe'
              )}
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Your recipe will be shared with the Cook's Corner community upon submission.
          </p>
        </form>
      </div>
    </div>
  );
};

export default Creatingres;