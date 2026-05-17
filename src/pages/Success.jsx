import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ShareButtons from '../components/ShareButtons'

export default function Success() {
  const { id }    = useParams()
  const location  = useLocation()
  const navigate  = useNavigate()
  const { title, gain, editToken } = location.state || {}

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-lg mx-auto px-5 pt-10 pb-16 fade-up">
        {/* Icon */}
        <div className="w-20 h-20 bg-[#E6FBF3] rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">
          🎉
        </div>

        <h1 className="font-black text-[28px] tracking-tight text-center mb-2">Pari créé !</h1>
        <p className="text-center text-[15px] text-[#7A7D95] leading-relaxed mb-8">
          Partage le lien à tes potes pour qu'ils votent.
        </p>

        {/* Link preview card */}
        {title && (
          <div className="bg-[#F4F6FF] rounded-2xl p-4 mb-8">
            <div className="text-xs text-[#3D6EFF] font-semibold mb-1">
              betpote.app/bet/{id}
            </div>
            <div className="font-bold text-sm mb-0.5">🎲 {title}</div>
            {gain && <div className="text-xs text-[#7A7D95]">🏆 Gain : {gain}</div>}
          </div>
        )}

        <ShareButtons betId={id} title={title || 'Rejoins le pari !'} />

        {editToken && (
          <div className="mt-6 border border-[#E4E7F5] rounded-2xl p-4">
            <p className="text-xs font-bold uppercase tracking-widest text-[#7A7D95] mb-1">🔑 Ton lien de gestion</p>
            <p className="text-xs text-[#B0B3CB] mb-3">Sauvegarde ce lien pour modifier ou supprimer ton pari.</p>
            <div className="bg-[#F4F6FF] rounded-xl px-3 py-2.5 text-xs text-[#7A7D95] break-all mb-2">
              {`${window.location.origin}/edit/${id}?token=${editToken}`}
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(`${window.location.origin}/edit/${id}?token=${editToken}`)}
              className="w-full border border-[#E4E7F5] text-[#7A7D95] font-semibold text-xs rounded-xl py-2.5 hover:bg-[#F4F6FF] transition-colors"
            >
              🔗 Copier le lien de gestion
            </button>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 border border-[#E4E7F5] text-[#7A7D95] font-semibold text-sm rounded-2xl py-3.5 hover:bg-[#F4F6FF] transition-colors"
        >
          Retour à l'accueil
        </button>
      </div>
    </div>
  )
}
