import axios from "axios";

export const fetchAIResponse = async (
  model: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await axios.post("/api/openrouter/chat", {
      model,
      prompt,
    });
    return response.data.content;
  } catch (error) {
    console.error("Error calling server endpoint:", error);
    return "Error: Unable to fetch AI response. Please try again later.";
  }
};
