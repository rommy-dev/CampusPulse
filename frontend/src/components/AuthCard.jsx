function AuthCard({ title, children, footer }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4 py-8">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-6 md:mb-8">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-primary flex items-center justify-center">
            <div className="w-3.5 h-3.5 md:w-4 md:h-4 border-l-2 border-b-2 border-white rotate-45" />
          </div>
          <span className="text-base md:text-lg font-medium text-text-primary">CampusPulse</span>
        </div>

        <div className="bg-surface rounded-xl border border-text-secondary/10 p-4 md:p-6">
          <h1 className="text-base md:text-lg font-medium text-text-primary mb-4 md:mb-6">{title}</h1>
          {children}
        </div>

        {footer && (
          <p className="text-center text-xs md:text-sm text-text-secondary mt-3 md:mt-4">{footer}</p>
        )}
      </div>
    </div>
  )
}

export default AuthCard