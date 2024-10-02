import { addDoc, collection } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from "react";
import { useAuthState } from 'react-firebase-hooks/auth';
import sanitizeHtml from 'sanitize-html';
import { auth, db } from '../config/firebase';

const RecipeCard = ({ onSubmit }) => {
  const [ingredients, setIngredients] = useState("");
  const [mealType, setMealType] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [cookingTime, setCookingTime] = useState("");
  const [complexity, setComplexity] = useState("");

  const handleSubmit = () => {
    const recipeData = {
      ingredients,
      mealType,
      cuisine,
      cookingTime,
      complexity,
    };
    onSubmit(recipeData);
  };

  return (
    <div className="w-[400px] h-[565px] border rounded-lg overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Recipe Generator</div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="ingredients"
          >
            Ingredients
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="ingredients"
            type="text"
            placeholder="Enter ingredients"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="mealType"
          >
            Meal Type
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="mealType"
            type="text"
            placeholder="Enter meal type"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="cuisine"
          >
            Cuisine Preference
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="cuisine"
            type="text"
            placeholder="e.g., Italian, Mexican"
            value={cuisine}
            onChange={(e) => setCuisine(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="cookingTime"
          >
            Cooking Time
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="cookingTime"
            type="text"
            placeholder="e.g. 30 minutes"
            value={cookingTime}
            onChange={(e) => setCookingTime(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="complexity"
          >
            Complexity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="complexity"
            type="text"
            placeholder="e.g. beginner, advanced, intermediate"
            value={complexity}
            onChange={(e) => setComplexity(e.target.value)}
          />
        </div>
        <div className="px-6 py-4">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSubmit}
          >
            Generate Recipe
          </button>
        </div>
      </div>
    </div>
  );
};

function Recipes() {
  const [recipeData, setRecipeData] = useState(null);
  const [recipeText, setRecipeText] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [user] = useAuthState(auth);

  let eventSourceRef = useRef(null);

  useEffect(() => {
    closeEventStream(); // Close any existing connection
  }, []);

  useEffect(() => {
    if (recipeData) {
      closeEventStream(); // Close any existing connection
      initializeEventStream();
    }
  }, [recipeData]);

  // Function to initialize the event stream
  const initializeEventStream = () => {
    const recipeInputs = { ...recipeData };

    // Construct query parameters
    const queryParams = new URLSearchParams(recipeInputs).toString();

    // Open an SSE connection with these query parameters
    setUrl(`http://localhost:3001/recipestream?${queryParams}`);
    eventSourceRef.current = new EventSource(url);

    eventSourceRef.current.onerror = () => {
      eventSourceRef.current.close();
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading to true when fetching starts
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.text(); // Use response.text() for plain text response
        setRecipeText(data); // Update recipe text with received data
      } catch (error) {
        console.error('Error fetching recipe data:', error);
      } finally {
        setLoading(false); // Set loading to false when fetching ends
      }
    };

    if (url) {
      fetchData();
    }
  }, [url]);

  const sanitizedText = sanitizeHtml(recipeText, {
    allowedTags: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'li', 'strong', 'em'],
    allowedAttributes: {} // You may also want to allow certain attributes if needed
  });

  // Function to close the event stream
  const closeEventStream = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  async function onSubmit(data) {
    // update state
    setRecipeText('');
    setRecipeData(data);
  }

  const handleAddBookmark = async () => {
    if (user && recipeText.trim() !== '') {
      const newBookmark = { recipeName: recipeText, uid: user.uid };
      await addDoc(collection(db, 'bookmarks'), newBookmark);
      alert('Recipe bookmarked successfully!');
    }
  };

  return (
    <>
      <div className="App">
        <div className="flex flex-row my-4 gap-2 justify-center pt-[10vh]">
          <RecipeCard onSubmit={onSubmit} />
          <div className="w-[400px] h-[565px] text-xs text-gray-600 p-4 border rounded-lg shadow-xl whitespace-pre-line overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="loader"></div> {/* Add a loader */}
                <span>Loading...</span>
              </div>
            ) : (
              <div>
                <div dangerouslySetInnerHTML={{ __html: sanitizedText }} />
                {recipeText && (
                  <button
                    onClick={handleAddBookmark}
                    className="bg-green-500 text-white p-2 rounded mt-4"
                  >
                    Bookmark Recipe
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Recipes;