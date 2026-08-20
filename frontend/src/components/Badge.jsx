import { AlertCircle, CheckCircle, X } from 'lucide-react'

function Badge({ type = 'info', message, onDismiss, className = '' }) {
  const baseStyles = 'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ease-out'
  
  const typeStyles = {
    error: 'bg-danger/10 text-danger border border-danger/20',
    success: 'bg-secondary/10 text-secondary border border-secondary/20',
    warning: 'bg-warning/10 text-warning border border-warning/20',
    info: 'bg-primary/10 text-primary border border-primary/20'
  }

  const icons = {
    error: AlertCircle,
    success: CheckCircle,
    warning: AlertCircle,
    info: AlertCircle
  }

  const Icon = icons[type] || icons.info

  return (
    <div className={`${baseStyles} ${typeStyles[type]} ${className}`} role="alert">
      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
      <span className="flex-1">{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="ml-2 opacity-60 hover:opacity-100 transition-opacity btn-press"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
}

export default Badge