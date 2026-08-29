function BudgetEau({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors
}) {
  const budgetOptions = [
    { value: 'moins_100000', label: 'Moins de 100 000 Ar' },
    { value: '100000_200000', label: '100 000 à 200 000 Ar' },
    { value: '200001_350000', label: '200 001 à 350 000 Ar' },
    { value: '350001_500000', label: '350 001 à 500 000 Ar' },
    { value: 'plus_500000', label: 'Plus de 500 000 Ar' }
  ]

  const posteOptions = [
    { value: 'logement', label: 'Logement' },
    { value: 'transport', label: 'Transport' },
    { value: 'alimentation', label: 'Alimentation' },
    { value: 'materiel_scolaire', label: 'Matériel / Fournitures scolaires' },
    { value: 'communication', label: 'Communication (crédit/internet)' }
  ]

  const couvertureBudgetOptions = [
    { value: 'oui_toujours', label: 'Oui, toujours' },
    { value: 'partiellement', label: 'Partiellement / Souvent' },
    { value: 'non_rarement', label: 'Non, rarement ou jamais' }
  ]

  const accesEauOptions = [
    {
      value: 'permanent_bonne_qualite',
      label: 'Accès permanent et de bonne qualité'
    },
    {
      value: 'intermittent',
      label: 'Accès intermittent (coupures fréquentes ou pression faible)'
    },
    {
      value: 'difficile_courvee',
      label: "Accès difficile nécessitant des corvées d'approvisionnement"
    },
    {
      value: 'incertain_traitement',
      label: 'Qualité de l’eau incertaine nécessitant un traitement (filtration / ébullition)'
    }
  ]

  const pratiquesEauOptions = [
    {
      value: 'fermer_robinet',
      label: 'Fermer le robinet pendant le savonnage / brossage'
    },
    {
      value: 'recuperer_eau',
      label: "Récupérer l'eau de pluie ou de rinçage"
    },
    {
      value: 'reparer_fuites',
      label: 'Réparer rapidement les fuites'
    },
    {
      value: 'aucune',
      label: 'Aucune mesure particulière'
    }
  ]

  const setField = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  const handleCheckboxChange = (field, value, max = null) => {
    setFormData(prev => {
      const currentValues = prev[field] || []

      if (currentValues.includes(value)) {
        return {
          ...prev,
          [field]: currentValues.filter(item => item !== value)
        }
      }

      if (max !== null && currentValues.length >= max) {
        return prev
      }

      return {
        ...prev,
        [field]: [...currentValues, value]
      }
    })

    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }))
    }
  }

  return (
    <div className="space-y-6">

      {/* Budget */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Budget et conditions de vie
        </h2>

        <div className="space-y-4">

          {/* Budget mensuel */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quel est votre budget mensuel total approximatif (logement, transport et dépenses incluses) ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {budgetOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="budget_mensuel_total"
                    value={option.value}
                    checked={formData.budget_mensuel_total === option.value}
                    onChange={(e) =>
                      setField('budget_mensuel_total', e.target.value)
                    }
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.budget_mensuel_total && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.budget_mensuel_total}
              </p>
            )}
          </div>

          {/* Principaux postes de dépenses */}
          <div>
            <label className="block text-text-secondary mb-2">
              Parmi les postes suivants, quels sont vos deux principaux postes de dépenses ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {posteOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.postes_depenses?.includes(option.value) || false
                    }
                    onChange={() =>
                      handleCheckboxChange(
                        'postes_depenses',
                        option.value,
                        2
                      )
                    }
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            <p className="text-text-secondary text-sm mt-2">
              Sélectionnez exactement deux postes.
            </p>

            {validationErrors.postes_depenses && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.postes_depenses}
              </p>
            )}
          </div>

          {/* Couverture des besoins */}
          <div>
            <label className="block text-text-secondary mb-2">
              Votre budget actuel vous permet-il de couvrir l'ensemble de vos besoins fondamentaux ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {couvertureBudgetOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="budget_couvre_besoins"
                    value={option.value}
                    checked={
                      formData.budget_couvre_besoins === option.value
                    }
                    onChange={(e) =>
                      setField('budget_couvre_besoins', e.target.value)
                    }
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.budget_couvre_besoins && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.budget_couvre_besoins}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Gestion de l'eau */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Gestion de l'eau
        </h2>

        <div className="space-y-4">

          {/* Accès à l'eau */}
          <div>
            <label className="block text-text-secondary mb-2">
              Comment évaluez-vous l'accès à l'eau potable dans votre logement ou sur le campus de Vontovorona ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {accesEauOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="acces_eau_potable"
                    value={option.value}
                    checked={
                      formData.acces_eau_potable === option.value
                    }
                    onChange={(e) =>
                      setField('acces_eau_potable', e.target.value)
                    }
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.acces_eau_potable && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.acces_eau_potable}
              </p>
            )}
          </div>

          {/* Pratiques d'économie d'eau */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quelles pratiques adoptez-vous pour économiser l'eau au quotidien ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-2">
              {pratiquesEauOptions.map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={
                      formData.pratiques_economie_eau?.includes(option.value) ||
                      false
                    }
                    onChange={() =>
                      handleCheckboxChange(
                        'pratiques_economie_eau',
                        option.value
                      )
                    }
                    className="w-4 h-4 text-primary"
                  />

                  <span className="text-text-primary">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>

            {validationErrors.pratiques_economie_eau && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.pratiques_economie_eau}
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

export default BudgetEau
