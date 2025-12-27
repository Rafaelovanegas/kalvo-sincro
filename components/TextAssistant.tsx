
import React, { useState } from 'react';
import { analyzeText } from '../services/geminiService';

const TextAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isPro, setIsPro] = useState(false);

  const handleAnalyze = async () => {
    if (!input) return;
    setLoading(true);
    try {
      const result = await analyzeText(input, isPro);
      setOutput(result || '');
    } catch (err) {
      console.error(err);
      alert("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-1">AI Assistant</h2>
            <p className="text-slate-500">Analyze content, summarize, or write creatively.</p>
          </div>
          <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
            <button 
              onClick={() => setIsPro(false)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${!isPro ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}
            >
              FLASH
            </button>
            <button 
              onClick={() => setIsPro(true)}
              className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${isPro ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'}`}
            >
              PRO
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col gap-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your text here or ask a question..."
              className="w-full flex-1 min-h-[300px] p-6 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
            />
            <button
              disabled={!input || loading}
              onClick={handleAnalyze}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Thinking...' : 'Process Content'}
            </button>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 text-slate-100 overflow-y-auto max-h-[420px] relative">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="space-y-2 text-center">
                  <div className="flex justify-center gap-1">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                  <p className="text-xs text-slate-400">GEMINI IS ANALYZING</p>
                </div>
              </div>
            ) : output ? (
              <div className="prose prose-invert prose-sm max-w-none">
                {output.split('\n').map((line, i) => (
                  <p key={i} className="mb-2">{line}</p>
                ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 italic">
                Result will be displayed here...
              </div>
            )}
            
            {output && !loading && (
              <button 
                onClick={() => navigator.clipboard.writeText(output)}
                className="absolute top-4 right-4 bg-slate-800 hover:bg-slate-700 p-2 rounded-lg text-slate-300 transition-colors"
                title="Copy to clipboard"
              >
                📋
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextAssistant;
