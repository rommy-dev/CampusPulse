function TransportConsommation({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors
}) {
  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))

    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = prev[field] || []

      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
      }
    })

    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const transportOptions = [
    { value: 'pied', label: 'À pied / Marche' },
    { value: 'taxi_be', label: 'Taxi-be (transport en commun / bus coopérative)' },
    { value: 'covoiturage', label: 'Covoiturage (voiture ou moto partagée)' },
    { value: 'velo_moto_deux_roues', label: 'Vélo / Moto personnelle / Deux-roues non motorisé' },
    { value: 'voiture_personnelle_familiale', label: 'Voiture personnelle ou familiale' },
    { value: 'autre', label: 'Autre' }
  ]

  const dureeTrajetOptions = [
    {
      value: 'moins_15min',
      label: 'Moins de 15 minutes (sur le campus ou immédiate proximité)'
    },
    {
      value: '15_30min',
      label: '15 à 30 minutes'
    },
    {
      value: '31_45min',
      label: '31 à 45 minutes'
    },
    {
      value: '46min_1h',
      label: '46 min à 1 heure'
    },
    {
      value: 'plus_1h',
      label: "Plus d'1 heure (trajet depuis Antananarivo ou agglomérations proches)"
    }
  ]

  const depenseTransportOptions = [
    {
      value: 'rien',
      label: 'Rien (logement sur place / marche)'
    },
    {
      value: 'moins_2000',
      label: 'Moins de 2 000 Ar'
    },
    {
      value: '2000_4000',
      label: '2 000 à 4 000 Ar'
    },
    {
      value: 'plus_4000',
      label: 'Plus de 4 000 Ar'
    }
  ]

  const difficultesTransportOptions = [
    {
      value: 'cout_eleve',
      label: 'Coût élevé du transport'
    },
    {
      value: 'frequence_insuffisante',
      label: 'Fréquence insuffisante ou manque de taxi-be'
    },
    {
      value: 'routes_mauvais_etat',
      label: 'Routes en mauvais état / Trajet trop long'
    },
    {
      value: 'insecurite',
      label: 'Insécurité pendant le trajet'
    },
    {
      value: 'aucune',
      label: 'Aucune difficulté'
    }
  ]

  return (
    <div className="space-y-6">

      {/* Transport */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Transport
        </h2>

        <div className="space-y-4">

          {/* Moyen de transport principal */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quel moyen de transport utilisez-vous principalement pour vous rendre à l'ESPA ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {transportOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="transport_principal"
                    value={option.value}
                    checked={formData.transport_principal === option.value}
                    onChange={(e) => setField('transport_principal', e.target.value)}
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.transport_principal && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.transport_principal}
              </p>
            )}

            {formData.transport_principal === 'autre' && (
              <div className="mt-4">
                <input
                  type="text"
                  value={formData.autre_transport || ''}
                  onChange={(e) => setField('autre_transport', e.target.value)}
                  placeholder="Précisez votre moyen de transport"
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {validationErrors.autre_transport && (
                  <p className="text-danger text-sm mt-1">
                    {validationErrors.autre_transport}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Combinaison des transports */}
          <div>
            <label className="block text-text-secondary mb-2">
              Combinez-vous plusieurs moyens de transport pour effectuer votre trajet quotidien ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="combine_transports"
                  value="oui"
                  checked={formData.combine_transports === 'oui'}
                  onChange={(e) => setField('combine_transports', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="combine_transports"
                  value="non"
                  checked={formData.combine_transports === 'non'}
                  onChange={(e) => setField('combine_transports', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.combine_transports && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.combine_transports}
              </p>
            )}
          </div>

          {/* Durée du trajet */}
          <div>
            <label className="block text-text-secondary mb-2">
              Combien de temps dure en moyenne un trajet simple (aller uniquement) ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {dureeTrajetOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="duree_trajet"
                    value={option.value}
                    checked={formData.duree_trajet === option.value}
                    onChange={(e) => setField('duree_trajet', e.target.value)}
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.duree_trajet && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.duree_trajet}
              </p>
            )}
          </div>

          {/* Dépense transport */}
          <div>
            <label className="block text-text-secondary mb-2">
              Combien dépensez-vous par jour en moyenne pour vos déplacements (aller-retour) ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {depenseTransportOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="depense_transport_jour"
                    value={option.value}
                    checked={formData.depense_transport_jour === option.value}
                    onChange={(e) => setField('depense_transport_jour', e.target.value)}
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.depense_transport_jour && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.depense_transport_jour}
              </p>
            )}
          </div>

          {/* Difficultés */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quelles sont vos principales difficultés liées au transport ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {difficultesTransportOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.difficultes_transport?.includes(option.value) || false}
                    onChange={() => handleCheckboxChange('difficultes_transport', option.value)}
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.difficultes_transport && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.difficultes_transport}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Consommation énergétique et ressources */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Consommation énergétique et ressources
        </h2>

        <div className="space-y-4">

          {/* LED */}
          <div>
            <label className="block text-text-secondary mb-2">
              Utilisez-vous des ampoules basse consommation (LED) dans votre logement à Vontovorona ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="led_utilise"
                  value="oui"
                  checked={formData.led_utilise === 'oui'}
                  onChange={(e) => setField('led_utilise', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="led_utilise"
                  value="non"
                  checked={formData.led_utilise === 'non'}
                  onChange={(e) => setField('led_utilise', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.led_utilise && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.led_utilise}
              </p>
            )}
          </div>

          {/* Lumières et multiprises */}
          <div>
            <label className="block text-text-secondary mb-2">
              Éteignez-vous systématiquement les lumières et débranchez-vous les multiprises lorsque vous quittez votre logement ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="eteint_lumieres_debranche"
                  value="oui"
                  checked={formData.eteint_lumieres_debranche === 'oui'}
                  onChange={(e) => setField('eteint_lumieres_debranche', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="eteint_lumieres_debranche"
                  value="non"
                  checked={formData.eteint_lumieres_debranche === 'non'}
                  onChange={(e) => setField('eteint_lumieres_debranche', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.eteint_lumieres_debranche && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.eteint_lumieres_debranche}
              </p>
            )}
          </div>

          {/* Coupures */}
          <div>
            <label className="block text-text-secondary mb-2">
              Subissez-vous fréquemment des coupures d'électricité (délestage) ou d'eau qui modifient vos habitudes de consommation ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="coupures_frequentes"
                  value="oui"
                  checked={formData.coupures_frequentes === 'oui'}
                  onChange={(e) => setField('coupures_frequentes', e.target.value)}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="coupures_frequentes"
                  value="non"
                  checked={formData.coupures_frequentes === 'non'}
                  onChange={(e) => {
                    setField('coupures_frequentes', e.target.value)
                    setField('impact_coupures', '')
                  }}
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.coupures_frequentes && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.coupures_frequentes}
              </p>
            )}

            {formData.coupures_frequentes === 'oui' && (
              <div className="mt-4">
                <label className="block text-text-secondary mb-2">
                  Précisez brièvement l'impact de ces coupures sur vos équipements ou votre organisation quotidienne :
                </label>

                <textarea
                  value={formData.impact_coupures || ''}
                  onChange={(e) => setField('impact_coupures', e.target.value)}
                  rows={3}
                  placeholder="Décrivez brièvement l'impact..."
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />

                {validationErrors.impact_coupures && (
                  <p className="text-danger text-sm mt-1">
                    {validationErrors.impact_coupures}
                  </p>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

    </div>
  )
}

export default TransportConsommation