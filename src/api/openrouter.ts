import axios from "axios";

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const openRouter = axios.create({
  baseURL: "https://openrouter.ai/api/v1",
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

/**
 * Fetch AI response from OpenRouter API
 * @param {string} model - The model name (e.g., "dolphin-mistral:latest", "deepseek-chat")
 * @param {string} prompt - The user input prompt
 * @returns {Promise<string>} - The AI-generated response
 */
export const fetchAIResponse = async (model: string, prompt: string): Promise<string> => {
  try {
    const response = await openRouter.post("/chat/completions", {
      model, // Use dynamic model
      messages: [{ role: "user", content: prompt }],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    
    // If error is an axios error and the response is available, try to get more info.
    if (axios.isAxiosError(error) && error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    // Show a generic message to the user while you investigate the specific error details in the log.
    return "Error: Unable to fetch AI response. Please try again later.";
  }
  
};
