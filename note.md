# Project Challenges & AI Approach

### Challenges Faced
One of the primary technical challenges was ensuring the AI consistently returned a valid, structured JSON response regardless of how messy or minimal the user's input was. Since the requirements demanded multiple specific fields (Goal, Method, Missing Elements, etc.), a single malformed response could break the entire UI. I solved this by using a strict prompt template that defines every field and enforces a JSON-only output, combined with robust parsing logic on the backend.

### AI Prompting Approach
My approach focused on **"Instructional Layering."** Instead of just asking for a plan, I instructed the AI to act as a "Project Planning Consultant." This persona shift improved the quality of the "Missing Elements" detection, as the AI moved from mere summarization to active critical analysis. I also prioritized the "Actionable Steps" field to ensure the tool provided immediate value. By forcing the AI to output a "Clarity Score" alongside an explanation, I ensured transparency in how it evaluated the user's ideation progress.
