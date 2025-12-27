
import React, { useState, useRef } from 'react';
// Fix: Import 'decode' instead of 'decodeBase64' as it is the correct exported member from geminiService
import { generateSpeech, decode, decodeAudioData } from '../services/geminiService';

const VOICES = [
  { name: 'Kore', label: 'Confident & Smooth' },
  { name: 'Puck', label: 'Energetic & Bright' },
  { name: 'Charon', label: 'Calm & Professional' },
  { name: 'Fenrir', label: 'Deep & Authoritative' },
  { name: 'Zephyr', label: 'Friendly & Welcoming' }
];

const AudioGenerator: React.FC = () => {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('Kore');
  const [loading, setLoading] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);

  const handleGenerate = async () => {
    if (!text) return;
    setLoading(true);
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const base64Audio = await generateSpeech(text, voice);
      // Fix: Use 'decode' to convert base64 audio data to Uint8Array
      const audioBytes = decode(base64Audio);
      const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContextRef.current.destination);
      source.start();
    } catch (err) {
      console.error(err);
      alert("Failed to generate speech.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold mb-1">Speech Synth</h2>
        <p className="text-slate-500 mb-6">High-fidelity text-to-speech with natural intonation.</p>

        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {VOICES.map((v) => (
              <button
                key={v.name}
                onClick={() => setVoice(v.name)}
                className={`p-4 rounded-2xl text-center border transition-all ${
                  voice === v.name 
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 ring-2 ring-indigo-500/20' 
                    : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-slate-200'
                }`}
              >
                <div className="text-xl mb-1">👤</div>
                <p className="text-xs font-bold uppercase tracking-wider">{v.name}</p>
                <p className="text-[10px] opacity-60 leading-tight">{v.label}</p>
              </button>
            ))}
          </div>

          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What would you like me to say?"
              className="w-full p-6 bg-slate-50 border border-slate-200 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:outline-none min-h-[150px] text-lg resize-none"
            />
            <div className="absolute bottom-4 right-4 text-xs text-slate-400 font-medium">
              {text.length} / 1000
            </div>
          </div>

          <button
            disabled={!text || loading}
            onClick={handleGenerate}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2 group"
          >
            {loading ? (
              <div className="flex gap-1">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-.3s]"></div>
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-.5s]"></div>
              </div>
            ) : (
              <>
                <span className="text-xl group-hover:scale-125 transition-transform">🎧</span> 
                Play Audio
              </>
            )}
          </button>
        </div>
      </div>
      
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 text-amber-800 text-sm flex gap-3">
        <span className="text-lg">💡</span>
        <p>Try descriptive prompts! Gemini's TTS understands context. For example: "Say cheerfully: Have a wonderful day!" or "Whisper: Be very quiet."</p>
      </div>
    </div>
  );
};

export default AudioGenerator;
