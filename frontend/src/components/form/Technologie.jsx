function Technologie({ formData, setFormData, validationErrors, setValidationErrors }) {
  const pcUsageOptions = [
    { value: 'etudes', label: 'Études' },
    { value: 'loisir_jeux', label: 'Loisir / Jeux' },
    { value: 'travail', label: 'Travail' },
    { value: 'reseaux_sociaux', label: 'Réseaux sociaux' },
    { value: 'autre', label: 'Autre' }
  ]

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Téléphone</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Marque de votre téléphone</label>
            <input
              type="text"
              value={formData.telephone_marque}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, telephone_marque: e.target.value }))
                if (validationErrors.telephone_marque) setValidationErrors(prev => ({ ...prev, telephone_marque: null }))
              }}
              placeholder="Ex: Samsung A14"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.telephone_marque && <p className="text-danger text-sm mt-1">{validationErrors.telephone_marque}</p>}
          </div>
          <div>
            <label className="block text-text-secondary mb-2">Nombre de recharges par jour</label>
            <input
              type="number"
              min="0"
              value={formData.recharge_telephone_jour}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, recharge_telephone_jour: e.target.value }))
                if (validationErrors.recharge_telephone_jour) setValidationErrors(prev => ({ ...prev, recharge_telephone_jour: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.recharge_telephone_jour && <p className="text-danger text-sm mt-1">{validationErrors.recharge_telephone_jour}</p>}
          </div>
          <div>
            <label className="block text-text-secondary mb-2">Nombre d'heures d'écran par jour</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.ecrans_tel_heures_jour}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, ecrans_tel_heures_jour: e.target.value }))
                if (validationErrors.ecrans_tel_heures_jour) setValidationErrors(prev => ({ ...prev, ecrans_tel_heures_jour: null }))
              }}
              placeholder="Ex: 4.5"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.ecrans_tel_heures_jour && <p className="text-danger text-sm mt-1">{validationErrors.ecrans_tel_heures_jour}</p>}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Ordinateur</h2>
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.pc_possede}
            onChange={(e) => setFormData(prev => ({ ...prev, pc_possede: e.target.checked }))}
            className="w-4 h-4 text-primary"
          />
          <span className="text-text-primary">Je possède un PC</span>
        </label>
        {formData.pc_possede && (
          <div className="ml-7 space-y-4">
            <div>
              <label className="block text-text-secondary mb-2">Nombre de PC</label>
              <input
                type="number"
                min="0"
                value={formData.pc_nombre}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, pc_nombre: e.target.value }))
                  if (validationErrors.pc_nombre) setValidationErrors(prev => ({ ...prev, pc_nombre: null }))
                }}
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.pc_nombre && <p className="text-danger text-sm mt-1">{validationErrors.pc_nombre}</p>}
            </div>
            <div>
              <label className="block text-text-secondary mb-2">Usage (choisissez toutes les options)</label>
              <div className="space-y-2">
                {pcUsageOptions.map(option => (
                  <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.pc_usage.includes(option.value)}
                      onChange={() => handleCheckboxChange('pc_usage', option.value)}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">{option.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.pc_usage && <p className="text-danger text-sm mt-2">{validationErrors.pc_usage}</p>}
              {formData.pc_usage.includes('autre') && (
                <div className="mt-4">
                  <input
                    type="text"
                    placeholder="Précisez l'usage"
                    value={formData.autre_pc_usage}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, autre_pc_usage: e.target.value }))
                      if (validationErrors.autre_pc_usage) setValidationErrors(prev => ({ ...prev, autre_pc_usage: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.autre_pc_usage && <p className="text-danger text-sm mt-1">{validationErrors.autre_pc_usage}</p>}
                </div>
              )}
            </div>
            <div>
              <label className="block text-text-secondary mb-2">Fréquence de recharge par jour</label>
              <input
                type="number"
                min="0"
                value={formData.recharge_pc_frequence}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, recharge_pc_frequence: e.target.value }))
                  if (validationErrors.recharge_pc_frequence) setValidationErrors(prev => ({ ...prev, recharge_pc_frequence: null }))
                }}
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.recharge_pc_frequence && <p className="text-danger text-sm mt-1">{validationErrors.recharge_pc_frequence}</p>}
            </div>
            <div>
              <label className="block text-text-secondary mb-2">Nombre d'heures d'écran par jour</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={formData.ecrans_pc_heures_jour}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, ecrans_pc_heures_jour: e.target.value }))
                  if (validationErrors.ecrans_pc_heures_jour) setValidationErrors(prev => ({ ...prev, ecrans_pc_heures_jour: null }))
                }}
                placeholder="Ex: 6"
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.ecrans_pc_heures_jour && <p className="text-danger text-sm mt-1">{validationErrors.ecrans_pc_heures_jour}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Tablette</h2>
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.tablette_possede}
            onChange={(e) => setFormData(prev => ({ ...prev, tablette_possede: e.target.checked }))}
            className="w-4 h-4 text-primary"
          />
          <span className="text-text-primary">Je possède une tablette</span>
        </label>
        {formData.tablette_possede && (
          <div className="ml-7 space-y-4">
            <div>
              <label className="block text-text-secondary mb-2">Nombre de tablettes</label>
              <input
                type="number"
                min="0"
                value={formData.tablette_nombre}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, tablette_nombre: e.target.value }))
                  if (validationErrors.tablette_nombre) setValidationErrors(prev => ({ ...prev, tablette_nombre: null }))
                }}
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.tablette_nombre && <p className="text-danger text-sm mt-1">{validationErrors.tablette_nombre}</p>}
            </div>
            <div>
              <label className="block text-text-secondary mb-2">Fréquence de recharge par jour</label>
              <input
                type="number"
                min="0"
                value={formData.recharge_tablette_frequence}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, recharge_tablette_frequence: e.target.value }))
                  if (validationErrors.recharge_tablette_frequence) setValidationErrors(prev => ({ ...prev, recharge_tablette_frequence: null }))
                }}
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.recharge_tablette_frequence && <p className="text-danger text-sm mt-1">{validationErrors.recharge_tablette_frequence}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Éclairage</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Combien d'heures par jour la lumière est-elle allumée chez vous ?</label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={formData.lumiere_heures_jour}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, lumiere_heures_jour: e.target.value }))
                if (validationErrors.lumiere_heures_jour) setValidationErrors(prev => ({ ...prev, lumiere_heures_jour: null }))
              }}
              placeholder="Ex: 6"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.lumiere_heures_jour && <p className="text-danger text-sm mt-1">{validationErrors.lumiere_heures_jour}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Technologie