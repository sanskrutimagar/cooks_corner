import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import backendContext from "../contex/backend/backendContext";

// Maximum allowed characters per query segment
const MAX_CHARACTERS = 500;

// Translation functions
async function translateTextMyMemory(text, targetLang) {
  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=en|${targetLang}`;
    const response = await fetch(url);
    const data = await response.json();
    return data.responseData?.translatedText || text;
  } catch (error) {
    console.error("MyMemory translation error:", error);
    return text; // fallback to original text
  }
}

const splitTextIntoSegments = (text, maxLength) => {
  const segments = [];
  let start = 0;
  while (start < text.length) {
    segments.push(text.slice(start, start + maxLength));
    start += maxLength;
  }
  return segments;
};

const translateLongText = async (text, targetLang) => {
  const segments = splitTextIntoSegments(text, MAX_CHARACTERS);
  const translatedSegments = [];
  for (const segment of segments) {
    const translated = await translateTextMyMemory(segment, targetLang);
    translatedSegments.push(translated);
  }
  return translatedSegments.join(" ");
};

// Component for language selector with enhanced styling
const LanguageSelector = ({ language, setLanguage, languages }) => (
  <div className="sticky top-0 z-10 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 rounded-lg shadow-sm mb-6 flex justify-end">
    <div className="inline-flex items-center">
      <label htmlFor="language-select" className="mr-2 text-emerald-700 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
        </svg>
        Language:
      </label>
      <select
        id="language-select"
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-white border border-emerald-200 text-emerald-800 rounded-md py-1 px-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>
    </div>
  </div>
);

// Star rating component
const StarRating = ({ rating, interactive = false, onChange = null, size = "regular" }) => {
  const sizes = {
    small: { fontSize: "16px", marginRight: "2px" },
    regular: { fontSize: "20px", marginRight: "3px" },
    large: { fontSize: "24px", marginRight: "5px" }
  };
  
  const style = sizes[size] || sizes.regular;
  
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => interactive && onChange && onChange(star.toString())}
          className={`${interactive ? "cursor-pointer" : ""} transition-colors duration-200 ${
            star <= parseInt(rating) ? "text-yellow-400" : "text-gray-300"
          } ${interactive && star <= parseInt(rating) ? "hover:text-yellow-500" : ""}`}
          style={{ fontSize: style.fontSize, marginRight: style.marginRight }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

// Recipe details component
const RecipeDetails = ({
  translatedName,
  handleBookmarkToggle,
  isBookmarked,
  recipe,
  translatedIngredients,
  translatedDetails,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Recipe header with image */}
      <div className="relative">
        <img
          src={recipe.recipe.recipeImage}
          alt={translatedName}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        
        {/* Recipe name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex justify-between items-end">
            <h1 className="text-white text-3xl font-bold mb-2 drop-shadow-md">
              {translatedName}
            </h1>
            <button
              onClick={handleBookmarkToggle}
              className="bg-white/90 hover:bg-white p-2 rounded-full transition-all duration-200 transform hover:scale-105"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 ${
                  isBookmarked ? "text-emerald-500 fill-emerald-500" : "text-gray-500"
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Recipe metadata */}
      <div className="px-6 py-4">
        <div className="flex flex-wrap justify-between items-center mb-6">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="mr-6">
              <div className="text-xs text-gray-500 uppercase font-medium mb-1">Preparation</div>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{recipe.recipe.preparationTime} mins</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-medium mb-1">Cooking</div>
              <div className="flex items-center text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
                </svg>
                <span>{recipe.recipe.cookingTime} mins</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xs text-gray-500 uppercase font-medium mb-1">Rating</div>
            <div className="flex items-center">
              <StarRating rating={recipe.recipe.averageRating || 0} size="small" />
              <span className="ml-2 text-gray-700">
                ({recipe.recipe.averageRating?.toFixed(1) || "0.0"})
              </span>
            </div>
          </div>
        </div>

        {/* Ingredients section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-emerald-800 border-b border-emerald-100 pb-2">
            Ingredients
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {translatedIngredients.map((ingredient, index) => (
              <li key={index} className="flex items-start py-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-emerald-500 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>
                  <span className="font-medium">{ingredient.name}</span>
                  {ingredient.quantity && (
                    <span className="text-gray-600"> - {ingredient.quantity}</span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Preparation details */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4 text-emerald-800 border-b border-emerald-100 pb-2">
            Preparation
          </h2>
          <div className="text-gray-700 whitespace-pre-line leading-relaxed">
            {translatedDetails}
          </div>
        </div>
      </div>
    </div>
  );
};

// Review form component
const ReviewForm = ({
  rating,
  setRating,
  comment,
  setComment,
  submitting,
  handleReviewSubmit,
}) => {
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold mb-4 text-emerald-800">Write a Review</h3>
      <form onSubmit={handleReviewSubmit} className="bg-white rounded-lg p-6 shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Your Rating</label>
          <StarRating 
            rating={rating} 
            interactive={true} 
            onChange={setRating} 
            size="large" 
          />
        </div>
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-700 font-medium mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 min-h-32"
            placeholder="Share your experience with this recipe..."
          ></textarea>
        </div>
        <button
          type="submit"
          disabled={submitting}
          className={`px-6 py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors ${
            submitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
};

// Review list component
const ReviewList = ({ reviews }) => {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No reviews yet. Be the first to review this recipe!
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-emerald-800">
        Reviews ({reviews.length})
      </h3>
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="bg-white rounded-lg p-5 shadow-sm">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center">
                <div className="bg-emerald-100 text-emerald-700 font-bold w-10 h-10 rounded-full flex items-center justify-center mr-3">
                  {review.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <div className="font-medium">{review.user?.name || "Anonymous"}</div>
                  <div className="text-gray-500 text-sm">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-gray-700 mt-2">{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Main component
const DetailedRecipe = () => {
  const navigate = useNavigate();
  const context = useContext(backendContext);
  const { host } = context;
  const { recipeId } = useParams();

  // Recipe and bookmark states
  const [recipe, setRecipe] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Translated fields
  const [translatedName, setTranslatedName] = useState("");
  const [translatedDetails, setTranslatedDetails] = useState("");
  const [translatedIngredients, setTranslatedIngredients] = useState([]);

  // Language state
  const [language, setLanguage] = useState("en");
  const languages = [
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "fr", label: "French" },
    { value: "de", label: "German" },
    { value: "es", label: "Spanish" },
  ];

  // Review states
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [translating, setTranslating] = useState(false);

  // Fetch recipe details
  useEffect(() => {
    if (!localStorage.getItem("culinashareToken")) {
      navigate("/login");
      return;
    }

    const fetchRecipeDetails = async (id) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${host}/api/foodresp/detailedrecipe/${id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("culinashareToken"),
          },
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch recipe details");
        }
        
        const json = await response.json();
        setRecipe(json);
        setIsBookmarked(json.isBookmark);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
        setError("Failed to load recipe. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipeDetails(recipeId);
  }, [recipeId, host, navigate]);

  // Fetch reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`${host}/api/foodresp/reviews/${recipeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("culinashareToken"),
          },
        });
        const json = await response.json();
        if (Array.isArray(json)) {
          setReviews(json);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      }
    };

    if (recipeId) {
      fetchReviews();
    }
  }, [recipeId, host]);

  // Translate recipe content
  useEffect(() => {
    const doTranslation = async () => {
      if (!recipe) return;
      setTranslating(true);
      
      try {
        if (language === "en") {
          setTranslatedName(recipe.recipe.recipeName);
          setTranslatedDetails(recipe.recipe.details);
          setTranslatedIngredients(recipe.recipe.ingredients);
        } else {
          const newName = await translateLongText(recipe.recipe.recipeName, language);
          setTranslatedName(newName);

          const newDetails = await translateLongText(recipe.recipe.details, language);
          setTranslatedDetails(newDetails);

          const newIngredients = [];
          for (const ing of recipe.recipe.ingredients) {
            const ingName = await translateLongText(ing.name, language);
            newIngredients.push({ ...ing, name: ingName });
          }
          setTranslatedIngredients(newIngredients);
        }
      } catch (error) {
        console.error("Translation error:", error);
      } finally {
        setTranslating(false);
      }
    };

    doTranslation();
  }, [recipe, language]);

  // Toggle bookmark
  const handleBookmarkToggle = async () => {
    try {
      if (isBookmarked) {
        const response = await fetch(`${host}/api/foodresp/delete-user-bookmarks/${recipeId}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("culinashareToken"),
          },
        });
        if (response.ok) setIsBookmarked(false);
      } else {
        const response = await fetch(`${host}/api/foodresp/user-bookmarks/${recipeId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("culinashareToken"),
          },
        });
        if (response.ok) setIsBookmarked(true);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  // Handle review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!rating || rating < 1 || rating > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }
    if (!comment.trim()) {
      alert("Please enter a comment.");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${host}/api/foodresp/review/${recipeId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("culinashareToken"),
        },
        body: JSON.stringify({ rating: Number(rating), comment }),
      });

      if (response.ok) {
        // Refetch reviews after successful submission
        const reviewsResponse = await fetch(`${host}/api/foodresp/reviews/${recipeId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("culinashareToken"),
          },
        });
        const reviewsJson = await reviewsResponse.json();
        if (Array.isArray(reviewsJson)) {
          setReviews(reviewsJson);
        }
        setRating("5");
        setComment("");
      } else {
        const errorData = await response.json();
        alert(errorData.msg || "Failed to submit review.");
      }
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("An error occurred while submitting your review.");
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Something went wrong</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <LanguageSelector
        language={language}
        setLanguage={setLanguage}
        languages={languages}
      />
      
      {translating && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Translating content to {languages.find(l => l.value === language)?.label}...
        </div>
      )}
      
      {recipe && (
        <>
          <RecipeDetails
            translatedName={translatedName}
            handleBookmarkToggle={handleBookmarkToggle}
            isBookmarked={isBookmarked}
            recipe={recipe}
            translatedIngredients={translatedIngredients}
            translatedDetails={translatedDetails}
          />
          
          <div className="my-10 bg-emerald-50 rounded-2xl p-6 shadow-md">
            <ReviewForm
              rating={rating}
              setRating={setRating}
              comment={comment}
              setComment={setComment}
              submitting={submitting}
              handleReviewSubmit={handleReviewSubmit}
            />
            <ReviewList reviews={reviews} />
          </div>
        </>
      )}
    </div>
  );
};

export default DetailedRecipe;