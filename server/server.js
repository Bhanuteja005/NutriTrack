import { GoogleGenerativeAI } from "@google/generative-ai";
import cors from 'cors';
import 'dotenv/config'; // Load environment variables from .env file
import express from 'express';
import { doc, getDoc } from 'firebase/firestore';
import { marked } from 'marked';
import { auth, db } from "../src/config/firebase.js"; // Corrected import path

const app = express();
const PORT = process.env.PORT || 3001; // Use PORT from env or default to 3001

// Enable CORS for all routes
app.use(cors());

// Function to fetch user document from Firebase
const fetchUserDocument = async (userId) => {
  try {
    const userDocRef = doc(db, "Demographics", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return {
        allergies: userDoc.data().Allergies || [],
        chronicDiseases: userDoc.data().ChronicDiseases || [],
      };
    } else {
      return { allergies: [], chronicDiseases: [] };
    }
  } catch (error) {
    console.error("Error fetching user document:", error);
    throw new Error("An error occurred while fetching user details.");
  }
};

// SSE Endpoint
app.get("/recipestream", async (req, res) => {
  const { ingredients, mealType, cuisine, cookingTime, complexity } = req.query;

  console.log("Received request with query parameters:", req.query);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const sendEvent = (response) => {
    console.log("Sending response:", response);
    res.send(response);
  };

  let userData = { allergies: [], chronicDiseases: [] };
  const user = auth.currentUser;
  
  if (user) {
    try {
      userData = await fetchUserDocument(user.uid);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  const prompt = [
    "Generate a recipe that incorporates the following details:",
    `[Ingredients: ${ingredients}]`,
    `[Meal Type: ${mealType}]`,
    `[Cuisine Preference: ${cuisine}]`,
    `[Cooking Time: ${cookingTime}]`,
    `[Complexity: ${complexity}]`,
    `[Allergies: ${userData.allergies.join(", ")}]`,
    `[Chronic Diseases: ${userData.chronicDiseases.join(", ")}]`,
    "Please provide a detailed recipe, including steps for preparation and cooking. Only use the ingredients provided.",
    "The recipe should highlight the fresh and vibrant flavors of the ingredients.",
    "Also give the recipe a suitable name in its local language based on cuisine preference."
  ];

  run(prompt, sendEvent);

  req.on("close", () => {
    res.end();
  });
});

const API_KEY = process.env.GOOGLE_API_KEY; 
if (!API_KEY) {
  console.error("API Key is not defined. Please check your .env file.");
  process.exit(1); // Exit the process if API key is not defined
}
const genAI = new GoogleGenerativeAI(API_KEY);

async function run(prompt, callback) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    const result = await model.generateContent(prompt);
    
    const response = result.response;
    if (response && response.candidates?.[0]?.content?.parts) {
      const generatedText = marked(response.candidates[0].content.parts.map(part => part.text).join("\n"));
      callback(generatedText);  // Send the generated text to the client
    } else {
      console.log("No valid response structure found.");
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
