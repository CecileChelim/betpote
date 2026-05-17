import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
export function useBet(betId) {
  const [bet, setBet] = useState(null)
  const [choices, setChoices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => { if (!betId) return; fetchBet() }, [betId])
  async function fetchBet() {
    setLoading(true)
    try {
      const { data: betData, error: betErr } = await supabase.from("bets").select("*").eq("id", betId).single()
      if (betErr) throw betErr
      const { data: choicesData, error: choicesErr } = await supabase.from("choices").select("*").eq("bet_id", betId).order("position")
      if (choicesErr) throw choicesErr
      const choiceIds = choicesData.map(c => c.id)
      const { data: votesData } = await supabase.from("votes").select("choice_id").in("choice_id", choiceIds)
      const counts = {}
      ;(votesData || []).forEach(v => { counts[v.choice_id] = (counts[v.choice_id] || 0) + 1 })
      const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0)
      const enriched = choicesData.map(c => ({ ...c, votes: counts[c.id] || 0, pct: totalVotes > 0 ? Math.round(((counts[c.id] || 0) / totalVotes) * 100) : 0 }))
      setBet(betData); setChoices(enriched)
    } catch (e) { setError(e.message) }
    finally { setLoading(false) }
  }
  return { bet, choices, loading, error, refetch: fetchBet }
}
