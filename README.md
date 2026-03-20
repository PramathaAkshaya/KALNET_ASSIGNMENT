# Explain My Plan — AI Clarity & Structuring Tool

A full-stack web application designed to help individuals refine vague ideas into structured, actionable plans.

## 🚀 Features
- **Raw Idea Structuring**: Converts natural language into Goal, Method, Steps, and Timeline.
- **Missing Elements Detection**: Analyzes gaps in goal clarity, resources, and execution.
- **Clarity Score (0-100)**: Provides a quantitative measure of plan viability.
- **Plan Refinement**: Shows a side-by-side comparison of the original idea vs the AI-cleaned version.
- **Actionable Steps**: Generates immediate, practical next tasks.
- **Iterative Workflow**: Allows users to modify and re-run their plans easily.

## 🛠️ Tech Stack
- **Frontend**: Next.js 15+ (App Router), React 19, Tailwind CSS.
- **AI**: Gemini 1.5 Flash (via `@google/generative-ai`).
- **Icons**: Lucide React.

## 🧠 AI Prompt Design
The core of the application lies in a structured, multi-instruction prompt that enforces a JSON response format. This ensures that the AI extracts all required components (Goal, Method, etc.) while simultaneously performing the analysis (Missing Elements, Scoring).

## 📊 Clarity Score Logic
The score is calculated by the AI based on:
1. **Specificity of the Goal** (e.g., "Start a business" vs "Open a bakery in London").
2. **Completeness of Steps** (Sequential vs fragmented).
3. **Resource Awareness** (Whether the plan mentions what is needed).
4. **Timeline Realism** (Presence of a concrete or estimated schedule).

## ⚙️ Setup Instructions
1. Clone the repository.
2. Run `npm install`.
3. Create a `.env.local` file with your `GEMINI_API_KEY`.
4. Run `npm run dev` to start the local server at `http://localhost:3000`.
