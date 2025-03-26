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
 * 
 * @param {string} model 
 * @param {string} prompt 
 * @returns {Promise<string>} 
 */
export const fetchAIResponse = async (model: string, prompt: string): Promise<string> => {
  try {
    const response = await openRouter.post("/chat/completions", {
      model, 
      messages: [{ role: "user", content: prompt }],
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    

    if (axios.isAxiosError(error) && error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    

    return "Error: Unable to fetch AI response. Please try again later.";
  }
  
};
