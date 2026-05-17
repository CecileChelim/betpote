import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import PillDivider from '../components/PillDivider'

const TICKER_ITEMS = ['un restau 🍽️', 'un ciné 🎬', 'une tournée 🍺', 'un week-end 🏖️']

const GAINS = [
  { emoji: '🍽️', label: 'Un restau',        desc: 'Le gagnant choisit, les autres paient', wide: false },
  { emoji: '🎬', label: 'Un ciné',           desc: '+ popcorn, évidemment',               wide: false },
  { emoji: '🍺', label: 'Tournée générale',  desc: 'La classe absolue',                   wide: false },
  { emoji: '🏖️', label: 'Un week-end',       desc: 'Pour les paris risqués',              wide: false },
  { emoji: '✏️', label: 'Ou ce que tu veux', desc: 'Champ libre — un gage, un repas cuisiné, un forfait FIFA…', wide: true },
]

const FEATURES = [
  { icon: '👀', color: 'bg-[#EEF2FF]', title: 'Vote secret jusqu\'au bout', desc: 'Les résultats sont masqués tant que tu n\'as pas voté. Zéro influence, 100% honnête.' },
  { icon: '📲', color: 'bg-[#E6FBF3]', title: 'Un lien, c\'est tout',       desc: 'Tes potes n\'ont pas besoin de créer un compte. Un tap sur le lien WhatsApp et c\'est parti.' },
  { icon: '🔔', color: 'bg-[#F3EEFF]', title: 'Résultats automatiques',     desc: 'À la date de fin, tout le monde voit les résultats avec le palmarès complet.' },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* HERO */}
      <section className="max-w-lg mx-auto px-5 pt-12 pb-14 fade-up">
        <h1 className="font-black text-[42px] leading-[1.0] tracking-[-2px] text-gray-900">
          Pariez
          {/* Ticker */}
          <span className="block overflow-hidden" style={{ height: '1em' }}>
            <span
              className="flex flex-col ticker-animate text-[#3D6EFF]"
              style={{ lineHeight: '1em' }}
            >
              {/* duplicate first item at end so the loop is seamless */}
              {[...TICKER_ITEMS, TICKER_ITEMS[0]].map((item, i) => (
                <span key={i} style={{ height: '1em', display: 'flex', alignItems: 'center' }}>
                  {item}
                </span>
              ))}
            </span>
          </span>
          entre potes.
        </h1>

        <p className="mt-5 text-[17px] text-[#7A7D95] leading-relaxed">
          Créez un pari en 30 secondes, partagez sur WhatsApp.<br />
          <strong className="text-gray-900 font-semibold">Le gagnant choisit le restau.</strong>
        </p>

        <div className="flex flex-col gap-3 mt-8">
          <button
            onClick={() => navigate('/create')}
            className="flex items-center justify-center gap-2 bg-[#3D6EFF] text-white font-bold text-base rounded-2xl py-4 hover:bg-[#2A52D4] transition-colors"
          >
            <span className="text-lg">+</span> Créer mon premier pari
          </button>
          <a
            href="#how"
            className="flex items-center justify-center gap-2 border border-[#E4E7F5] text-[#7A7D95] font-semibold text-sm rounded-2xl py-3.5 hover:bg-[#F4F6FF] transition-colors"
          >
            Voir comment ça marche ↓
          </a>
        </div>

        {/* Social proof */}
        <div className="flex items-center gap-3 mt-6">
          <div className="flex">
            {['LC', 'MR', 'TK'].map((initials, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold -ml-2 first:ml-0"
                style={{
                  background: ['#3D6EFF', '#00C17C', '#F5A623'][i],
                  color: ['#C8D5FF', '#C8F5E3', '#FDE8BA'][i],
                }}
              >
                {initials}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-[#F4F6FF] flex items-center justify-center text-[10px] font-bold text-[#7A7D95] -ml-2">
              +8
            </div>
          </div>
          <span className="text-sm text-[#7A7D95] font-medium">
            <strong className="text-gray-900">247 paris</strong> créés cette semaine
          </span>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div id="how">
        <PillDivider label="Comment ça marche" />
      </div>
      <section className="max-w-lg mx-auto px-5 pb-12">
        <h2 className="font-black text-[28px] tracking-tight leading-tight mb-2">Simple comme un texto.</h2>
        <p className="text-[15px] text-[#7A7D95] leading-relaxed mb-8">Trois étapes, zéro prise de tête.</p>

        <div className="divide-y divide-[#E4E7F5]">
          {[
            { n: '01', emoji: '🎯', title: 'Tu poses le pari',           desc: 'Un intitulé, des choix possibles, un enjeu. Bérénice quitte son mec avant Noël ? Le gagnant choisit le restau.' },
            { n: '02', emoji: '📲', title: 'Tu partages sur WhatsApp',   desc: 'Un lien unique est généré. Tes potes votent sans créer de compte. Un tap et c\'est parti.' },
            { n: '03', emoji: '🏆', title: 'Le gagnant est révélé',      desc: 'À la date de fin, tout le monde reçoit les résultats. Le gagnant peut enfin exiger son dû.' },
          ].map(step => (
            <div key={step.n} className="flex gap-5 py-6">
              <div className="w-8 h-8 rounded-[10px] bg-[#EEF2FF] text-[#3D6EFF] font-black text-xs flex items-center justify-center flex-shrink-0 mt-1">
                {step.n}
              </div>
              <div>
                <div className="text-2xl mb-1.5">{step.emoji}</div>
                <div className="font-bold text-[17px] tracking-tight mb-1">{step.title}</div>
                <div className="text-sm text-[#7A7D95] leading-relaxed">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXAMPLE CARD */}
      <PillDivider label="Un exemple" />
      <section className="max-w-lg mx-auto px-5 pb-12">
        <h2 className="font-black text-[28px] tracking-tight leading-tight mb-2">À quoi ça ressemble ?</h2>
        <p className="text-[15px] text-[#7A7D95] leading-relaxed mb-6">Ce que voient tes potes quand tu leur envoies le lien.</p>

        {/* Preview card */}
        <div className="rounded-3xl border border-[#E4E7F5] overflow-hidden shadow-sm">
          <div className="bg-[#3D6EFF] p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#6EFFBC] pulse-dot" />
              <span className="text-xs font-semibold text-white/80">En cours · 41 jours restants</span>
            </div>
            <p className="font-black text-[18px] text-white tracking-tight leading-snug mb-4">
              Bérénice aura quitté son mec avant Noël ?
            </p>
            <div className="flex flex-wrap gap-2">
              {['👥 8 participants', '🍽️ Un restau', 'Par Thomas'].map(chip => (
                <span key={chip} className="bg-white/15 rounded-full px-3 py-1 text-xs font-medium text-white">
                  {chip}
                </span>
              ))}
            </div>
          </div>
          <div className="p-5 space-y-4 bg-white">
            {[
              { label: '✅ Oui, elle le quitte',  pct: 62, hi: true  },
              { label: '❌ Non, ils restent',      pct: 25, hi: false },
              { label: '🤷 Impossible à dire',     pct: 13, hi: false },
            ].map(opt => (
              <div key={opt.label}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-sm">{opt.label}</span>
                  <span className={`text-sm font-bold ${opt.hi ? 'text-[#3D6EFF]' : 'text-[#B0B3CB]'}`}>{opt.pct}%</span>
                </div>
                <div className="h-2 bg-[#F4F6FF] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${opt.pct}%`, background: opt.hi ? '#3D6EFF' : '#B0B3CB' }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5 flex gap-3 bg-white">
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold text-sm rounded-xl py-3.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              Partager
            </button>
            <button className="flex-1 bg-[#3D6EFF] text-white font-bold text-sm rounded-xl py-3.5">
              Voter →
            </button>
          </div>
        </div>
      </section>

      {/* GAINS */}
      <PillDivider label="Les gains possibles" />
      <section className="max-w-lg mx-auto px-5 pb-12">
        <h2 className="font-black text-[28px] tracking-tight leading-tight mb-2">Pas d'argent.<br />Juste du fun.</h2>
        <p className="text-[15px] text-[#7A7D95] leading-relaxed mb-6">Des vrais enjeux entre potes.</p>
        <div className="grid grid-cols-2 gap-3">
          {GAINS.map(g => (
            <div
              key={g.label}
              className={`bg-[#F4F6FF] border border-[#E4E7F5] rounded-2xl p-4 ${g.wide ? 'col-span-2 flex items-center gap-4' : ''}`}
            >
              <div className="text-3xl">{g.emoji}</div>
              <div>
                <div className="font-bold text-sm tracking-tight">{g.label}</div>
                <div className="text-xs text-[#7A7D95] leading-relaxed mt-0.5">{g.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <PillDivider label="Pourquoi BetPote" />
      <section className="max-w-lg mx-auto px-5 pb-12">
        <h2 className="font-black text-[28px] tracking-tight leading-tight mb-2">Pensé pour les potes.</h2>
        <p className="text-[15px] text-[#7A7D95] leading-relaxed mb-6">Pas pour les casinos.</p>
        <div className="flex flex-col gap-3">
          {FEATURES.map(f => (
            <div key={f.title} className="flex gap-4 items-start bg-[#F4F6FF] border border-[#E4E7F5] rounded-2xl p-4">
              <div className={`w-11 h-11 rounded-[13px] ${f.color} flex items-center justify-center text-xl flex-shrink-0`}>
                {f.icon}
              </div>
              <div>
                <div className="font-bold text-[15px] tracking-tight">{f.title}</div>
                <div className="text-sm text-[#7A7D95] leading-relaxed mt-1">{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM CTA */}
      <section className="max-w-lg mx-auto px-5 pb-12">
        <div className="bg-[#3D6EFF] rounded-3xl p-8 text-center">
          <h2 className="font-black text-[26px] text-white tracking-tight leading-tight mb-2">Prêt à avoir raison ?</h2>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            Ton premier pari prend 30 secondes.<br />
            Tes potes ont 0 excuse pour ne pas voter.
          </p>
          <button
            onClick={() => navigate('/create')}
            className="w-full bg-white text-[#3D6EFF] font-bold text-[15px] rounded-xl py-4 hover:bg-blue-50 transition-colors"
          >
            Créer un pari gratuit →
          </button>
        </div>
      </section>

      <footer className="border-t border-[#E4E7F5] text-center py-6 px-5 text-xs text-[#B0B3CB]">
        BetPote · Gratuit · Fait avec 🎲 en France
      </footer>
    </div>
  )
}
