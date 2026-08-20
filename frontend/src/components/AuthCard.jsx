function AuthCard({ title, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-8">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <div className="w-4 h-4 border-l-2 border-b-2 border-white rotate-45" />
          </div>
          <span className="text-lg font-medium text-text-primary">CampusPulse</span>
        </div>

        <div className="bg-surface rounded-xl border border-text-secondary/10 p-6">
          <h1 className="text-lg font-medium text-text-primary mb-6">{title}</h1>
          {children}
        </div>

        {footer && (
          <p className="text-center text-sm text-text-secondary mt-4">{footer}</p>
        )}
      </div>
    </div>
  )
}

export default AuthCard