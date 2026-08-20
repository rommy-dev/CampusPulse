function LoadingSpinner({ message = 'Chargement...', className = '' }) {
  return (
    <div className={`text-center h-32 flex flex-col items-center justify-center ${className}`}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-text-secondary text-sm">{message}</p>
    </div>
  )
}

export default LoadingSpinner