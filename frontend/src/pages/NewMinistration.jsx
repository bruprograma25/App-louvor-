import React, { useState, useEffect } from 'react';
import { Calendar, User, Info, Link as LinkIcon, Save, Music } from 'lucide-react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function NewMinistration() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    minister: '',
    date: '',
    time: '',
    cult_type: 'Culto Domingo Manhã',
    status: 'Rascunho',
    title: '',
    playlist_url: '',
    whatsapp_url: '',
    notes: ''
  });

  // Gera o título automaticamente quando o ministro ou a data mudam
  useEffect(() => {
    if (formData.minister || formData.date) {
      const dateObj = formData.date ? new Date(formData.date).toLocaleDateString('pt-BR') : '--/--';
      setFormData(prev => ({
        ...prev,
        title: `Ministração de ${formData.minister || '...'} - ${dateObj}`
      }));
    }
  }, [formData.minister, formData.date]);

  async function handleSave() {
    if (!formData.minister || !formData.date) {
      alert("Por favor, preencha o ministro e a data.");
      return;
    }
    try {
      await api.post('/ministrations', formData);
      alert("Ministração salva com sucesso!");
      navigate('/ministrations');
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar ministração.");
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Nova Ministração</h1>
        <button 
          onClick={handleSave}
          className="flex items-center gap-2 bg-rose-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-rose-700 transition-all shadow-lg shadow-rose-200"
        >
          <Save size={20} /> Salvar Ministração
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm">
        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-700 font-semibold flex items-center gap-2"><User size={18}/> Ministro do dia</span>
            <select 
              className="mt-1 w-full rounded-xl border-slate-200 bg-slate-50 focus:ring-rose-500"
              value={formData.minister}
              onChange={e => setFormData({...formData, minister: e.target.value})}
            >
              <option value="">Selecione o Ministro...</option>
              <option value="João">João</option>
              <option value="Maria">Maria</option>
            </select>
          </label>

          <label className="block">
            <span className="text-slate-700 font-semibold">Título</span>
            <input type="text" className="mt-1 w-full rounded-xl border-slate-200 bg-slate-100 italic" value={formData.title} readOnly />
          </label>

          <div className="grid grid-cols-2 gap-4">
            <label className="block">
              <span className="text-slate-700 font-semibold">Data</span>
              <input type="date" className="mt-1 w-full rounded-xl border-slate-200 bg-slate-50" onChange={e => setFormData({...formData, date: e.target.value})} />
            </label>
            <label className="block">
              <span className="text-slate-700 font-semibold">Hora</span>
              <input type="time" className="mt-1 w-full rounded-xl border-slate-200 bg-slate-50" onChange={e => setFormData({...formData, time: e.target.value})} />
            </label>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-slate-700 font-semibold">Tipo de Culto</span>
            <select className="mt-1 w-full rounded-xl border-slate-200 bg-slate-50" value={formData.cult_type} onChange={e => setFormData({...formData, cult_type: e.target.value})}>
              <option>Culto Domingo Manhã</option>
              <option>Culto Domingo Noite</option>
              <option>Culto de Jovens</option>
            </select>
          </label>

          <label className="block">
            <span className="text-slate-700 font-semibold">Status</span>
            <select className="mt-1 w-full rounded-xl border-slate-200 bg-slate-50" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
              <option>Rascunho</option>
              <option>Confirmado</option>
            </select>
          </label>

          <label className="block">
            <span className="text-slate-700 font-semibold flex items-center gap-2"><LinkIcon size={18}/> Links (Spotify/YouTube/Whats)</span>
            <input type="url" placeholder="Link da Playlist" className="mt-1 w-full rounded-xl border-slate-200 bg-slate-50 mb-2" onChange={e => setFormData({...formData, playlist_url: e.target.value})} />
            <input type="url" placeholder="Link do WhatsApp" className="w-full rounded-xl border-slate-200 bg-slate-50" onChange={e => setFormData({...formData, whatsapp_url: e.target.value})} />
          </label>
        </div>
      </div>

      <div className="bg-rose-50 border-2 border-dashed border-rose-200 rounded-[32px] p-12 text-center">
        <Music className="mx-auto text-rose-300 mb-4" size={48} />
        <h3 className="text-xl font-bold text-rose-800">Pré-Playlist</h3>
        <p className="text-rose-600 mb-4">Para adicionar canções, salve a ministração primeiro.</p>
        <button className="opacity-50 cursor-not-allowed bg-rose-200 text-rose-500 px-6 py-2 rounded-xl font-bold">
          + Adicionar Música
        </button>
      </div>
    </div>
  );
}