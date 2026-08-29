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
      <div>
        <label className="block text-text-secondary mb-2">
          Quels équipements numériques possédez-vous et utilisez-vous pour vos études (ex: Aspen Plus, Python, DAO) ?
        </label>

        <div className="space-y-2">
          {[
            { value: 'smartphone_personnel', label: 'Smartphone personnel' },
            { value: 'ordinateur_portable_fixe', label: 'Ordinateur portable / fixe' },
            { value: 'tablette_tactile', label: 'Tablette tactile' },
            { value: 'aucun_equipement_personnel', label: 'Aucun équipement personnel' }
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.equipements_numeriques.includes(option.value)}
                onChange={() => handleCheckboxChange('equipements_numeriques', option.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>

        {validationErrors.equipements_numeriques && (
          <p className="text-danger text-sm mt-2">
            {validationErrors.equipements_numeriques}
          </p>
        )}
      </div>
      <div>
        <label className="block text-text-secondary mb-2">
          Depuis combien de temps utilisez-vous votre smartphone ou ordinateur principal avant son remplacement ?
        </label>

        <div className="space-y-2">
          {[
            { value: 'moins_2_ans', label: 'Moins de 2 ans' },
            { value: '2_4_ans', label: '2 à 4 ans' },
            { value: '5_ans_plus', label: '5 ans et plus' },
            { value: 'panne_totale_irreparable', label: "Jusqu'à panne totale / irréparable" }
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="duree_utilisation_appareil"
                value={option.value}
                checked={formData.duree_utilisation_appareil === option.value}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    duree_utilisation_appareil: e.target.value
                  }))

                  if (validationErrors.duree_utilisation_appareil) {
                    setValidationErrors(prev => ({
                      ...prev,
                      duree_utilisation_appareil: null
                    }))
                  }
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>

        {validationErrors.duree_utilisation_appareil && (
          <p className="text-danger text-sm mt-2">
            {validationErrors.duree_utilisation_appareil}
          </p>
        )}
      </div>
      <div>
        <label className="block text-text-secondary mb-2">
          Rechargez-vous vos appareils électroniques plusieurs fois par jour ou les laissez-vous branchés toute la nuit ?
        </label>

        <div className="space-y-2">
          {[
            { value: 'oui', label: 'Oui' },
            { value: 'non', label: 'Non' }
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="recharge_appareils_plusieurs_fois_nuit"
                value={option.value}
                checked={formData.recharge_appareils_plusieurs_fois_nuit === option.value}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    recharge_appareils_plusieurs_fois_nuit: e.target.value
                  }))

                  if (validationErrors.recharge_appareils_plusieurs_fois_nuit) {
                    setValidationErrors(prev => ({
                      ...prev,
                      recharge_appareils_plusieurs_fois_nuit: null
                    }))
                  }
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>

        {validationErrors.recharge_appareils_plusieurs_fois_nuit && (
          <p className="text-danger text-sm mt-2">
            {validationErrors.recharge_appareils_plusieurs_fois_nuit}
          </p>
        )}
      </div>
      <div>
        <label className="block text-text-secondary mb-2">
          En cas de panne de vos appareils électroniques (téléphone, ordinateur, chargeur), quelle est votre réaction prioritaire ?
        </label>

        <div className="space-y-2">
          {[
            {
              value: 'reparation_technicien_local',
              label: "Je fais réparer l'appareil auprès d'un technicien local"
            },
            {
              value: 'reparation_soi_meme',
              label: 'Je répare par moi-même (si possible)'
            },
            {
              value: 'rachat_appareil_neuf',
              label: 'Je rachète un appareil neuf'
            },
            {
              value: 'stockage_dormant',
              label: "Je mets l'appareil de côté sans le réparer (stockage dormant)"
            }
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="reaction_panne_appareil"
                value={option.value}
                checked={formData.reaction_panne_appareil === option.value}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    reaction_panne_appareil: e.target.value
                  }))

                  if (validationErrors.reaction_panne_appareil) {
                    setValidationErrors(prev => ({
                      ...prev,
                      reaction_panne_appareil: null
                    }))
                  }
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>

        {validationErrors.reaction_panne_appareil && (
          <p className="text-danger text-sm mt-2">
            {validationErrors.reaction_panne_appareil}
          </p>
        )}
      </div>
      <div>
        <label className="block text-text-secondary mb-2">
          Comment éliminez-vous vos équipements électroniques ou accessoires obsolètes (batteries, câbles, chargeurs cassés) ?
        </label>

        <div className="space-y-2">
          {[
            {
              value: 'conservation_chez_moi',
              label: 'Je les conserve chez moi (tiroir / encombrants)'
            },
            {
              value: 'poubelle_ordinaire',
              label: 'Je les jette dans la poubelle ordinaire / ménagère'
            },
            {
              value: 'filiere_collecte_recyclage',
              label: 'Je les confie à une filière de collecte spécialisée ou de recyclage / revente pour pièces'
            },
            {
              value: 'revente',
              label: 'Je les revends'
            }
          ].map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="elimination_equipements_electroniques"
                value={option.value}
                checked={formData.elimination_equipements_electroniques === option.value}
                onChange={(e) => {
                  setFormData(prev => ({
                    ...prev,
                    elimination_equipements_electroniques: e.target.value
                  }))

                  if (validationErrors.elimination_equipements_electroniques) {
                    setValidationErrors(prev => ({
                      ...prev,
                      elimination_equipements_electroniques: null
                    }))
                  }
                }}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>

        {validationErrors.elimination_equipements_electroniques && (
          <p className="text-danger text-sm mt-2">
            {validationErrors.elimination_equipements_electroniques}
          </p>
        )}
      </div>
      <div>
        <label className="block text-text-secondary mb-2">
          Quelles mesures d'écoconception logicielle ou matérielle mettriez-vous en avant pour réduire l'impact environnemental du numérique sur le campus ?
        </label>

        <textarea
          value={formData.ecoconception_numerique_suggestion}
          onChange={(e) => {
            setFormData(prev => ({
              ...prev,
              ecoconception_numerique_suggestion: e.target.value
            }))

            if (validationErrors.ecoconception_numerique_suggestion) {
              setValidationErrors(prev => ({
                ...prev,
                ecoconception_numerique_suggestion: null
              }))
            }
          }}
          rows={4}
          placeholder="Votre réponse..."
          className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {validationErrors.ecoconception_numerique_suggestion && (
          <p className="text-danger text-sm mt-1">
            {validationErrors.ecoconception_numerique_suggestion}
          </p>
        )}
      </div>
    </div>
  )
}

export default Technologie