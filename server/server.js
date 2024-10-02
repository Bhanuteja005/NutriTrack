import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import { doc, getDoc } from 'firebase/firestore';
import { marked } from 'marked';
import { auth, db } from "./firebase.js";

const app = express();
const PORT = process.env.PORT || 3001; // Use environment variable for port if available

// Enable CORS for all routes
app.use(cors());

// Set COOP and CORP headers
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  next();
});

// Function to fetch user document from Firebase
const fetchUserDocument = async (userId) => {
  try {
    const userDocRef = doc(db, "Demographics", userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const data = userDoc.data();
      console.log("Fetched user data:", data);
      return {
        allergies: data.Allergies || [],
        chronicDiseases: data.ChronicDiseases || [],
      };
    } else {
      console.log("No user document found.");
      return {
        allergies: [],
        chronicDiseases: [],
      };
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw new Error("An error occurred while fetching user details.");
  }
};

// SSE Endpoint
app.get("/recipestream", async (req, res) => {
  const ingredients = req.query.ingredients;
  const mealType = req.query.mealType;
  const cuisine = req.query.cuisine;
  const cookingTime = req.query.cookingTime;
  const complexity = req.query.complexity;

  console.log("Received request with query parameters:", req.query);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  // Function to send the entire response
  const sendEvent = (response) => {
    console.log("Sending response:", response);
    res.send(response);
  };

  // Fetch user data if user is authenticated
  let userData = { allergies: [], chronicDiseases: [] };
  const user = auth.currentUser;
  if (user) {
    try {
      userData = await fetchUserDocument(user.uid);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const prompt = [];
  prompt.push("Generate a recipe that incorporates the following details:");
  prompt.push(`Ingredients: ${ingredients}`);
  prompt.push(`Meal Type: ${mealType}`);
  prompt.push(`Cuisine Preference: ${cuisine}`);
  prompt.push(`Cooking Time: ${cookingTime}`);
  prompt.push(`Complexity: ${complexity}`);
  prompt.push(`Allergies: ${userData.allergies.join(", ")}`);
  prompt.push(`Chronic Diseases: ${userData.chronicDiseases.join(", ")}`);
  prompt.push(
    "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided."
  );
  prompt.push(
    "The recipe should highlight the fresh and vibrant flavors of the ingredients."
  );
  prompt.push(
    "Also give the recipe a suitable name in its local language based on cuisine preference."
  );

  run(prompt, sendEvent);

  req.on("close", () => {
    res.end();
  });
});

const API_KEY = process.env.GOOGLE_API_KEY; 
console.log("Using API Key:", API_KEY); // Log the API key being used
if (!API_KEY) {
  console.error("API Key is not defined. Please check your .env file.");
}
const genAI = new GoogleGenerativeAI({ apiKey: API_KEY });

async function run(prompt, callback) {
  try {
    console.log("Using API Key inside run function:", API_KEY); // Log the API key being used inside the function
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    
    const response = result.response;
    if (response && response.candidates && response.candidates[0] && response.candidates[0].content && response.candidates[0].content.parts) {
      const generatedText = marked(response.candidates[0].content.parts.map(part => part.text).join("\n"));
      console.log("Generated Text:", generatedText);
      callback(generatedText);  // Send the generated text to the client
    } else {
      console.log("No valid response structure found.");
    }
  } catch (error) {
    console.error("Error generating content:", error);
    console.error("Error details:", error);
  }
}

// Catch-all route for handling 404 errors
app.use((req, res, next) => {
  res.status(404).send("404: NOT_FOUND");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});