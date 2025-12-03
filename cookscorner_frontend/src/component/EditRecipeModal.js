// src/components/EditRecipeModal.jsx
import React, { useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios'; // Using axios for upload progress
import { ChefHat, Clock, PlusCircle, MinusCircle, Image, Youtube, FileText, Tag, Info, UploadCloud, X, Loader2, Save } from 'lucide-react';
import backendContext from '../contex/backend/backendContext';

// --- Cloudinary Configuration (Same as Creatingres) ---
const CLOUDINARY_CLOUD_NAME = "db2jsjrrn";
const CLOUDINARY_UPLOAD_PRESET = "culinashare_unsigned";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
// --- End Cloudinary Configuration ---

const EditRecipeModal = ({ isOpen, onClose, recipeData, onSave }) => {
  const { host } = useContext(backendContext);

  // --- State Initialization ---
  // Initialize with default empty structure or recipeData if available
  const getInitialState = useCallback(() => ({
    recipeName: recipeData?.recipeName || '',
    preparationTime: recipeData?.preparationTime || '',
    ingredients: recipeData?.ingredients?.map(ing => ({ ...ing })) || [{ name: '', quantity: '' }], // Deep copy ingredients
    recipeImage: recipeData?.recipeImage || '', // Existing image URL
    youtubeLink: recipeData?.youtubeLink || '',
    details: recipeData?.details || '',
    options: recipeData?.options || []
  }), [recipeData]);

  const [credentials, setCredentials] = useState(getInitialState());
  const [alertMessage, setAlertMessage] = useState({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Image Upload State ---
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState(null); // For new image preview

  // --- Effect to update form when recipeData changes ---
  useEffect(() => {
    if (recipeData) {
      setCredentials(getInitialState());
      // Set preview to existing image if available, clear new file selection
      setImagePreview(null); // Reset new image preview
      setImageFile(null);
      setIsUploading(false);
      setUploadProgress(0);
      // Clean up previous object URL if any
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recipeData, getInitialState]); // Depend on recipeData and the memoized initializer

  // --- Cleanup image preview URL on unmount or preview change ---
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // --- Form Input Handlers (Same as Creatingres) ---
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

  // --- Alert Handler ---
  const showAlert = (text, type, duration = 3000) => {
    setAlertMessage({ text, type });
    setTimeout(() => {
      setAlertMessage({ text: '', type: '' });
    }, duration);
  };

  // --- Image Handling Functions (Adapted for Edit) ---
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      // Create & set *new* preview URL
      if (imagePreview) URL.revokeObjectURL(imagePreview); // Clean up previous *new* preview
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      // Clear the *persisted* recipeImage URL until upload is successful
      // We keep the original in `recipeData.recipeImage` if needed
      setCredentials(prev => ({ ...prev, recipeImage: '' })); // Signal that a new image is staged
      setUploadProgress(0);
    } else {
      // Invalid file type or no file selected
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      // Restore original image if user cancels selection
      setCredentials(prev => ({ ...prev, recipeImage: recipeData?.recipeImage || '' }));
      if (file) showAlert('Please select a valid image file.', 'danger');
    }
  };

  const uploadImage = async (fileToUpload) => {
    // (Identical Cloudinary upload logic as in Creatingres)
    if (!fileToUpload) {
        showAlert('No image selected for upload.', 'danger');
        return null;
    }
     if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        console.error("Cloudinary cloud name or upload preset is not configured.");
        showAlert('Image upload configuration error. Please contact support.', 'danger');
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
        showAlert('Image uploaded successfully!', 'success', 1500);
        return response.data.secure_url; // Return the URL
      } else {
         throw new Error("Cloudinary response missing secure_url");
      }
    } catch (error) {
      console.error('Cloudinary Upload Error:', error.response ? error.response.data : error);
      setIsUploading(false);
      setUploadProgress(0);
      showAlert(`Image upload failed: ${error.response?.data?.error?.message || error.message || 'Server error'}. Please try again.`, 'danger');
      return null;
    }
  };

  // Clear *new* image selection, revert to original image
  const clearImageSelection = () => {
      setImageFile(null);
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
      // Revert to the original image URL from recipeData
      setCredentials(prev => ({ ...prev, recipeImage: recipeData?.recipeImage || '' }));
      setUploadProgress(0);
      setIsUploading(false);
      const fileInput = document.getElementById(`recipeImageFile-${recipeData?._id}`); // Unique ID
      if (fileInput) fileInput.value = '';
  }
  // --- End Image Handling ---

  // --- Form Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isUploading) {
      showAlert('Please wait for the image to finish uploading.', 'warning');
      return;
    }
    if (!recipeData?._id) {
        showAlert('Error: Recipe ID is missing.', 'danger');
        return;
    }

    setIsSubmitting(true);
    let finalImageUrl = credentials.recipeImage; // Start with current state URL

    // If a new image file exists and no URL is set in credentials (meaning new image is staged but not uploaded)
    if (imageFile && !finalImageUrl) {
      const uploadedUrl = await uploadImage(imageFile);
      if (!uploadedUrl) {
        showAlert('Image upload failed. Cannot save recipe.', 'danger');
        setIsSubmitting(false);
        return;
      }
      finalImageUrl = uploadedUrl; // Use the newly uploaded URL
    } else if (!imageFile && !finalImageUrl && recipeData?.recipeImage) {
       // If no new file and no URL in state, revert to original (shouldn't happen often with current logic, but safe)
       finalImageUrl = recipeData.recipeImage;
    } else if (!imageFile && finalImageUrl === '') {
        // User explicitly cleared the image and didn't select a new one
        // Depending on requirements, you might disallow this or allow saving without an image.
        // For now, let's assume an image is required or keep the original one.
        // Reverting to original:
        // finalImageUrl = recipeData?.recipeImage || '';
        // If you want to enforce having an image:
        showAlert('Please select or upload a recipe image.', 'danger');
        setIsSubmitting(false);
        return;
    }


    // Prepare data to send (exclude internal state like imageFile)
    const updateData = {
      recipeName: credentials.recipeName,
      preparationTime: credentials.preparationTime,
      ingredients: credentials.ingredients,
      recipeImage: finalImageUrl, // Send the determined final URL
      youtubeLink: credentials.youtubeLink,
      details: credentials.details,
      options: credentials.options
    };

    // Basic validation
    if (!updateData.recipeName || !updateData.preparationTime || updateData.ingredients.length === 0 || updateData.ingredients.some(ing => !ing.name || !ing.quantity) || !updateData.details || !updateData.recipeImage ) {
        showAlert('Please fill in all required fields (Recipe Name, Prep Time, Ingredients, Instructions, Image).', 'danger');
        setIsSubmitting(false);
        return;
    }

    // Call the onSave prop passed from Profile component
    await onSave(recipeData._id, updateData); // Pass ID and updated data

    setIsSubmitting(false);
    // Note: Closing the modal is handled by the Profile component via the onSave callback success
  };

  // --- Modal Visibility ---
  if (!isOpen || !recipeData) return null; // Don't render if not open or no data

  // --- Category Options (Same as Creatingres) ---
  const categoryOptions = [
    { value: 'starter', label: 'Starter' },
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'non vegetarian', label: 'Non Vegetarian' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'quick recipes', label: 'Quick Recipes' }
  ];
   const uniqueFileInputId = `recipeImageFile-${recipeData._id}`; // Create unique ID

  return (
    // Modal Container with Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
      {/* Modal Content Box */}
      <div className="bg-gradient-to-b from-amber-50 to-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative border border-amber-200">
        {/* Close Button */}
        <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 bg-white/70 hover:bg-white rounded-full p-1 transition-colors z-10"
            aria-label="Close modal"
            disabled={isSubmitting || isUploading}
        >
            <X className="w-6 h-6" />
        </button>

        {/* Form Padding & Content */}
        <div className="p-6 sm:p-8">
          {/* Alert Message Area */}
          {alertMessage.text && (
            <div
              className={`p-4 mb-5 rounded-lg shadow-sm ${
                alertMessage.type === 'success' ? 'bg-green-100 text-green-800 border-l-4 border-green-500' :
                alertMessage.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500' :
                'bg-red-100 text-red-800 border-l-4 border-red-500'
              }`}
              role="alert"
            >
              <div className="flex items-center">
                <Info className="w-5 h-5 mr-2 flex-shrink-0" />
                <p className="font-medium">{alertMessage.text}</p>
              </div>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center p-3 bg-amber-100 rounded-full mb-3">
                <ChefHat className="w-8 h-8 text-amber-500" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Edit Recipe</h2>
            <p className="text-gray-600 text-sm mt-1">Update the details for "{recipeData.recipeName}"</p>
          </div>

          {/* --- Form structure identical to Creatingres --- */}
          <form onSubmit={handleSubmit}>
            {/* Recipe Name */}
            <div className="mb-5">
              <label htmlFor={`recipeName-${recipeData._id}`} className="block text-sm font-semibold text-gray-700 mb-1.5">Recipe Name</label>
              <input
                type="text"
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                id={`recipeName-${recipeData._id}`} // Unique ID
                name="recipeName"
                value={credentials.recipeName}
                required minLength={2} onChange={onChange}
                placeholder="Recipe name"
              />
            </div>

            {/* Preparation Time */}
            <div className="mb-5">
                <label htmlFor={`preparationTime-${recipeData._id}`} className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Clock className="w-4 h-4 mr-1.5 text-amber-500" />Preparation Time</label>
                <div className="relative">
                <input
                    type="number"
                    className="w-full pl-4 pr-16 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    id={`preparationTime-${recipeData._id}`} // Unique ID
                    name="preparationTime"
                    value={credentials.preparationTime}
                    required min="1" onChange={onChange}
                    placeholder="Time"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-gray-500 text-sm">minutes</div>
                </div>
            </div>

            {/* Ingredients */}
            <div className="mb-5">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Ingredients</label>
                <div className="bg-amber-50/70 p-3 rounded-lg mb-2 space-y-2">
                    {credentials.ingredients.map((ingredient, index) => (
                        <div key={index} className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                            <div className="flex-1 w-full sm:w-auto">
                                <input
                                    type="text"
                                    className="name w-full px-3 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                                    name="ingredients" placeholder="Ingredient name"
                                    value={ingredient.name} required
                                    onChange={(e) => onChange(e, index)}
                                />
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <input
                                    type="text"
                                    className="quantity flex-1 px-3 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-amber-500 focus:border-transparent"
                                    name="ingredients" placeholder="Quantity"
                                    value={ingredient.quantity} required
                                    onChange={(e) => onChange(e, index)}
                                />
                                {credentials.ingredients.length === 1 ? (
                                    <button type="button" className="flex items-center justify-center p-2.5 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition" onClick={addIngredientField} title="Add Ingredient">
                                        <PlusCircle className="w-5 h-5" />
                                    </button>
                                ) : (
                                    <button type="button" className="flex items-center justify-center p-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition" onClick={() => removeIngredientField(index)} title="Remove Ingredient">
                                        <MinusCircle className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                {credentials.ingredients.length > 1 && ( // Show "Add Another" only if needed
                    <button type="button" className="w-full py-1.5 border-2 border-dashed border-amber-300 rounded-lg text-amber-600 text-sm font-medium hover:bg-amber-50 transition flex items-center justify-center" onClick={addIngredientField}>
                        <PlusCircle className="w-4 h-4 mr-1.5" /> Add Another Ingredient
                    </button>
                )}
            </div>

            {/* Image & YouTube Link Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                 {/* --- Recipe Image Upload (Adapted for Edit) --- */}
                <div>
                    <label htmlFor={uniqueFileInputId} className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Image className="w-4 h-4 mr-1.5 text-amber-500" />Recipe Image</label>
                    <div className="mt-1 flex flex-col items-center px-4 py-4 border-2 border-gray-300 border-dashed rounded-lg">
                        {/* Show new preview OR existing image */}
                        {(imagePreview || credentials.recipeImage) ? (
                            <div className="relative group w-full max-w-xs mx-auto mb-2">
                                <img src={imagePreview || credentials.recipeImage} alt="Recipe preview" className="h-32 w-full object-cover rounded-md shadow"/>
                                {/* Button to clear *new* selection or remove existing */}
                                <button type="button" onClick={clearImageSelection} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-80 group-hover:opacity-100 transition-opacity" title="Remove / Revert image" disabled={isUploading}>
                                    <X className="w-3.5 h-3.5" />
                                </button>
                                {/* Show upload button only if a new file is selected and not uploading */}
                                {imageFile && !isUploading && (
                                    <button type="button" onClick={() => uploadImage(imageFile)} className="mt-2 w-full text-xs flex justify-center items-center px-3 py-1.5 border border-transparent font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                                        <UploadCloud className="w-3 h-3 mr-1" /> Upload New
                                    </button>
                                )}
                            </div>
                        ) : (
                            // Placeholder if no image exists and no new one selected
                            <div className="space-y-1 text-center py-4">
                                <UploadCloud className="mx-auto h-10 w-10 text-gray-400" />
                                <div className="flex text-xs text-gray-600">
                                    <label htmlFor={uniqueFileInputId} className="relative cursor-pointer bg-white rounded-md font-medium text-amber-600 hover:text-amber-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-amber-500">
                                        <span>Upload a file</span>
                                        <input id={uniqueFileInputId} name="recipeImageFile" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-[11px] text-gray-500">PNG, JPG, GIF up to 10MB</p>
                            </div>
                        )}

                        {/* Change/Replace Image Input (always available unless uploading) */}
                         {!isUploading && (
                            <label htmlFor={uniqueFileInputId} className={`mt-2 text-sm font-medium ${ (imagePreview || credentials.recipeImage) ? 'text-amber-600 hover:text-amber-800 cursor-pointer underline' : 'text-gray-600' }`}>
                                { (imagePreview || credentials.recipeImage) ? 'Change Image' : 'Select Image' }
                                <input id={uniqueFileInputId} name="recipeImageFile" type="file" className="sr-only" onChange={handleImageChange} accept="image/*" />
                            </label>
                         )}


                        {/* Upload Progress */}
                        {isUploading && (
                            <div className="w-full mt-3 text-center">
                                <Loader2 className="w-5 h-5 text-amber-500 animate-spin inline-block mr-1.5" />
                                <p className="text-xs font-medium text-gray-700">Uploading... {uploadProgress}%</p>
                                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                        )}
                        {/* Display confirmation if *new* image was uploaded and state URL is updated */}
                        {credentials.recipeImage && !isUploading && imageFile && (
                             <p className="mt-1 text-xs text-green-600 break-all">
                                Uploaded: <a href={credentials.recipeImage} target="_blank" rel="noopener noreferrer" className="underline hover:text-green-800">{credentials.recipeImage.substring(0, 30)}...</a>
                             </p>
                         )}
                           {/* Display existing image URL if no new file is staged */}
                         {credentials.recipeImage && !isUploading && !imageFile && !imagePreview && (
                             <p className="mt-1 text-xs text-gray-500 break-all">
                                Current: <a href={credentials.recipeImage} target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-700">{credentials.recipeImage.substring(0, 30)}...</a>
                             </p>
                         )}
                    </div>
                </div>
                {/* --- End Recipe Image Upload --- */}

                {/* YouTube Link */}
                <div>
                    <label htmlFor={`youtubeLink-${recipeData._id}`} className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Youtube className="w-4 h-4 mr-1.5 text-amber-500" />YouTube Link (Optional)</label>
                    <input
                        type="url"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                        id={`youtubeLink-${recipeData._id}`} // Unique ID
                        name="youtubeLink"
                        value={credentials.youtubeLink} onChange={onChange}
                        placeholder="https://youtube.com/watch?v=..."
                    />
                </div>
            </div>

            {/* Details */}
            <div className="mb-5">
                <label htmlFor={`details-${recipeData._id}`} className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><FileText className="w-4 h-4 mr-1.5 text-amber-500" />Recipe Instructions</label>
                <textarea
                    className="w-full px-4 py-2.5 h-32 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    id={`details-${recipeData._id}`} // Unique ID
                    name="details" value={credentials.details} required onChange={onChange}
                    placeholder="Cooking steps..."
                />
            </div>

            {/* Options */}
            <div className="mb-6">
                <label htmlFor={`options-${recipeData._id}`} className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center"><Tag className="w-4 h-4 mr-1.5 text-amber-500" />Categories (Optional)</label>
                <div className="text-xs text-gray-500 mb-1">Hold Ctrl/Cmd to select multiple</div>
                <select
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                    id={`options-${recipeData._id}`} // Unique ID
                    name="options" multiple size="4"
                    value={credentials.options} onChange={onChange}
                >
                    {categoryOptions.map(option => (
                        <option key={option.value} value={option.value} className="py-0.5 px-2">{option.label}</option>
                    ))}
                </select>
            </div>

            {/* Submit button */}
            <div className="flex justify-center pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className={`w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center ${ (isSubmitting || isUploading) ? 'opacity-70 cursor-not-allowed' : 'hover:from-amber-600 hover:to-orange-600'}`}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
                {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div> {/* End Form Padding */}
      </div> {/* End Modal Content Box */}
    </div> // End Modal Container
  );
};

export default EditRecipeModal;