
import React from 'react';
import { ToolType } from '../types';

interface DashboardProps {
  onNavigate: (tab: ToolType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const tools = [
    {
      id: ToolType.LIVE,
      title: 'Conversación en Vivo',
      desc: 'Brainstorming por voz en tiempo real.',
      icon: '🎙️',
      color: 'bg-emerald-50 text-emerald-600 border-emerald-100'
    },
    {
      id: ToolType.IMAGE,
      title: 'Editor Mágico',
      desc: 'Edita tus fotos con lenguaje natural.',
      icon: '🎨',
      color: 'bg-blue-50 text-blue-600 border-blue-100'
    },
    {
      id: ToolType.TEXT,
      title: 'Asistente AI',
      desc: 'Resúmenes, código y redacción pro.',
      icon: '✍️',
      color: 'bg-purple-50 text-purple-600 border-purple-100'
    },
    {
      id: ToolType.AUDIO,
      title: 'Sintetizador',
      desc: 'De texto a voz de alta fidelidad.',
      icon: '🔊',
      color: 'bg-amber-50 text-amber-600 border-amber-100'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2rem] p-6 md:p-12 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
        <div className="absolute -top-4 -right-4 p-8 opacity-10 text-[6rem] rotate-12">✨</div>
        <div className="relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3">¡Hola, Creador!</h1>
          <p className="text-indigo-100 text-sm md:text-xl mb-6 leading-relaxed opacity-90">
            Tu estudio de inteligencia artificial está listo para la acción.
          </p>
          <button 
            onClick={() => onNavigate(ToolType.LIVE)}
            className="w-full md:w-auto bg-white text-indigo-600 px-6 py-3.5 rounded-xl font-bold text-base hover:shadow-xl transition-all active:scale-95"
          >
            🎙️ Iniciar Live Talk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-2 gap-3 md:gap-6">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => onNavigate(tool.id)}
            className={`p-4 md:p-6 rounded-[1.5rem] border text-left transition-all active:scale-95 bg-white border-slate-100 shadow-sm`}
          >
            <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${tool.color} flex items-center justify-center text-xl md:text-3xl mb-3 border`}>
              {tool.icon}
            </div>
            <h3 className="text-sm md:text-xl font-bold mb-1 text-slate-800 leading-tight">{tool.title}</h3>
            <p className="text-slate-400 text-[10px] md:text-sm leading-tight line-clamp-2">{tool.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-slate-900 rounded-[1.5rem] p-6 text-white overflow-hidden relative">
        <div className="relative z-10">
          <h4 className="font-bold text-indigo-400 mb-2 flex items-center gap-2 text-sm">
            <span>🚀</span> Tip para Móvil:
          </h4>
          <p className="text-xs text-slate-300">
            Abre el menú de tu navegador y selecciona <b>"Añadir a pantalla de inicio"</b> para usar Gemini Studio como una App real.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

