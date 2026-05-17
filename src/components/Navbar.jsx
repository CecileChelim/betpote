import { Link, useNavigate } from "react-router-dom"
export default function Navbar() {
  const navigate = useNavigate()
  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E4E7F5]">
      <div className="max-w-lg mx-auto px-5 h-14 flex items-center justify-between">
        <Link to="/" className="font-black text-xl tracking-tight text-gray-900">Bet<span className="text-[#3D6EFF]">Pote</span></Link>
        <button onClick={() => navigate("/create")} className="bg-[#3D6EFF] text-white text-sm font-bold px-5 py-2.5 rounded-full hover:bg-[#2A52D4] transition-colors">Créer un pari →</button>
      </div>
    </nav>
  )
}
