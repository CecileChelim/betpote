import { Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import CreateBet from "./pages/CreateBet"
import BetDetail from "./pages/BetDetail"
import Success from "./pages/Success"
import EditBet from "./pages/EditBet"
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create" element={<CreateBet />} />
      <Route path="/bet/:id" element={<BetDetail />} />
      <Route path="/success/:id" element={<Success />} />
      <Route path="/edit/:id" element={<EditBet />} />
      <Route path="*" element={<Home />} />
    </Routes>
  )
}
