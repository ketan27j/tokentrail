import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import { TokenDetail } from "prisma-shared";
import { analyzeTweetPrompt } from "../prompt/analyzeTweet";

dotenv.config();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";

export class LlmService{
    public readonly ai : GoogleGenAI;
    public readonly modelName = process.env.GEMINI_MODEL_NAME || "gemini-2.0-flash";
    constructor() {
        this.ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
    }

    async analyzeTweet (tweet: string): Promise<TokenDetail> {
        try {
            const prompt = analyzeTweetPrompt(tweet);
            const response = await this.ai.models.generateContent({
                model: this.modelName,
                contents: prompt,
            });
            const text = response.text;
            try {
                // Try to parse the JSON response
                if (!text) {
                    throw new Error("Response text is undefined");
                }
                const jsonStr = text.replace(/```json|```/g, '').trim();
                const parsed = JSON.parse(jsonStr);
                
                // Convert date strings to Date objects if they exist
                if (parsed.startDate) {
                  parsed.startDate = new Date(parsed.startDate);
                }
                if (parsed.endDate) {
                  parsed.endDate = new Date(parsed.endDate);
                }
                
                return parsed as TokenDetail;
              } catch (parseError) {
                console.error('Failed to parse Gemini response', parseError);
                console.log('Raw response', text);
                throw parseError;
            }
        } catch (error) {
            console.error("Error analyzing tweet:", error);
            throw error;
        }
    }
}