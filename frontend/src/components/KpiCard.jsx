export default function KpiCard({ icon: Icon, color, bg, label, value, unit, sub }) {
  return (
    <div className="bg-surface border border-text-secondary/10 rounded-2xl p-4 md:p-5 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
      <div className={`absolute top-0 right-0 p-3 opacity-[0.07] group-hover:opacity-[0.12] transition-opacity`}>
        <Icon className="w-16 h-16" />
      </div>
      <div className={`flex items-center gap-2 text-[11px] font-semibold ${color} uppercase tracking-wider mb-2`}>
        <div className={`p-1.5 rounded-lg ${bg}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
        {label}
      </div>
      <div className="text-2xl md:text-3xl font-black text-text-primary mb-0.5">
        {typeof value === 'number' ? value.toLocaleString() : value}
        <span className="text-sm font-semibold text-text-secondary ml-1">{unit}</span>
      </div>
      <p className="text-[11px] text-text-secondary">{sub}</p>
    </div>
  )
}
