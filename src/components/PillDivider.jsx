export default function PillDivider({ label }) {
  return (
    <div className="flex justify-center py-7">
      <span className="bg-[#F4F6FF] border border-[#E4E7F5] rounded-full px-4 py-1.5 text-xs font-bold text-[#7A7D95] uppercase tracking-widest">{label}</span>
    </div>
  )
}
