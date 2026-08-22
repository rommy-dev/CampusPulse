function LogementTransport({ formData, setFormData, validationErrors, setValidationErrors }) {
  const logementOptions = [
    { value: 'residence_universitaire', label: 'Résidence universitaire' },
    { value: 'chez_parents', label: 'Chez les parents' },
    { value: 'colocation', label: 'Colocation' },
    { value: 'location_seul', label: 'Location seul(e)' },
    { value: 'autre', label: 'Autre' }
  ]

  const transportOptions = [
    { value: 'pied', label: 'À pied' },
    { value: 'velo', label: 'Vélo' },
    { value: 'moto', label: 'Moto' },
    { value: 'voiture', label: 'Voiture' },
    { value: 'transport_commun', label: 'Transport en commun' },
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
        <h2 className="text-lg font-semibold text-text-primary mb-4">Logement</h2>
        <div className="space-y-2">
          {logementOptions.map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="logement"
                value={option.value}
                checked={formData.logement === option.value}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, logement: e.target.value }))
                  if (validationErrors.logement) setValidationErrors(prev => ({ ...prev, logement: null }))
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
        {validationErrors.logement && <p className="text-danger text-sm mt-2">{validationErrors.logement}</p>}
        {formData.logement === 'autre' && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Précisez votre type de logement"
              value={formData.autre_logement}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, autre_logement: e.target.value }))
                if (validationErrors.autre_logement) setValidationErrors(prev => ({ ...prev, autre_logement: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.autre_logement && <p className="text-danger text-sm mt-1">{validationErrors.autre_logement}</p>}
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Transport</h2>
        <p className="text-text-secondary text-sm mb-3">Choisissez tous les modes de transport que vous utilisez</p>
        <div className="space-y-2">
          {transportOptions.map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.transport.includes(option.value)}
                onChange={() => handleCheckboxChange('transport', option.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
        {validationErrors.transport && <p className="text-danger text-sm mt-2">{validationErrors.transport}</p>}
        {formData.transport.includes('autre') && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Précisez votre mode de transport"
              value={formData.autre_transport}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, autre_transport: e.target.value }))
                if (validationErrors.autre_transport) setValidationErrors(prev => ({ ...prev, autre_transport: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.autre_transport && <p className="text-danger text-sm mt-1">{validationErrors.autre_transport}</p>}
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Fréquence de venue sur le campus</h2>
        <div>
          <label className="block text-text-secondary mb-2">Nombre de jours par semaine</label>
          <input
            type="number"
            min="0"
            max="7"
            value={formData.frequence_venue}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, frequence_venue: e.target.value }))
              if (validationErrors.frequence_venue) setValidationErrors(prev => ({ ...prev, frequence_venue: null }))
            }}
            className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {validationErrors.frequence_venue && <p className="text-danger text-sm mt-1">{validationErrors.frequence_venue}</p>}
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Fréquence de déplacement</h2>
        <div>
          <label className="block text-text-secondary mb-2">Nombre d'allers-retours par semaine</label>
          <input
            type="number"
            min="0"
            value={formData.frequence_depart}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, frequence_depart: e.target.value }))
              if (validationErrors.frequence_depart) setValidationErrors(prev => ({ ...prev, frequence_depart: null }))
            }}
            className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {validationErrors.frequence_depart && <p className="text-danger text-sm mt-1">{validationErrors.frequence_depart}</p>}
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Domicialisation</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Ville / Quartier</label>
            <input
              type="text"
              value={formData.domicialisation_ville}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, domicialisation_ville: e.target.value }))
                if (validationErrors.domicialisation_ville) setValidationErrors(prev => ({ ...prev, domicialisation_ville: null }))
              }}
              placeholder="Ex: Antanimena"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.domicialisation_ville && <p className="text-danger text-sm mt-1">{validationErrors.domicialisation_ville}</p>}
          </div>
          <div>
            <label className="block text-text-secondary mb-2">Distance de Vontovorona (en km)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={formData.domicialisation_distance_vontovorona}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, domicialisation_distance_vontovorona: e.target.value }))
                if (validationErrors.domicialisation_distance_vontovorona) setValidationErrors(prev => ({ ...prev, domicialisation_distance_vontovorona: null }))
              }}
              placeholder="Ex: 12.5"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.domicialisation_distance_vontovorona && <p className="text-danger text-sm mt-1">{validationErrors.domicialisation_distance_vontovorona}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogementTransport