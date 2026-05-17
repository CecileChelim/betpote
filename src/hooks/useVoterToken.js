import { useState, useEffect } from "react"
import { supabase } from "../lib/supabase"
export function useVoterToken() {
  const [token, setToken] = useState(null)
  useEffect(() => {
    let t = localStorage.getItem("betpote_voter_token")
    if (!t) { t = crypto.randomUUID(); localStorage.setItem("betpote_voter_token", t) }
    setToken(t)
  }, [])
  return token
}
export async function getExistingVote(betId, voterToken) {
  if (!betId || !voterToken) return null
  const { data } = await supabase.from("votes").select("choice_id").eq("bet_id", betId).eq("voter_token", voterToken).maybeSingle()
  return data?.choice_id || null
}
