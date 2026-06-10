import React, { useState } from 'react';
import { Book, HelpCircle, Code, Cpu, FileText, ChevronRight, ExternalLink, Layers, Music } from 'lucide-react';

const DOC_SECTIONS = [
  {
    id: 'quickstart',
    title: 'Guia de Instalação',
    icon: <FileText className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Configuração do Ambiente</h3>
        <p className="text-slate-600">Siga estes 6 passos para rodar o projeto localmente:</p>
        <ul className="list-decimal list-inside space-y-3 text-slate-700">
          <li><strong>Spotify:</strong> Crie um app no <a href="https://developer.spotify.com/dashboard" target="_blank" className="text-rose-600 underline">Spotify Dashboard</a> e obtenha o Client ID/Secret.</li>
          <li><strong>Variáveis:</strong> Renomeie <code>backend/.env.example</code> para <code>.env</code> e insira suas credenciais.</li>
          <li><strong>Backend:</strong> No terminal, pasta <code>/backend</code>, execute <code>pip install -r requirements.txt</code>.</li>
          <li><strong>Execução:</strong> Inicie o backend com <code>python app.py</code> na porta 5000.</li>
          <li><strong>Frontend:</strong> Na pasta <code>/frontend</code>, execute <code>npm install</code>.</li>
          <li><strong>Painel:</strong> Inicie o Vite com <code>npm run dev</code> e acesse a URL indicada.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'architecture',
    title: 'Arquitetura',
    icon: <Layers className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Estrutura do Sistema</h3>
        <p className="text-slate-600">O App Louvor utiliza uma arquitetura moderna e separada:</p>
        <div className="grid gap-4">
          <div>
            <h4 className="font-bold text-slate-800">Frontend (React + Vite)</h4>
            <p className="text-slate-600 mt-1 text-sm">Interface rápida e responsiva utilizando Tailwind CSS para estilização e Lucide para ícones.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Backend (Python + Flask)</h4>
            <p className="text-slate-600 mt-1 text-sm">API RESTful que gerencia o banco de dados SQLite e realiza integrações externas com Spotify e Cifra Club.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Banco de Dados</h4>
            <p className="text-slate-600 mt-1 text-sm">Utiliza SQLite para simplicidade em desenvolvimento, escalável para PostgreSQL em produção.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'api',
    title: 'Referência de API',
    icon: <Code className="w-5 h-5" />,
    content: (
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">Integrações de Busca</h3>
        <div className="space-y-2">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
            <span className="text-emerald-600 font-bold">GET</span> /api/search/spotify?q=musica
            <p className="text-slate-400 mt-1 font-sans">Retorna faixas, artistas e capas de álbum do Spotify.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
            <span className="text-emerald-600 font-bold">GET</span> /api/search/cifra?q=musica
            <p className="text-slate-400 mt-1 font-sans">Gera links diretos para o site Cifra Club.</p>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs">
            <span className="text-blue-600 font-bold">POST</span> /songs
            <p className="text-slate-400 mt-1 font-sans">Cadastra uma nova canção no banco de dados.</p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 'faq',
    title: 'FAQ / Suporte',
    icon: <HelpCircle className="w-5 h-5" />,
    content: (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Dúvidas Comuns</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-800">Como funciona o Cifra Club?</h4>
            <p className="text-slate-600 mt-1 text-sm">O sistema gera uma URL de busca inteligente baseada no título da música e artista, abrindo o resultado oficial em uma nova aba.</p>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">As credenciais do Spotify são seguras?</h4>
            <p className="text-slate-600 mt-1 text-sm">Sim, desde que você as mantenha apenas no arquivo <code>.env</code> e nunca envie esse arquivo para repositórios públicos.</p>
          </div>
        </div>
      </div>
    )
  }
];

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('quickstart');

  return (
    <div className="p-4 md:p-10 space-y-8 min-h-screen bg-[#F8FAFC]">
      <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100">
        <h1 className="text-3xl font-bold text-slate-900">Documentação Centralizada</h1>
        <p className="text-slate-500 mt-2">Tudo o que você precisa saber sobre o App Louvor e suas integrações.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8">
        {/* Menu Lateral */}
        <div className="space-y-3">
          {DOC_SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveTab(section.id)}
              className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all ${
                activeTab === section.id 
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' 
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              <div className="flex items-center gap-4">
                {section.icon}
                <span className="font-bold">{section.title}</span>
              </div>
              <ChevronRight className={`w-4 h-4 ${activeTab === section.id ? 'opacity-100' : 'opacity-30'}`} />
            </button>
          ))}
        </div>

        {/* Área de Conteúdo */}
        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-sm border border-slate-100">
          <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-2 duration-300">
            {DOC_SECTIONS.find(s => s.id === activeTab)?.content}
            <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400 text-sm">
              <span>Documentação v1.0.0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}