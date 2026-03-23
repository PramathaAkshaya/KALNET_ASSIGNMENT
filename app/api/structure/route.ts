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
      You are an elite strategic planner and risk analyst. 
      Analyze this idea: "${idea}"
      
      Return a STRICT JSON object with these EXACT keys:
      {
        "goal": "one crystal clear sentence",
        "method": "brief summary of the core approach",
        "steps": ["array of 5-8 concrete execution steps"],
        "missingElements": {
          "goalClarity": "brief assessment",
          "executionSteps": "brief assessment",
          "resources": "brief assessment",
        },
        "simplifiedVersion": "a 1-sentence version a 5-year old could understand",
        "actionableSteps": ["array of 4 immediate, easy-to-start next steps"],
        "clarityScore": number (0-100),
        "scoreExplanation": "brief explanation of why the score is what it is",
        "critique": ["3 potential risks, blind spots, or reasons for failure as a 'Devil's Advocate'"],
        "toolkit": [
          {"name": "Tool Name", "useCase": "What to use it for in this specific plan"},
          {"name": "Tool Name", "useCase": "What to use it for in this specific plan"},
          {"name": "Tool Name", "useCase": "What to use it for in this specific plan"}
        ],
        "simulations": [
          {"scenario": "Half Budget Crisis", "adjustment": "1-sentence on how the plan changes"},
          {"scenario": "Half Time Crisis (Double Speed)", "adjustment": "1-sentence on how the plan changes"}
        ],
        "references": {
          "relatedLinks": [
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "brief what this site offers"},
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "brief what this site offers"}
          ],
          "costsAndBudgets": [
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "how to use for cost estimation"},
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "how to use for cost estimation"},
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "how to use for cost estimation"},
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "how to use for cost estimation"},
            {"name": "Real Site Name", "url": "https://www.actual-working-url.com", "description": "how to use for cost estimation"}
          ],
          "funFacts": [
            {"fact": "an interesting short fact or trend about this topic"},
            {"fact": "an interesting short fact or trend about this topic"},
            {"fact": "an interesting short fact or trend about this topic"}
          ]
        }
      }
      
      CRITICAL INSTRUCTION FOR REFERENCES: 
      You MUST provide REAL, WORKING, SPECIFIC URLs for the 'url' fields (e.g., "https://www.tripadvisor.com" or "https://www.makemytrip.com"). Do NOT output dummy links like "https://...". The links must be highly relevant specific websites for the user's idea.
      
      Respond only with the JSON object. No extra text or markdown.
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



