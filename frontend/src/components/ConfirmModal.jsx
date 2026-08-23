function ConfirmModal({ isOpen, onClose, onConfirm, title, message, loading = false }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full">
        <h3 className="text-lg font-semibold text-text-primary mb-2">{title}</h3>
        <p className="text-text-secondary mb-6">{message}</p>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="btn-press btn-hover px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn-press btn-hover px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading && (
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {loading ? '' : 'Confirmer'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal