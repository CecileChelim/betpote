import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const GAIN_PRESETS = ['🍽️ Un restau', '🎬 Un ciné', '🍺 Tournée générale', '🍕 Soirée pizza', '🎮 Soirée jeux', '🏖️ Un week-end']

function StepDots({ current }) {
  return (
    <div className="flex gap-2 mb-8">
      {[1, 2, 3].map(n => (
        <div
          key={n}
          className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
            n < current ? 'bg-[#3D6EFF]' : n === current ? 'bg-[#3D6EFF]/40' : 'bg-[#E4E7F5]'
          }`}
        />
      ))}
    </div>
  )
}

export default function CreateBet() {
  const navigate = useNavigate()
  const [step, setStep]       = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  // Form state
  const [title, setTitle]       = useState('')
  const [choices, setChoices]   = useState(['Oui', 'Non'])
  const [gain, setGain]         = useState('')
  const [endDate, setEndDate]   = useState('')
  const [creator, setCreator]   = useState('')

  function addChoice() {
    setChoices(prev => [...prev, ''])
  }

  function updateChoice(i, val) {
    setChoices(prev => prev.map((c, idx) => (idx === i ? val : c)))
  }

  function removeChoice(i) {
    if (choices.length <= 2) return
    setChoices(prev => prev.filter((_, idx) => idx !== i))
  }

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      // Insert bet
      const { data: bet, error: betErr } = await supabase
        .from('bets')
        .insert({ title, creator, gain, end_date: endDate })
        .select()
        .single()

      if (betErr) throw betErr

      // Insert choices
      const choiceRows = choices
        .filter(c => c.trim())
        .map((label, i) => ({ bet_id: bet.id, label: label.trim(), position: i }))

      const { error: choicesErr } = await supabase.from('choices').insert(choiceRows)
      if (choicesErr) throw choicesErr

      navigate(`/success/${bet.id}`, { state: { title, gain } })
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Min date = tomorrow
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-lg mx-auto px-5 pt-8 pb-16 fade-up">
        {/* Back */}
        <button
          onClick={() => step > 1 ? setStep(s => s - 1) : navigate('/')}
          className="flex items-center gap-1.5 text-sm text-[#7A7D95] mb-6 hover:text-gray-900 transition-colors"
        >
          ← Retour
        </button>

        <h1 className="font-black text-[28px] tracking-tight mb-1">Nouveau pari 🎯</h1>
        <p className="text-sm text-[#7A7D95] mb-6">3 étapes simples, 30 secondes chrono</p>

        <StepDots current={step} />

        {/* STEP 1 — Pari + choix */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-2">Le pari</label>
              <textarea
                rows={3}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Ex : Bérénice aura quitté son mec avant Noël ?"
                className="w-full border border-[#E4E7F5] rounded-2xl px-4 py-3 text-[15px] outline-none focus:border-[#3D6EFF] resize-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-2">Les choix</label>
              <div className="space-y-2">
                {choices.map((c, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={c}
                      onChange={e => updateChoice(i, e.target.value)}
                      placeholder={`Choix ${i + 1}`}
                      className="flex-1 border border-[#E4E7F5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3D6EFF] transition-colors"
                    />
                    <button
                      onClick={() => removeChoice(i)}
                      disabled={choices.length <= 2}
                      className="w-9 h-9 rounded-xl border border-[#E4E7F5] flex items-center justify-center text-[#7A7D95] hover:bg-[#F4F6FF] disabled:opacity-30 transition-colors flex-shrink-0"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={addChoice}
                className="mt-2 w-full border border-dashed border-[#E4E7F5] rounded-xl py-3 text-sm text-[#7A7D95] hover:bg-[#F4F6FF] transition-colors flex items-center justify-center gap-1.5"
              >
                + Ajouter un choix
              </button>
            </div>

            <button
              onClick={() => title.trim() && choices.filter(c => c.trim()).length >= 2 && setStep(2)}
              disabled={!title.trim() || choices.filter(c => c.trim()).length < 2}
              className="w-full bg-[#3D6EFF] text-white font-bold text-base rounded-2xl py-4 hover:bg-[#2A52D4] disabled:opacity-40 transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* STEP 2 — Gain */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-3">🏆 Le gain</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {GAIN_PRESETS.map(preset => (
                  <button
                    key={preset}
                    onClick={() => setGain(preset)}
                    className={`border rounded-full px-4 py-2 text-sm font-medium transition-all ${
                      gain === preset
                        ? 'bg-[#3D6EFF] border-[#3D6EFF] text-white'
                        : 'border-[#E4E7F5] text-gray-700 hover:bg-[#F4F6FF]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={gain}
                onChange={e => setGain(e.target.value)}
                placeholder="Ou précise le gain… ex: Kevin cuisine un repas gastronomique 👨‍🍳"
                className="w-full border border-[#E4E7F5] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#3D6EFF] transition-colors"
              />
            </div>

            <button
              onClick={() => gain.trim() && setStep(3)}
              disabled={!gain.trim()}
              className="w-full bg-[#3D6EFF] text-white font-bold text-base rounded-2xl py-4 hover:bg-[#2A52D4] disabled:opacity-40 transition-colors"
            >
              Suivant →
            </button>
          </div>
        )}

        {/* STEP 3 — Date + creator */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-2">📅 Date de fin du pari</label>
              <input
                type="date"
                value={endDate}
                min={minDate}
                onChange={e => setEndDate(e.target.value)}
                className="w-full border border-[#E4E7F5] rounded-2xl px-4 py-3 text-[15px] outline-none focus:border-[#3D6EFF] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-2">👤 Ton pseudo</label>
              <input
                type="text"
                value={creator}
                onChange={e => setCreator(e.target.value)}
                placeholder="Ex : Thomas"
                maxLength={30}
                className="w-full border border-[#E4E7F5] rounded-2xl px-4 py-3 text-[15px] outline-none focus:border-[#3D6EFF] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
                ⚠️ {error}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!endDate || !creator.trim() || loading}
              className="w-full bg-[#00C17C] text-white font-bold text-base rounded-2xl py-4 hover:bg-[#00A868] disabled:opacity-40 transition-colors flex items-center justify-center gap-2"
            >
              {loading ? 'Création…' : '✓ Créer et partager !'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
