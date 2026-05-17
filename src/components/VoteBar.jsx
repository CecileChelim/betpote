export default function VoteBar({ pct, revealed, color = "bg-[#3D6EFF]" }) {
  return (
    <div className="h-2 bg-[#F4F6FF] rounded-full overflow-hidden">
      <div className={`h-full rounded-full vote-bar ${color}`} style={{ width: revealed ? `${pct}%` : "0%" }} />
    </div>
  )
}
