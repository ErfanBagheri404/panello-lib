import { Request, Response } from "express";
import axios from "axios";

export const fetchAIResponse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { model, prompt } = req.body;
    if (!model || !prompt) {
      res.status(400).json({ error: "Missing model or prompt" });
      return;
    }

    const API_KEY = process.env.OPENROUTER_API_KEY || "";
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model,
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiContent = response.data?.choices?.[0]?.message?.content ?? "";
    res.status(200).json({ content: aiContent });
  } catch (error) {
    console.error("OpenRouter error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
