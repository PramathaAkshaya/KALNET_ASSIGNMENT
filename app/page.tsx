"use client";

import { useState, useEffect } from "react";
import { Send, Sparkles, AlertCircle, CheckCircle2, ListTodo, Calendar, Target, Layers } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    setMounted(true);
    console.log("React Hydration Complete. Site is interactive.");
  }, []);


  const handleGenerate = async () => {
    if (isGenerating) {
      window.alert("Please wait, the AI is already working!");
      return;
    }
    if (!input.trim()) {
      window.alert("Please type your idea in the text area above before clicking!");
      return;
    }
    window.alert("SUCCESS: Click registered! Sending your idea to the AI now...");
    
    setIsGenerating(true);
    setResult(null);
    setErrorMsg("");
    try {
      console.log("Fetching /api/structure...");
      const res = await fetch("/api/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input }),
      });
      console.log("Response received. Status:", res.status);
      const data = await res.json();
      console.log("Data parsed:", data);
      
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to generate plan.");
        return;
      }
      
      setResult(data);
      // Wait for state to update then scroll to results
      setTimeout(() => {
        const root = document.getElementById("results-root");
        if (root) {
          root.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 500);
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.message || "An unexpected error occurred.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleReset = () => {
    setInput("");
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen px-4 py-12 md:px-8 max-w-5xl mx-auto flex flex-col gap-12">
      {/* Sticky Header with Reset */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
        <div className="glass rounded-full px-6 py-3 flex items-center justify-between shadow-xl border-white/5 bg-slate-950/50">
          <div className="flex items-center gap-2 font-bold text-sm tracking-tight">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            Explain My Plan
          </div>
          {result && (
            <button 
              onClick={handleReset}
              className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </nav>

      {/* Generating Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">AI is crafting your plan...</h2>
            <p className="text-blue-300/70 text-sm animate-pulse">This usually takes 5-10 seconds</p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <header className="flex flex-col gap-4 text-center mt-8">
        <div className="inline-flex items-center justify-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm font-medium w-fit mx-auto shadow-[0_0_15px_rgba(59,130,246,0.3)]">
          <Sparkles className="w-4 h-4" />
          <span>Powered by Gemini AI</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
          Explain <span className="gradient-text">My Plan</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Turn your vague, unstructured ideas into clear, actionable plans. 
          Get clarity scores, missing element alerts, and precise next steps.
        </p>
      </header>

      {/* Input Interface */}
      <section className="glass rounded-3xl p-6 md:p-8 flex flex-col gap-6 shadow-2xl">
        <div className="flex flex-col gap-2">
          <label htmlFor="idea" className="text-sm font-medium text-slate-300 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-400" />
            Your Raw Idea or Plan
          </label>
          <textarea
            id="idea"
            rows={5}
            className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl p-4 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none text-slate-200"
            placeholder="e.g., I want to start a YouTube channel and earn money quickly..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <button
          onClick={handleGenerate}
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-4 px-8 rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/40 hover:shadow-blue-500/60 blue-glow group w-full cursor-pointer active:scale-95"
        >
          {isGenerating ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing your idea...</span>
            </>
          ) : (
            <>
              <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              <span>Generate Structured Plan</span>
            </>
          )}
        </button>
      </section>

      {/* Error Message */}
      {errorMsg && (
        <section className="glass rounded-2xl p-6 border-l-4 border-l-red-500 bg-red-950/20 text-red-200 shadow-lg animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="font-medium text-sm md:text-base">{errorMsg}</span>
            </div>
            {/* We can peek at window.lastErrorDetails if we set it in handleGenerate */}
            <p className="text-[10px] opacity-70 font-mono pl-8">Check browser console for full trace.</p>
          </div>
        </section>
      )}


      {/* Results - Module 3-8 */}
      {result && !isGenerating && (
        <section id="results-root" className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 border-t border-slate-900">
          
          {/* Module 8: Clarity Score Header */}
          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-white/10 flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-32 h-32 flex-none">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-slate-800" />
                <circle 
                  cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" 
                  strokeDasharray="283" 
                  strokeDashoffset={283 - (283 * result.clarityScore) / 100}
                  strokeLinecap="round"
                  className="text-blue-500 transition-all duration-1000 ease-out" 
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold">{result.clarityScore}</span>
                <span className="text-[10px] uppercase font-bold text-slate-500">Clarity</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-center md:text-left">
              <h2 className="text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
                <Target className="w-6 h-6 text-blue-400" />
                Your Plan Analysis
              </h2>
              <p className="text-slate-300 text-lg leading-relaxed">
                {result.scoreExplanation}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Goal Card */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-l-blue-400 hover:border-l-blue-300 transition-colors">
              <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-xs">
                <Target className="w-4 h-4" />
                The Core Goal
              </div>
              <p className="text-xl font-medium text-slate-200 leading-relaxed">
                {result.goal}
              </p>
            </div>

            {/* Method Card */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-l-cyan-400 hover:border-l-cyan-300 transition-colors">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-xs">
                <Layers className="w-4 h-4" />
                The Approach
              </div>
              <p className="text-lg text-slate-300 leading-relaxed">
                {result.method}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Steps List - takes 2 cols on desktop */}
            <div className="md:col-span-2 glass rounded-2xl p-6 flex flex-col gap-6">
              <div className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-xs">
                <ListTodo className="w-4 h-4" />
                Execution Phases
              </div>
              <div className="flex flex-col gap-4">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="flex gap-4 group">
                    <div className="flex-none w-8 h-8 rounded-full bg-slate-800/80 border border-sky-500/30 flex items-center justify-center text-sm font-bold text-sky-400 group-hover:border-sky-400 group-hover:bg-sky-500/10 transition-colors">
                      {index + 1}
                    </div>
                    <p className="text-slate-200 py-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Timeline Card */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 bg-blue-500/5 border border-blue-500/10">
              <div className="flex items-center gap-2 text-blue-400 font-semibold uppercase tracking-wider text-xs">
                <Calendar className="w-4 h-4" />
                Estimated Timeline
              </div>
              <p className="text-2xl font-bold text-slate-100 flex-grow flex items-center">
                {result.timeline}
              </p>
              <p className="text-xs text-slate-500 italic">
                *Based on typical project trajectories.
              </p>
            </div>
          </div>

          {/* Module 5: Missing Elements */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-xs px-2">
              <AlertCircle className="w-4 h-4" />
              Missing Elements Detection
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(result.missingElements).map(([key, value]: [string, any]) => (
                <div key={key} className="glass rounded-xl p-4 flex flex-col gap-2 border-t-2 border-t-blue-500/50 hover:border-t-blue-400 transition-colors bg-blue-900/10">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  <p className="text-sm text-slate-200 leading-snug">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Module 6: Simplified Version Comparison */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-xs px-2">
              <Sparkles className="w-4 h-4" />
              Plan Refinement (Before vs After)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass rounded-2xl p-6 bg-slate-900/50 border-slate-800">
                <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Your Original Input</span>
                <p className="text-sm text-slate-400 italic font-serif">"{input}"</p>
              </div>
              <div className="glass rounded-2xl p-6 bg-blue-600/10 border-blue-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded-bl-xl">Clearer Copy</div>
                <span className="text-[10px] font-bold text-blue-400/80 uppercase mb-2 block">AI Refined Version</span>
                <p className="text-base text-slate-100 font-medium">{result.simplifiedVersion}</p>
              </div>
            </div>
          </div>

          {/* Module 7: Actionable Steps */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-xs px-2">
              <CheckCircle2 className="w-4 h-4" />
              Immediate Action Plan
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.actionableSteps.map((task: string, index: number) => (
                <div key={index} className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-cyan-500/10 transition-colors border-l-2 border-l-cyan-500/50">
                  <div className="mt-1 flex-none w-5 h-5 rounded border border-cyan-500/50 flex items-center justify-center text-[10px] font-bold text-cyan-400 bg-cyan-500/10">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-200 font-medium">{task}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Loading Placeholders */}
      {isGenerating && (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-40 glass rounded-2xl border-slate-800" />
          <div className="h-40 glass rounded-2xl border-slate-800" />
        </section>
      )}
    </main>
  );
}
