
import React, { useState, useEffect, useRef } from 'react';
import { Modality, LiveServerMessage } from '@google/genai';
// Fix: Removed TranscriptionEntry from geminiService import and added proper import from types
import { getGeminiClient, createPcmBlob, decodeAudioData, decode } from '../services/geminiService';
import { TranscriptionEntry } from '../types';

const LiveTalk: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [history, setHistory] = useState<TranscriptionEntry[]>([]);
  const [status, setStatus] = useState<'idle' | 'connecting' | 'listening' | 'speaking'>('idle');
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sessionRef = useRef<any>(null);
  const nextStartTimeRef = useRef<number>(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);

  const currentInputTranscription = useRef('');
  const currentOutputTranscription = useRef('');

  const stopSession = () => {
    if (sessionRef.current) {
      sessionRef.current.close();
      sessionRef.current = null;
    }
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    sourcesRef.current.forEach(s => s.stop());
    sourcesRef.current.clear();
    setIsActive(false);
    setStatus('idle');
  };

  const startSession = async () => {
    try {
      setStatus('connecting');
      // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key
      const ai = getGeminiClient();
      
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setIsActive(true);
            setStatus('listening');
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createPcmBlob(inputData);
              // CRITICAL: Solely rely on sessionPromise resolves and then call `session.sendRealtimeInput`
              sessionPromise.then(session => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Transcriptions
            // Correcting property names: message.serverContent.inputTranscription (not inputAudioTranscription)
            if (message.serverContent?.inputTranscription) {
              currentInputTranscription.current += message.serverContent.inputTranscription.text;
            }
            if (message.serverContent?.outputTranscription) {
              currentOutputTranscription.current += message.serverContent.outputTranscription.text;
            }
            
            if (message.serverContent?.turnComplete) {
              const userText = currentInputTranscription.current;
              const modelText = currentOutputTranscription.current;
              if (userText || modelText) {
                // Fix: Explicitly use 'as const' to ensure roles are typed correctly as literal 'user' | 'model'
                setHistory(prev => [
                  ...prev, 
                  { role: 'user' as const, text: userText, timestamp: Date.now() },
                  { role: 'model' as const, text: modelText, timestamp: Date.now() + 1 }
                ].slice(-10));
              }
              currentInputTranscription.current = '';
              currentOutputTranscription.current = '';
              setStatus('listening');
            }

            // Handle Audio Output
            const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64Audio) {
              setStatus('speaking');
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              const audioBuffer = await decodeAudioData(decode(base64Audio), outputCtx, 24000, 1);
              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputCtx.destination);
              source.addEventListener('ended', () => sourcesRef.current.delete(source));
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }
          },
          onclose: () => stopSession(),
          onerror: (e) => {
            console.error("Live Error:", e);
            stopSession();
          }
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: 'Eres un asistente creativo amigable. Responde de forma concisa y natural. Te llamas Gemini Creative Assistant.'
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error(err);
      setStatus('idle');
      alert("Microphone access denied or connection failed.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 min-h-[500px] flex flex-col">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Live Conversational AI</h2>
          <p className="text-slate-500">Talk to Gemini naturally. No typing, just voice.</p>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center relative">
          {/* Audio Visualizer Orb */}
          <div className={`relative w-48 h-48 rounded-full flex items-center justify-center transition-all duration-500 ${
            isActive ? 'scale-110' : 'scale-100'
          }`}>
            <div className={`absolute inset-0 rounded-full transition-all duration-700 blur-2xl ${
              status === 'speaking' ? 'bg-indigo-400 opacity-60 animate-pulse' :
              status === 'listening' ? 'bg-emerald-400 opacity-40 animate-ping' :
              status === 'connecting' ? 'bg-amber-400 opacity-40 animate-spin' :
              'bg-slate-200 opacity-20'
            }`}></div>
            
            <button
              onClick={isActive ? stopSession : startSession}
              className={`relative z-10 w-32 h-32 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-105 active:scale-95 ${
                isActive ? 'bg-red-500' : 'bg-indigo-600'
              }`}
            >
              {status === 'connecting' ? (
                <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isActive ? (
                <span className="text-4xl">⏹️</span>
              ) : (
                <span className="text-4xl">🎙️</span>
              )}
            </button>
          </div>

          <div className="mt-8 text-center">
            <span className={`px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase transition-all ${
              status === 'speaking' ? 'bg-indigo-100 text-indigo-700' :
              status === 'listening' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
              status === 'connecting' ? 'bg-amber-100 text-amber-700' :
              'bg-slate-100 text-slate-400'
            }`}>
              {status === 'idle' ? 'Ready to Start' : status}
            </span>
          </div>
        </div>

        <div className="mt-8 bg-slate-50 rounded-2xl p-6 max-h-[200px] overflow-y-auto">
          {history.length === 0 ? (
            <p className="text-slate-400 text-center italic">Transcription history will appear here...</p>
          ) : (
            <div className="space-y-3">
              {history.map((entry, idx) => (
                <div key={idx} className={`flex gap-3 ${entry.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    entry.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-none' 
                      : 'bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm'
                  }`}>
                    {entry.text || '...'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveTalk;
