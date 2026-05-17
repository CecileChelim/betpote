import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

const GAIN_PRESETS = ['🍽️ Un restau', '🎬 Un ciné', '🍺 Tournée générale', '🍕 Soirée pizza', '🎮 Soirée jeux', '🏖️ Un week-end']

export default function EditBet() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token')
  const navigate = useNavigate()

  const [bet, setBet]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)
  const [gain, setGain]       = useState('')
  const [endDate, setEndDate] = useState('')
  const [saving, setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  useEffect(() => {
    if (!id || !token) { setError("Lien invalide."); setLoading(false); return }
    fetchBet()
  }, [id, token])

  async function fetchBet() {
    try {
      const { data, error: err } = await supabase
        .from('bets')
        .select('id, title, creator, gain, end_date')
        .eq('id', id)
        .eq('edit_token', token)
        .maybeSingle()
      if (err) throw err
      if (!data) { setError("Lien invalide ou expiré."); return }
      setBet(data)
      setGain(data.gain)
      setEndDate(data.end_date)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function handleSave() {
    setSaving(true)
    setError(null)
    try {
      const { error: err } = await supabase
        .from('bets')
        .update({ gain, end_date: endDate })
        .eq('id', id)
        .eq('edit_token', token)
      if (err) throw err
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (e) {
      setError(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Supprimer définitivement ce pari ? Cette action est irréversible.')) return
    setDeleting(true)
    try {
      const { error: err } = await supabase
        .from('bets')
        .delete()
        .eq('id', id)
        .eq('edit_token', token)
      if (err) throw err
      navigate('/')
    } catch (e) {
      setError(e.message)
      setDeleting(false)
    }
  }

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-4xl animate-bounce">🎲</div>
      </div>
    )
  }

  if (error || !bet) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="max-w-lg mx-auto px-5 pt-16 text-center fade-up">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="font-black text-xl mb-2">Accès refusé</h2>
          <p className="text-[#7A7D95] text-sm mb-6">{error || "Ce lien est invalide ou a expiré."}</p>
          <button onClick={() => navigate('/')} className="bg-[#3D6EFF] text-white font-bold px-6 py-3 rounded-2xl">
            Retour à l'accueil
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-lg mx-auto px-5 pt-8 pb-16 fade-up">
        <button
          onClick={() => navigate(`/bet/${id}`)}
          className="flex items-center gap-1.5 text-sm text-[#7A7D95] mb-6 hover:text-gray-900 transition-colors"
        >
          ← Retour au pari
        </button>

        <h1 className="font-black text-[28px] tracking-tight mb-1">Modifier le pari ✏️</h1>
        <p className="text-sm text-[#7A7D95] mb-8">Tu peux changer le gain et la date de fin.</p>

        {/* Bet title (read-only) */}
        <div className="bg-[#F4F6FF] rounded-2xl p-4 mb-6">
          <div className="text-xs text-[#7A7D95] mb-1">Le pari</div>
          <div className="font-bold text-sm">{bet.title}</div>
        </div>

        {/* Gain */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-3">🏆 Le gain</label>
          <div className="flex flex-wrap gap-2 mb-3">
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
            placeholder="Ou précise le gain…"
            className="w-full border border-[#E4E7F5] rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#3D6EFF] transition-colors"
          />
        </div>

        {/* End date */}
        <div className="mb-8">
          <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-2">📅 Date de fin</label>
          <input
            type="date"
            value={endDate}
            min={minDate}
            onChange={e => setEndDate(e.target.value)}
            className="w-full border border-[#E4E7F5] rounded-2xl px-4 py-3 text-[15px] outline-none focus:border-[#3D6EFF] transition-colors"
          />
        </div>

        {saveSuccess && (
          <div className="mb-4 bg-[#E6FBF3] border border-[#00C17C]/20 rounded-2xl p-4 text-sm text-[#00835A] font-medium text-center">
            ✅ Pari mis à jour !
          </div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl p-4 text-sm text-red-600">
            ⚠️ {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!gain.trim() || !endDate || saving}
          className="w-full bg-[#3D6EFF] text-white font-bold text-base rounded-2xl py-4 hover:bg-[#2A52D4] disabled:opacity-40 transition-colors"
        >
          {saving ? 'Enregistrement…' : '✓ Enregistrer les modifications'}
        </button>

        {/* Danger zone */}
        <div className="mt-10 border-t border-[#F4F6FF] pt-6">
          <p className="text-xs font-bold uppercase tracking-widest text-red-400 mb-3">Zone dangereuse</p>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="w-full border border-red-200 text-red-500 font-semibold text-sm rounded-2xl py-3.5 hover:bg-red-50 disabled:opacity-40 transition-colors"
          >
            {deleting ? 'Suppression…' : '🗑️ Supprimer ce pari définitivement'}
          </button>
        </div>
      </div>
    </div>
  )
}
