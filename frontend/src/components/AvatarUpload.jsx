import { useRef, useState } from 'react'
import { User } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

function AvatarUpload({ userId, avatarUrl, onUploaded }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Le fichier doit être une image')
      return
    }

    if (file.size > 3 * 1024 * 1024) {
      setError('Image trop lourde (max 3 Mo)')
      return
    }

    setError(null)
    setUploading(true)

    const path = `${userId}/avatar`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true, contentType: file.type })

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(path)

    // Le paramètre "t" force le navigateur a recharger l'image
    // (meme chemin de fichier qu'avant, sinon le cache le bloquerait)
    const freshUrl = `${publicUrlData.publicUrl}?t=${Date.now()}`

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ avatar_url: freshUrl })
      .eq('id', userId)

    setUploading(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    onUploaded(freshUrl)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="w-24 md:w-32 h-24 md:h-32 rounded-full bg-bg border border-text-secondary/20 flex items-center justify-center overflow-hidden">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Photo de profil" className="w-full h-full object-cover" />
        ) : (
          <User className="w-10 h-10 text-text-secondary" />
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-sm text-primary disabled:opacity-60"
      >
        {uploading ? 'Envoi...' : 'Changer la photo'}
      </button>

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
}

export default AvatarUpload
