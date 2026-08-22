function ModeDeVie({ formData, setFormData, validationErrors, setValidationErrors }) {
  const orduresOptions = [
    { value: 'moins_petit_sac', label: 'Moins d\'un petit sac' },
    { value: 'un_sac_moyen', label: 'Un sac moyen' },
    { value: 'deux_sacs_ou_plus', label: 'Deux sacs ou plus' },
    { value: 'ne_sait_pas', label: 'Je ne sais pas' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Consommation</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.alcool_boit}
              onChange={(e) => setFormData(prev => ({ ...prev, alcool_boit: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Je bois de l'alcool</span>
          </label>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Environnement</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.nuisance_sonore}
            onChange={(e) => setFormData(prev => ({ ...prev, nuisance_sonore: e.target.checked }))}
            className="w-4 h-4 text-primary"
          />
          <span className="text-text-primary">Présence de nuisance sonore</span>
        </label>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Gestion des déchets</h2>
        <p className="text-text-secondary text-sm mb-3">Quantité d'ordures produite par semaine</p>
        <div className="space-y-2">
          {orduresOptions.map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="ordures"
                value={option.value}
                checked={formData.ordures_quantite === option.value}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, ordures_quantite: e.target.value }))
                  if (validationErrors.ordures_quantite) setValidationErrors(prev => ({ ...prev, ordures_quantite: null }))
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
        {validationErrors.ordures_quantite && <p className="text-danger text-sm mt-2">{validationErrors.ordures_quantite}</p>}
      </div>
    </div>
  )
}

export default ModeDeVie