"use client";

import { useState, useEffect } from "react";
import { Send, Sparkles, AlertCircle, CheckCircle2, ListTodo, Calendar, Target, Layers, Briefcase, Map, Zap, Search, ShieldAlert, Wrench, Thermometer, Cpu, Globe, DollarSign, Lightbulb, History, Clock } from "lucide-react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  
  const [history, setHistory] = useState<any[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const [showToast, setShowToast] = useState(false);


  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("planHistory");
      if (saved) setHistory(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const handleGenerate = async () => {
    if (isGenerating || !input.trim()) return;
    
    setIsGenerating(true);
    setResult(null);
    setErrorMsg("");
    
    try {
      const res = await fetch("/api/structure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input }),
      });
      const data = await res.json();
      
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to generate plan.");
        setIsGenerating(false);
        return;
      }
      
      setResult(data);
      setIsGenerating(false);
      
      // Save to history
      const newHistoryItem = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleString(),
        inputidea: input,
        result: data
      };
      setHistory(prev => {
        const newHist = [newHistoryItem, ...prev].slice(0, 10); // keep last 10
        localStorage.setItem("planHistory", JSON.stringify(newHist));
        return newHist;
      });

      setTimeout(() => {
        document.getElementById("results-root")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 500);
    } catch (error: any) {
      setErrorMsg(error.message || "An unexpected error occurred.");
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const ClarityGauge = ({ score }: { score: number }) => {
    const radius = 35;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="relative flex items-center justify-center w-24 h-24 drop-shadow-[0_0_15px_rgba(59,130,246,0.2)]">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="6" fill="transparent" className="text-blue-500/10" />
          <circle
            cx="48"
            cy="48"
            r={radius}
            stroke="currentColor"
            strokeWidth="6"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="text-blue-500 transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className="text-xl font-bold text-white">{score}</span>
          <span className="text-[8px] uppercase tracking-widest text-blue-300/60 font-medium">Clarity</span>
        </div>
      </div>
    );
  };


  const handleReset = () => {
    setInput("");
    setResult(null);
    setCompletedSteps([]);
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
          <div className="flex items-center gap-4">
            {result && (
              <button 
                onClick={handleReset}
                className="text-xs font-bold text-slate-400 hover:text-white transition-colors"
              >
                Start Over
              </button>
            )}
            <button 
              onClick={() => setShowHistory(true)}
              className="text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
              title="View History"
            >
              <History className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">History</span>
            </button>
          </div>
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
          <div className="glass rounded-3xl p-8 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className="flex-none">
              <ClarityGauge score={result.clarityScore} />
            </div>
            <div className="flex flex-col gap-2 text-center md:text-left relative">
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
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-l-blue-400 hover:border-l-blue-300 transition-all relative group">
              <button 
                onClick={() => copyToClipboard(result.goal)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                title="Copy Goal"
              >
                <Layers className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-[10px]">
                <Target className="w-3.5 h-3.5" />
                The Core Goal
              </div>
              <p className="text-xl font-medium text-slate-200 leading-relaxed">
                {result.goal}
              </p>
            </div>

            {/* Method Card */}
            <div className="glass rounded-2xl p-6 flex flex-col gap-4 border-l-4 border-l-cyan-400 hover:border-l-cyan-300 transition-all relative group">
              <button 
                onClick={() => copyToClipboard(result.method)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                title="Copy Method"
              >
                <Layers className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-cyan-400 font-semibold uppercase tracking-wider text-[10px]">
                <Layers className="w-3.5 h-3.5" />
                The Approach
              </div>
              <p className="text-lg text-slate-300 leading-relaxed">
                {result.method}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Steps List - Full Width */}
            <div className="glass rounded-2xl p-8 flex flex-col gap-8 relative group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sky-400 font-semibold uppercase tracking-wider text-[10px]">
                  <ListTodo className="w-3.5 h-3.5" />
                  Execution Roadmap
                </div>
                <button 
                  onClick={() => copyToClipboard(result.steps.join('\n'))}
                  className="p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-slate-400 hover:text-white"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
              
              <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-sky-500/50 before:via-blue-500/40 before:to-transparent">
                {result.steps.map((step: string, index: number) => (
                  <div key={index} className="relative flex items-start gap-8 group/step">
                    <div className="absolute mt-1.5 w-10 h-10 -ml-0.5 rounded-full bg-slate-900 border-2 border-sky-500 flex items-center justify-center text-[10px] font-bold text-sky-400 z-10 shadow-[0_0_10px_rgba(56,189,248,0.4)] group-hover/step:scale-110 transition-transform">
                      {index + 1}
                    </div>
                    <div className="pl-14">
                      <p className="text-slate-200 text-base leading-relaxed group-hover/step:text-white transition-colors">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module 5: Missing Elements */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-xs px-2">
              <AlertCircle className="w-4 h-4" />
              Missing Elements Detection
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(result.missingElements).map(([key, value]: [string, any], index: number) => {
                const CategoryIcon = [Target, ListTodo, Briefcase, Calendar][index % 4] || AlertCircle;
                return (
                  <div key={key} className="glass rounded-xl p-4 flex flex-col gap-3 border-t-2 border-t-blue-500/50 hover:border-l-2 hover:border-l-blue-400 transition-all bg-blue-900/10 hover:bg-blue-900/20 group/element shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <CategoryIcon className="w-3.5 h-3.5 text-blue-400/50 group-hover/element:text-blue-400 transition-colors" />
                    </div>
                    <p className="text-sm text-slate-200 leading-snug">
                      {String(value)}
                    </p>
                  </div>
                );
              })}
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
              <div className="glass rounded-2xl p-6 bg-blue-600/10 border-blue-500/30 relative overflow-hidden group">
                <button 
                  onClick={() => copyToClipboard(result.simplifiedVersion)}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 opacity-0 group-hover:opacity-100 hover:bg-white/10 transition-all text-blue-400 hover:text-white"
                >
                  <Layers className="w-4 h-4" />
                </button>
                <div className="absolute top-0 right-10 p-2 bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase rounded-bl-xl">Clearer Copy</div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative group/action">
              <button 
                onClick={() => copyToClipboard(result.actionableSteps.join('\n'))}
                className="absolute -top-10 right-0 p-2 rounded-lg bg-white/5 opacity-0 group-hover/action:opacity-100 hover:bg-white/10 transition-all text-cyan-400 hover:text-white z-20"
                title="Copy Action Plan"
              >
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <Layers className="w-3.5 h-3.5" />
                  COPY ALL
                </div>
              </button>
              {result.actionableSteps.map((task: string, index: number) => {
                const isCompleted = completedSteps.includes(index);
                const StepIcon = [Search, Briefcase, Map, Zap][index % 4] || CheckCircle2;
                
                return (
                  <button 
                    key={index} 
                    onClick={() => {
                      setCompletedSteps(prev => 
                        prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
                      );
                    }}
                    className={`glass rounded-xl p-4 flex items-start gap-4 transition-all duration-500 border-l-2 text-left group/item ${
                      isCompleted 
                        ? 'opacity-50 grayscale border-l-slate-600 bg-slate-900/50' 
                        : 'hover:bg-cyan-500/10 border-l-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10'
                    }`}
                  >
                    <div className={`mt-0.5 flex-none w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500 ${
                      isCompleted 
                        ? 'bg-slate-800 text-slate-500' 
                        : 'bg-cyan-500/20 text-cyan-400 group-hover/item:scale-110 group-hover/item:bg-cyan-500/30'
                    }`}>
                      {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <StepIcon className="w-5 h-5" />}
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className={`text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        isCompleted ? 'text-slate-600' : 'text-cyan-500/60'
                      }`}>
                        Step {index + 1}
                      </span>
                      <p className={`text-sm font-medium transition-all ${
                        isCompleted ? 'text-slate-500 line-through' : 'text-slate-200'
                      }`}>
                        {task}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ultimate Feature 1: Smart Toolkit */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-blue-300 font-semibold uppercase tracking-wider text-[10px] px-2">
              <Wrench className="w-3.5 h-3.5" />
              Strategic Resource Toolkit
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {result.toolkit?.map((tool: any, idx: number) => (
                <div key={idx} className="glass rounded-xl p-5 border border-blue-500/10 hover:border-blue-500/30 transition-all bg-gradient-to-b from-blue-500/5 to-transparent flex flex-col gap-3 group/tool">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white group-hover/tool:text-blue-400 transition-colors uppercase tracking-tight">{tool.name}</span>
                    <Cpu className="w-3.5 h-3.5 text-blue-500/30" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed mb-1">{tool.useCase}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ultimate Feature 2: The Devil's Advocate */}
          <div className="glass rounded-3xl p-8 border-l-8 border-l-red-500/50 bg-gradient-to-r from-red-500/5 to-transparent flex flex-col gap-6 relative overflow-hidden group/risk">
            <div className="absolute top-0 right-0 p-4 opacity-5 translate-x-4 -translate-y-4 group-hover/risk:opacity-10 transition-opacity">
              <ShieldAlert className="w-48 h-48 text-red-500" />
            </div>
            <div className="flex items-center gap-2 text-red-400 font-bold uppercase tracking-widest text-xs">
              <ShieldAlert className="w-4 h-4" />
              The Devil's Advocate (Risk Matrix)
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {result.critique?.map((risk: string, idx: number) => (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-red-300/80 font-bold text-[10px]">
                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    RISK {idx + 1}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed italic border-l border-red-500/20 pl-4">
                    "{risk}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Ultimate Feature 3: Crisis Simulations */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 text-orange-400 font-semibold uppercase tracking-wider text-[10px] px-2">
              <Thermometer className="w-3.5 h-3.5" />
              Contingency Stress Tests
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-8">
              {result.simulations?.map((sim: any, idx: number) => (
                <div key={idx} className="glass rounded-2xl p-6 border-slate-800 hover:border-orange-500/30 transition-all bg-slate-900/40 relative group/sim">
                  <div className="absolute top-0 left-0 w-1 h-full bg-orange-500/30 group-hover/sim:bg-orange-500 transition-colors" />
                  <span className="text-[10px] font-bold text-orange-500/80 uppercase mb-2 block">{sim.scenario}</span>
                  <p className="text-slate-200 font-medium">{sim.adjustment}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Ultimate Feature 4: Reference Center */}
          <div className="flex flex-col gap-8 pb-12 border-t border-slate-900 pt-12">
            <div className="flex flex-col gap-2">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Strategic Reference Center
              </h3>
              <p className="text-sm text-slate-400">Curated resources and research data to support your execution.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category 1: Related Links */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-blue-300 font-bold uppercase tracking-widest text-[10px]">
                  <Globe className="w-3 h-3" />
                  Related Links
                </div>
                <div className="space-y-2">
                  {result.references?.relatedLinks?.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url || link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass rounded-lg p-3 text-xs border-slate-800 hover:border-blue-500/30 transition-all flex flex-col gap-1 group hover:bg-blue-500/5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50 group-hover:bg-blue-500 flex-none" />
                        <span className="font-semibold text-blue-300 group-hover:text-blue-200 transition-colors truncate">{link.name || link}</span>
                      </div>
                      {link.description && <p className="text-slate-500 pl-3.5 text-[10px] leading-relaxed">{link.description}</p>}
                      {link.url && <p className="text-slate-600 pl-3.5 text-[9px] truncate group-hover:text-slate-500">{link.url}</p>}
                    </a>
                  ))}
                </div>
              </div>

              {/* Category 2: Pricing & Costs */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-green-400 font-bold uppercase tracking-widest text-[10px]">
                  <DollarSign className="w-3 h-3" />
                  Pricing & Budgeting
                </div>
                <div className="space-y-2">
                  {result.references?.costsAndBudgets?.map((cost: any, idx: number) => (
                    <a
                      key={idx}
                      href={cost.url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass rounded-lg p-3 text-xs border-slate-800 hover:border-green-500/30 transition-all flex flex-col gap-1 group hover:bg-green-500/5"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 group-hover:bg-green-500 flex-none" />
                        <span className="font-semibold text-green-300 group-hover:text-green-200 transition-colors truncate">{cost.name || cost}</span>
                      </div>
                      {cost.description && <p className="text-slate-500 pl-3.5 text-[10px] leading-relaxed">{cost.description}</p>}
                      {cost.url && <p className="text-slate-600 pl-3.5 text-[9px] truncate group-hover:text-slate-500">{cost.url}</p>}
                    </a>
                  ))}
                </div>
              </div>

              {/* Category 3: Facts & Trends */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2 text-yellow-400 font-bold uppercase tracking-widest text-[10px]">
                  <Lightbulb className="w-3 h-3" />
                  Facts & Trends
                </div>
                <div className="space-y-2">
                  {result.references?.funFacts?.map((item: any, idx: number) => (
                    <div key={idx} className="glass rounded-lg p-3 text-xs text-slate-300 border-slate-800 hover:border-yellow-500/20 transition-colors flex items-start gap-2 group hover:bg-yellow-500/5">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/50 group-hover:bg-yellow-500 flex-none mt-1" />
                      <p className="leading-relaxed">{item.fact || item}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>


      )}

      {/* Copy Success Toast */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] glass rounded-full px-6 py-3 bg-blue-600 border-blue-400 shadow-2xl shadow-blue-500/50 text-white text-sm font-bold flex items-center gap-3 transition-all duration-300 ${showToast ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0 pointer-events-none'}`}>
        <CheckCircle2 className="w-4 h-4" />
        Copied to clipboard!
      </div>
      {/* History Slide-over */}
      {showHistory && (
        <div className="fixed inset-0 z-[100] flex justify-end animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={() => setShowHistory(false)} />
          <div className="relative w-full max-w-sm h-full bg-slate-900 border-l border-white/10 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <History className="w-5 h-5 text-blue-400" />
                Past Sessions
              </h2>
              <button onClick={() => setShowHistory(false)} className="text-slate-400 hover:text-white cursor-pointer px-2 py-1">
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {history.length === 0 ? (
                <div className="text-center text-slate-500 mt-10 text-sm">No past searches found.</div>
              ) : (
                history.map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => {
                      setInput(item.inputidea);
                      setResult(item.result);
                      setShowHistory(false);
                      setTimeout(() => {
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }, 100);
                    }}
                    className="w-full text-left glass rounded-xl p-4 hover:border-blue-500/50 transition-all group flex flex-col gap-2"
                  >
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                      <Clock className="w-3 h-3" />
                      {item.timestamp}
                    </div>
                    <p className="text-sm font-medium text-slate-200 line-clamp-2 group-hover:text-blue-300 transition-colors">
                      "{item.inputidea}"
                    </p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </main>
  );
}
