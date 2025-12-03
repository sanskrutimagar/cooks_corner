import React, { useContext, useState } from "react";
import backendContext from "../contex/backend/backendContext";
import RenderCards from "./RenderCards";

// Modern design using Tailwind CSS instead of Bootstrap
const SearchRecipes = () => {
  const context = useContext(backendContext);
  const { host } = context;

  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    try {
      if (!searchTerm.trim()) {
        setErrorMessage("Please enter something to search.");
        return;
      }

      setIsLoading(true);
      const response = await fetch(`${host}/api/foodresp/search-recipe`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: searchTerm }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setRecipes([]);
        setErrorMessage(errorData.msg);
      }
    } catch (error) {
      console.error("Error searching recipes:", error);
      setErrorMessage("Failed to search recipes. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const findOptionRecipe = async (option) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${host}/api/foodresp/search-recipe-base-options`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ options: option }),
      });

      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
        setErrorMessage("");
      } else {
        const errorData = await response.json();
        setRecipes([]);
        setErrorMessage(errorData.msg);
      }
    } catch (error) {
      console.error("Error searching recipes by option:", error);
      setErrorMessage(`Failed to fetch ${option} recipes. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 text-emerald-700">Find Your Perfect Recipe</h2>
      
      {/* Search Form */}
      <form 
        className="mb-8"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="relative rounded-lg shadow-md">
          <input
            type="text"
            className="w-full py-4 px-6 pr-20 rounded-lg border-2 border-emerald-200 focus:border-emerald-500 focus:outline-none text-gray-700 transition duration-300"
            placeholder="Search for delicious recipes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full px-6 bg-emerald-500 text-white font-medium rounded-r-lg hover:bg-emerald-600 transition duration-300 flex items-center"
            disabled={isLoading}
          >
            {isLoading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      {/* Category Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CategoryButton 
          icon="/images/salad.gif" 
          label="Vegetarian" 
          onClick={() => findOptionRecipe("vegetarian")} 
          isLoading={isLoading}
        />
        <CategoryButton 
          icon="/images/meat.gif" 
          label="Non-Vegetarian" 
          onClick={() => findOptionRecipe("non vegetarian")} 
          isLoading={isLoading}
        />
        <CategoryButton 
          icon="/images/cake.gif" 
          label="Dessert" 
          onClick={() => findOptionRecipe("dessert")} 
          isLoading={isLoading}
        />
        <CategoryButton 
          icon="/images/cookbook.gif" 
          label="Quick Recipes" 
          onClick={() => findOptionRecipe("quick recipes")} 
          isLoading={isLoading}
        />
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <p>{errorMessage}</p>
        </div>
      )}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex justify-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}

      {/* Results */}
      {recipes.length > 0 && !isLoading && (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4 text-gray-800">Found {recipes.length} Recipes</h3>
          <RenderCards recipes={recipes} />
        </div>
      )}

      {recipes.length === 0 && !isLoading && !errorMessage && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">Search for recipes or select a category to get started!</p>
        </div>
      )}
    </div>
  );
};

// Extracted category button as a separate component
const CategoryButton = ({ icon, label, onClick, isLoading }) => (
  <button
    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col items-center p-4 border border-gray-100 hover:border-emerald-200"
    onClick={onClick}
    disabled={isLoading}
  >
    <div className="h-16 w-16 flex items-center justify-center mb-2">
      <img className="h-12 w-12 object-contain" src={icon} alt={label} />
    </div>
    <p className="text-gray-700 font-medium text-sm md:text-base">{label}</p>
  </button>
);

export default SearchRecipes;