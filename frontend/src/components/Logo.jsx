function Logo({ className = "", size = "default" }) {
  const sizeClasses = {
    small: "w-8 h-8",
    default: "w-10 h-10",
    large: "w-12 h-12"
  }

  return (
    <img 
      src="/logo.png" 
      alt="CampusPulse Logo" 
      className={`${sizeClasses[size]} ${className}`}
    />
  )
}

export default Logo
