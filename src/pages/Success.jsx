import { useParams, useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import ShareButtons from '../components/ShareButtons'

export default function Success() {
  const { id }    = useParams()
  const location  = useLocation()
  const navigate  = useNavigate()
  const { title, gain } = location.state || {}

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
