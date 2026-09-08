// ── Chart card wrapper ────────────────────────────────────────────────
export default function ChartCard({ title, icon: Icon, iconColor = 'text-primary', badge, children, className = '' }) {
  return (
    <div className={`bg-surface border border-text-secondary/10 rounded-2xl p-5 shadow-sm ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          {Icon && <Icon className={`w-4 h-4 ${iconColor}`} />}
          <span>{title}</span>
        </h3>
        {badge && (
          <span className="text-[10px] font-mono text-text-secondary bg-bg px-2 py-0.5 rounded-full border border-text-secondary/10 whitespace-nowrap">
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}
