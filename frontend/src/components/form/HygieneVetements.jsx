function HygieneVetements({ formData, setFormData, validationErrors, setValidationErrors }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Hygiène</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Type d'hygiène *</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="type_hygiene"
                  value="douche"
                  checked={formData.type_hygiene === 'douche'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, type_hygiene: e.target.value }))
                    if (validationErrors.type_hygiene) setValidationErrors(prev => ({ ...prev, type_hygiene: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Douche</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="type_hygiene"
                  value="toilette_rapide"
                  checked={formData.type_hygiene === 'toilette_rapide'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, type_hygiene: e.target.value }))
                    if (validationErrors.type_hygiene) setValidationErrors(prev => ({ ...prev, type_hygiene: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Toilette rapide</span>
              </label>
            </div>
            {validationErrors.type_hygiene && <p className="text-danger text-sm mt-1">{validationErrors.type_hygiene}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de fois par jour ? *</label>
            <input
              type="number"
              min="0"
              value={formData.hygiene_frequence_jour}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, hygiene_frequence_jour: e.target.value }))
                if (validationErrors.hygiene_frequence_jour) setValidationErrors(prev => ({ ...prev, hygiene_frequence_jour: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.hygiene_frequence_jour && <p className="text-danger text-sm mt-1">{validationErrors.hygiene_frequence_jour}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de fois par semaine ? *</label>
            <input
              type="number"
              min="0"
              value={formData.hygiene_frequence_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, hygiene_frequence_semaine: e.target.value }))
                if (validationErrors.hygiene_frequence_semaine) setValidationErrors(prev => ({ ...prev, hygiene_frequence_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.hygiene_frequence_semaine && <p className="text-danger text-sm mt-1">{validationErrors.hygiene_frequence_semaine}</p>}
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.lave_cheveux}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, lave_cheveux: e.target.checked }))
                if (!e.target.checked) {
                  setFormData(prev => ({ 
                    ...prev, 
                    lave_cheveux_frequence_semaine: '',
                    lave_cheveux_produit: ''
                  }))
                }
              }}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Je me lave les cheveux</span>
          </label>

          {formData.lave_cheveux && (
            <>
              <div className="ml-7">
                <label className="block text-text-secondary mb-2">Combien de fois par semaine ?</label>
                <input
                  type="number"
                  min="0"
                  value={formData.lave_cheveux_frequence_semaine}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lave_cheveux_frequence_semaine: e.target.value }))
                    if (validationErrors.lave_cheveux_frequence_semaine) setValidationErrors(prev => ({ ...prev, lave_cheveux_frequence_semaine: null }))
                  }}
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.lave_cheveux_frequence_semaine && <p className="text-danger text-sm mt-1">{validationErrors.lave_cheveux_frequence_semaine}</p>}
              </div>

              <div className="ml-7">
                <label className="block text-text-secondary mb-2">Produit utilisé</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="lave_cheveux_produit"
                      value="shampoo"
                      checked={formData.lave_cheveux_produit === 'shampoo'}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, lave_cheveux_produit: e.target.value }))
                        if (validationErrors.lave_cheveux_produit) setValidationErrors(prev => ({ ...prev, lave_cheveux_produit: null }))
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">Shampooing</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="lave_cheveux_produit"
                      value="savon"
                      checked={formData.lave_cheveux_produit === 'savon'}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, lave_cheveux_produit: e.target.value }))
                        if (validationErrors.lave_cheveux_produit) setValidationErrors(prev => ({ ...prev, lave_cheveux_produit: null }))
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">Savon</span>
                  </label>
                </div>
                {validationErrors.lave_cheveux_produit && <p className="text-danger text-sm mt-1">{validationErrors.lave_cheveux_produit}</p>}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Vêtements</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Méthode de lessive *</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lessive_methode"
                  value="soi_meme"
                  checked={formData.lessive_methode === 'soi_meme'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lessive_methode: e.target.value }))
                    if (validationErrors.lessive_methode) setValidationErrors(prev => ({ ...prev, lessive_methode: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Je fais la lessive moi-même</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lessive_methode"
                  value="personne"
                  checked={formData.lessive_methode === 'personne'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lessive_methode: e.target.value }))
                    if (validationErrors.lessive_methode) setValidationErrors(prev => ({ ...prev, lessive_methode: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">J'emploie une personne pour le faire</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lessive_methode"
                  value="machine"
                  checked={formData.lessive_methode === 'machine'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lessive_methode: e.target.value }))
                    if (validationErrors.lessive_methode) setValidationErrors(prev => ({ ...prev, lessive_methode: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">J'utilise une machine à laver</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lessive_methode"
                  value="maison"
                  checked={formData.lessive_methode === 'maison'}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, lessive_methode: e.target.value }))
                    if (validationErrors.lessive_methode) setValidationErrors(prev => ({ ...prev, lessive_methode: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Je ne lave pas mes vêtements ici à Cur, je les lave à la maison</span>
              </label>
            </div>
            {validationErrors.lessive_methode && <p className="text-danger text-sm mt-1">{validationErrors.lessive_methode}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de fois par semaine ? *</label>
            <input
              type="number"
              min="0"
              value={formData.lessive_frequence_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, lessive_frequence_semaine: e.target.value }))
                if (validationErrors.lessive_frequence_semaine) setValidationErrors(prev => ({ ...prev, lessive_frequence_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.lessive_frequence_semaine && <p className="text-danger text-sm mt-1">{validationErrors.lessive_frequence_semaine}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Nombre de tenues à laver à chaque lessive</label>
            <input
              type="number"
              min="0"
              value={formData.lessive_nombre_tenues}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, lessive_nombre_tenues: e.target.value }))
                if (validationErrors.lessive_nombre_tenues) setValidationErrors(prev => ({ ...prev, lessive_nombre_tenues: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.lessive_nombre_tenues && <p className="text-danger text-sm mt-1">{validationErrors.lessive_nombre_tenues}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Types de vêtements</label>
            <div className="grid grid-cols-2 gap-2">
              {['jean', 't-shirt', 'robe', 'chemise', 'pantalon', 'short', 'jupe', 'pull', 'veste', 'autre'].map((type) => (
                <label key={type} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.type_vetements?.includes(type) || false}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...(formData.type_vetements || []), type]
                        : (formData.type_vetements || []).filter(t => t !== type)
                      setFormData(prev => ({ ...prev, type_vetements: newTypes }))
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary capitalize">{type}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Qualité des vêtements</label>
            <div className="grid grid-cols-2 gap-2">
              {['coton', 'synthetique', 'laine', 'lin', 'soie', 'denim', 'autre'].map((qualite) => (
                <label key={qualite} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.qualite_vetements?.includes(qualite) || false}
                    onChange={(e) => {
                      const newQualites = e.target.checked
                        ? [...(formData.qualite_vetements || []), qualite]
                        : (formData.qualite_vetements || []).filter(q => q !== qualite)
                      setFormData(prev => ({ ...prev, qualite_vetements: newQualites }))
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary capitalize">{qualite}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de fois par semaine vous repassez le linge ?</label>
            <input
              type="number"
              min="0"
              value={formData.repassage_frequence_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, repassage_frequence_semaine: e.target.value }))
                if (validationErrors.repassage_frequence_semaine) setValidationErrors(prev => ({ ...prev, repassage_frequence_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.repassage_frequence_semaine && <p className="text-danger text-sm mt-1">{validationErrors.repassage_frequence_semaine}</p>}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Soins capillaires</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.brushing_utilise}
              onChange={(e) => setFormData(prev => ({ ...prev, brushing_utilise: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">J'utilise un brushing</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.lisseur_utilise}
              onChange={(e) => setFormData(prev => ({ ...prev, lisseur_utilise: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">J'utilise un lisseur</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default HygieneVetements