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

  const [selected, setSelected]     = useState(null)
  const [existingVote, setExisting] = useState(null)
  const [voterName, setVoterName]   = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitErr, setSubmitErr]   = useState(null)
  const [revealed, setRevealed]     = useState(false)

  // Gérer ce pari
  const [showManage, setShowManage]     = useState(false)
  const [manageEmail, setManageEmail]   = useState('')
  const [manageLoading, setManageLoading] = useState(false)
  const [manageErr, setManageErr]       = useState(null)
  const [editToken, setEditToken]       = useState(null)
  const [linkCopied, setLinkCopied]     = useState(false)

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

  async function getEditLink() {
    if (!manageEmail.trim()) return
    setManageLoading(true)
    setManageErr(null)
    try {
      const { data } = await supabase
        .from('bets')
        .select('edit_token')
        .eq('id', id)
        .eq('creator_email', manageEmail.trim().toLowerCase())
        .maybeSingle()
      if (!data) {
        setManageErr("Aucun pari créé avec cet email.")
      } else {
        setEditToken(data.edit_token)
      }
    } catch (e) {
      setManageErr(e.message)
    } finally {
      setManageLoading(false)
    }
  }

  function copyEditLink() {
    navigator.clipboard.writeText(`${window.location.origin}/edit/${id}?token=${editToken}`)
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
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

        {/* Gérer ce pari */}
        <div className="px-5 pt-2 pb-6">
          <button
            onClick={() => { setShowManage(s => !s); setManageErr(null) }}
            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-[#B0B3CB] py-3 border-t border-[#F4F6FF] hover:text-[#7A7D95] transition-colors"
          >
            <span>Gérer ce pari</span>
            <span>{showManage ? '↑' : '↓'}</span>
          </button>

          {showManage && (
            <div className="mt-3 space-y-3">
              {!editToken ? (
                <>
                  <p className="text-xs text-[#7A7D95]">
                    Si tu as créé ce pari, entre ton email pour obtenir ton lien de modification.
                  </p>
                  <input
                    type="email"
                    value={manageEmail}
                    onChange={e => setManageEmail(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && getEditLink()}
                    placeholder="ton@email.com"
                    className="w-full border border-[#E4E7F5] rounded-xl px-4 py-3 text-sm outline-none focus:border-[#3D6EFF] transition-colors"
                  />
                  {manageErr && <p className="text-xs text-red-500">{manageErr}</p>}
                  <button
                    onClick={getEditLink}
                    disabled={!manageEmail.trim() || manageLoading}
                    className="w-full border border-[#E4E7F5] text-[#7A7D95] font-semibold text-sm rounded-xl py-3 hover:bg-[#F4F6FF] disabled:opacity-40 transition-colors"
                  >
                    {manageLoading ? 'Vérification…' : '→ Obtenir mon lien de gestion'}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-[#00835A] font-semibold">✅ Email vérifié ! Voici ton lien de gestion :</p>
                  <div className="bg-[#F4F6FF] rounded-xl px-3 py-2.5 text-xs text-[#7A7D95] break-all">
                    {`${window.location.origin}/edit/${id}?token=${editToken}`}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={copyEditLink}
                      className="flex-1 border border-[#E4E7F5] text-[#7A7D95] font-semibold text-sm rounded-xl py-2.5 hover:bg-[#F4F6FF] transition-colors"
                    >
                      {linkCopied ? '✓ Copié !' : '🔗 Copier'}
                    </button>
                    <a
                      href={`mailto:${manageEmail}?subject=Lien de gestion BetPote&body=Voici ton lien pour modifier ou supprimer ton pari :%0A${window.location.origin}/edit/${id}?token=${editToken}`}
                      className="flex-1 border border-[#E4E7F5] text-[#7A7D95] font-semibold text-sm rounded-xl py-2.5 hover:bg-[#F4F6FF] transition-colors text-center"
                    >
                      📧 M'envoyer
                    </a>
                  </div>
                </>
              )}
            </div>
          )}
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
