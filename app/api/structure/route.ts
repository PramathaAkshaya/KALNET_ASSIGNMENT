import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();

    if (!idea) {
      return NextResponse.json({ error: "Idea is required" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "gemma-3-1b-it" });

    const prompt = `
      You are an expert project planner and clarity consultant. 
      The user has provided a raw, potentially vague idea or plan: "${idea}"

      Your task is to analyze this input and return a precisely structured JSON response with the following fields:

      1. "goal": A clear, single-sentence definition of the main objective.
      2. "method": A brief explanation of the proposed approach or strategy.
      3. "steps": An array of sequential, high-level phases to achieve the goal.
      4. "timeline": A string describing the estimated duration or "Missing" if not identifiable.
      5. "missingElements": An object with categories:
         - "goalClarity": Analysis of how specific the goal is.
         - "executionSteps": Are the steps logical and complete?
         - "resources": What tools/skills/people are missing but needed?
         - "timeline": Is there a realistic time estimate?
      6. "simplifiedVersion": A concise (max 2 sentences) and clearer version of the original input.
      7. "actionableSteps": An array of 3-5 immediate, practical next steps the user should take.
      8. "clarityScore": A number from 0 to 100 representing how well-defined the plan is.
      9. "scoreExplanation": A brief sentence explaining why this score was given.

      Constraints:
      - Return ONLY the JSON object.
      - Ensure all fields are present.
      - Be encouraging but realistic.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log("Raw AI Response:", text);
    
    // Simple JSON extraction from the AI response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const structuredData = jsonMatch ? JSON.parse(jsonMatch[0]) : null;

    if (!structuredData) {
      console.error("JSON Parsing Failed. Raw text:", text);
      throw new Error("Failed to parse AI response into JSON. The AI might be having trouble formatting the output.");
    }

    return NextResponse.json(structuredData);

  } catch (error: any) {
    console.error("Critical API Error:", error);
    return NextResponse.json({ 
      error: error.message || "Failed to structure plan.",
      details: error.stack?.split('\n')[0]
    }, { status: 500 });
  }
}



