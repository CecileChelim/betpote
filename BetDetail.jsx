import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { formatDistanceToNow, isPast, parseISO } from 'date-fns'
import { fr } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useBet } from '../hooks/useBet'
import { useVoterToken, getExistingVote } from '../hooks/useVoterToken'
import Navbar from '../components/Navbar'
import VoteBar from '../components/VoteBar'
import ShareButtons from '../components/ShareButtons'

export default function BetDetail() {
  const { id }     = useParams()
  const navigate   = useNavigate()
  const token      = useVoterToken()
  const { bet, choices, loading, error } = useBet(id)

  const [selected, setSelected]     = useState(null)   // choiceId user clicked
  const [existingVote, setExisting] = useState(null)   // choiceId from DB
  const [voterName, setVoterName]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr]   = useState(null)
  const [revealed, setRevealed]     = useState(false)

  // Check if this token already voted
  useEffect(() => {
    if (!token || !id) return
    getExistingVote(id, token).then(choiceId => {
      if (choiceId) {
        setExisting(choiceId)
        setRevealed(true)
      }
    })
  }, [token, id])

  if (loading) return <LoadingScreen />
  if (error || !bet) return <ErrorScreen onBack={() => navigate('/')} />

  const isExpired = isPast(parseISO(bet.end_date))
  const hasVoted  = !!existingVote
  const totalVotes = choices.reduce((a, c) => a + c.votes, 0)

  async function submitVote() {
    if (!selected || !voterName.trim() || !token) return
    setSubmitting(true)
    setSubmitErr(null)
    try {
      const { error: vErr } = await supabase.from('votes').insert({
        bet_id: id,
        choice_id: selected,
        voter_name: voterName.trim(),
        voter_token: token,
      })
      if (vErr) throw vErr
      setExisting(selected)
      setRevealed(true)
    } catch (e) {
      setSubmitErr(e.code === '23505' ? 'Tu as déjà voté sur ce pari !' : e.message)
    } finally {
      setSubmitting(false)
    }
  }

  const timeLeft = isExpired
    ? 'Terminé'
    : `${formatDistanceToNow(parseISO(bet.end_date), { locale: fr, addSuffix: false })} restants`

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-lg mx-auto pb-16 fade-up">
        {/* Header */}
        <div className="bg-[#3D6EFF] px-5 pt-6 pb-6">
          <button onClick={() => navigate(-1)} className="text-white/70 text-sm mb-4 flex items-center gap-1 hover:text-white transition-colors">
            ← Retour
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-orange-300' : 'bg-[#6EFFBC] pulse-dot'}`} />
            <span className="text-xs font-semibold text-white/80">
              {isExpired ? 'Pari terminé' : `En cours · ${timeLeft}`}
            </span>
          </div>

          <h1 className="font-black text-[20px] text-white tracking-tight leading-snug mb-4">
            {bet.title}
          </h1>

          <div className="flex flex-wrap gap-2">
            {[`👥 ${totalVotes} vote${totalVotes !== 1 ? 's' : ''}`, `🏆 ${bet.gain}`, `Par ${bet.creator}`].map(chip => (
              <span key={chip} className="bg-white/15 rounded-full px-3 py-1 text-xs font-medium text-white">
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Votes */}
        <div className="px-5 pt-6 pb-4">
          <h2 className="font-bold text-[15px] mb-1">
            Les votes
            {!revealed && !isExpired && (
              <span className="text-[#7A7D95] font-normal text-sm"> — vote pour voir la répartition 👀</span>
            )}
          </h2>

          <div className="space-y-3 mt-4">
            {choices.map(choice => {
              const isMyVote = existingVote === choice.id
              const isPicked = selected === choice.id

              return (
                <button
                  key={choice.id}
                  onClick={() => !hasVoted && !isExpired && setSelected(isPicked ? null : choice.id)}
                  disabled={hasVoted || isExpired}
                  className={`w-full text-left border rounded-2xl p-4 transition-all ${
                    isPicked || isMyVote
                      ? 'border-[#3D6EFF] bg-[#EEF2FF]'
                      : 'border-[#E4E7F5] bg-white hover:bg-[#F4F6FF]'
                  } disabled:cursor-default`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm flex items-center gap-2">
                      {choice.label}
                      {isMyVote && <span className="text-xs bg-[#3D6EFF] text-white px-2 py-0.5 rounded-full">Mon vote</span>}
                    </span>
                    <span className={`text-sm font-bold ${revealed ? (isMyVote ? 'text-[#3D6EFF]' : 'text-[#B0B3CB]') : 'text-[#E4E7F5]'}`}>
                      {revealed ? `${choice.pct}%` : '?'}
                    </span>
                  </div>
                  <VoteBar pct={choice.pct} revealed={revealed} color={isMyVote ? 'bg-[#3D6EFF]' : 'bg-[#B0B3CB]'} />
                </button>
              )
            })}
          </div>
        </div>

        {/* Vote form */}
        {!hasVoted && !isExpired && (
          <div className="px-5 pb-6">
            {selected && (
              <div className="mb-3">
                <label className="block text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-2">
                  Ton prénom pour voter
                </label>
                <input
                  type="text"
                  value={voterName}
                  onChange={e => setVoterName(e.target.value)}
                  placeholder="Ex : Marie"
                  maxLength={30}
                  className="w-full border border-[#E4E7F5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3D6EFF] transition-colors"
                />
              </div>
            )}

            {submitErr && (
              <div className="mb-3 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600">
                ⚠️ {submitErr}
              </div>
            )}

            <button
              onClick={submitVote}
              disabled={!selected || !voterName.trim() || submitting}
              className="w-full bg-[#3D6EFF] text-white font-bold text-base rounded-2xl py-4 hover:bg-[#2A52D4] disabled:opacity-40 transition-colors"
            >
              {submitting ? 'Enregistrement…' : selected ? '✓ Valider mon vote' : 'Sélectionne un choix ↑'}
            </button>
          </div>
        )}

        {hasVoted && (
          <div className="px-5 pb-2">
            <div className="bg-[#E6FBF3] border border-[#00C17C]/20 rounded-2xl p-4 text-sm text-[#00835A] font-medium text-center">
              ✅ Vote enregistré ! Tu seras notifié du résultat le {new Date(bet.end_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}.
            </div>
          </div>
        )}

        {/* Share */}
        <div className="px-5 pt-4 pb-2">
          <p className="text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-3">Partager ce pari</p>
          <ShareButtons betId={id} title={bet.title} />
        </div>
      </div>
    </div>
  )
}

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">🎲</div>
        <p className="text-[#7A7D95] text-sm">Chargement du pari…</p>
      </div>
    </div>
  )
}

function ErrorScreen({ onBack }) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-5">
      <div className="text-center">
        <div className="text-4xl mb-4">😕</div>
        <h2 className="font-black text-xl mb-2">Pari introuvable</h2>
        <p className="text-[#7A7D95] text-sm mb-6">Ce lien est invalide ou a expiré.</p>
        <button onClick={onBack} className="bg-[#3D6EFF] text-white font-bold px-6 py-3 rounded-2xl">
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
