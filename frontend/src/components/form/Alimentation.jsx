import { useEffect } from 'react'

function Alimentation({ formData, setFormData, validationErrors, setValidationErrors }) {
  // Food category definitions for each meal
  const petitDejeunerCategories = {
    boissons: [
      { value: 'the', label: 'Thé' },
      { value: 'cafe', label: 'Café' },
      { value: 'cacao', label: 'Cacao' },
      { value: 'lait', label: 'Lait' },
      { value: 'eau', label: 'Eau' },
      { value: 'jus_fruits', label: 'Jus de fruits' },
      { value: 'jus_legumes', label: 'Jus de légumes' },
      { value: 'boisson_gazeuse', label: 'Boisson gazeuse' },
      { value: 'boisson_energetique', label: 'Boisson énergisante' },
      { value: 'smoothie', label: 'Smoothie' },
      { value: 'infusion', label: 'Infusion' },
      { value: 'autre', label: 'Autre' }
    ],
    feculents: [
      { value: 'riz', label: 'Riz' },
      { value: 'pain', label: 'Pain' },
      { value: 'autre_feculent', label: 'Autre féculent' }
    ],
    produits_locaux: [
      { value: 'mofogasy', label: 'Mofogasy' },
      { value: 'ramanonaka', label: 'Ramanonaka' },
      { value: 'menakely', label: 'Menakely' },
      { value: 'makasoaka', label: 'Makasoaka' },
      { value: 'grefy', label: 'Grefy' },
      { value: 'viennoiserie', label: 'Viennoiserie' }
    ],
    proteines: [
      { value: 'oeuf', label: 'Œuf' },
      { value: 'poisson', label: 'Poisson' },
      { value: 'viande', label: 'Viande' },
      { value: 'legumineuses', label: 'Légumineuses' }
    ],
    fruits: [
      { value: 'fruits', label: 'Fruits' }
    ]
  }

  const repasCategories = {
    feculents: [
      { value: 'riz', label: 'Riz' },
      { value: 'pain', label: 'Pain' },
      { value: 'pates', label: 'Pâtes' },
      { value: 'pommes_de_terre', label: 'Pommes de terre' },
      { value: 'manioc', label: 'Manioc' },
      { value: 'patate_douce', label: 'Patate douce' },
      { value: 'mais', label: 'Maïs' },
      { value: 'autre_feculent', label: 'Autre féculent' }
    ],
    legumes: [
      { value: 'legumes', label: 'Légumes' }
    ],
    proteines_animales: [
      { value: 'viande', label: 'Viande' },
      { value: 'poisson', label: 'Poisson' },
      { value: 'oeuf', label: 'Œuf' }
    ],
    proteines_vegetales: [
      { value: 'legumineuses', label: 'Légumineuses' }
    ],
    fruits: [
      { value: 'fruits', label: 'Fruits' }
    ]
  }

  const gouterCategories = {
    boissons: [
      { value: 'the', label: 'Thé' },
      { value: 'cafe', label: 'Café' },
      { value: 'cacao', label: 'Cacao' },
      { value: 'lait', label: 'Lait' },
      { value: 'eau', label: 'Eau' },
      { value: 'jus_fruits', label: 'Jus de fruits' },
      { value: 'jus_legumes', label: 'Jus de légumes' },
      { value: 'boisson_gazeuse', label: 'Boisson gazeuse' },
      { value: 'boisson_energetique', label: 'Boisson énergisante' },
      { value: 'smoothie', label: 'Smoothie' },
      { value: 'infusion', label: 'Infusion' },
      { value: 'autre', label: 'Autre' }
    ],
    fruits: [
      { value: 'fruits', label: 'Fruits' }
    ],
    produits_cereaux: [
      { value: 'pain', label: 'Pain' },
      { value: 'biscuits', label: 'Biscuits' },
      { value: 'gateaux', label: 'Gâteaux' },
      { value: 'mofogasy', label: 'Mofogasy' },
      { value: 'menakely', label: 'Menakely' },
      { value: 'makasoaka', label: 'Makasoaka' },
      { value: 'grefy', label: 'Grefy' },
      { value: 'viennoiserie', label: 'Viennoiserie' },
      { value: 'autre', label: 'Autre' }
    ],
    snacks: [
      { value: 'snacks_sales', label: 'Snacks salés' },
      { value: 'snacks_sucres', label: 'Snacks sucrés' }
    ]
  }

  const boissonsList = [
    { value: 'eau', label: 'Eau', hasQuantity: true },
    { value: 'eau_gazeuse', label: 'Eau gazeuse', hasQuantity: true },
    { value: 'the', label: 'Thé', hasQuantity: false },
    { value: 'cafe', label: 'Café', hasQuantity: false },
    { value: 'cacao', label: 'Cacao', hasQuantity: false },
    { value: 'lait', label: 'Lait', hasQuantity: false },
    { value: 'jus_fruits', label: 'Jus de fruits', hasQuantity: false },
    { value: 'jus_legumes', label: 'Jus de légumes', hasQuantity: false },
    { value: 'smoothie', label: 'Smoothie', hasQuantity: false },
    { value: 'infusion', label: 'Infusion / tisane', hasQuantity: false },
    { value: 'boisson_gazeuse', label: 'Boisson gazeuse', hasQuantity: false },
    { value: 'boisson_energetique', label: 'Boisson énergisante', hasQuantity: false },
    { value: 'boisson_sucree', label: 'Boisson sucrée', hasQuantity: false },
    { value: 'boisson_sans_sucre', label: 'Boisson sans sucre', hasQuantity: false },
    { value: 'autre', label: 'Autre', hasQuantity: false }
  ]

  const repasModes = [
    { value: 'cuisine_chez_moi', label: 'Je cuisine chez moi' },
    { value: 'mange_exterieur', label: 'Je mange à l\'extérieur' }
  ]

  // Initialize alimentation structure if not exists
  useEffect(() => {
    if (!formData.alimentation) {
      setFormData(prev => ({
        ...prev,
        alimentation: {
          saute_repas: false,
          petit_dejeuner: {
            mode: [],
            aliments: {
              boissons: [],
              feculents: [],
              produits_locaux: [],
              proteines: [],
              fruits: [],
              autre: ''
            },
            riz_frequence_jour: null
          },
          dejeuner: {
            mode: [],
            aliments: {
              feculents: [],
              legumes: [],
              proteines_animales: [],
              proteines_vegetales: [],
              fruits: [],
              autre: ''
            },
            riz_frequence_jour: null
          },
          diner: {
            mode: [],
            aliments: {
              feculents: [],
              legumes: [],
              proteines_animales: [],
              proteines_vegetales: [],
              fruits: [],
              autre: ''
            },
            riz_frequence_jour: null
          },
          gouter: {
            mode: [],
            aliments: {
              boissons: [],
              fruits: [],
              produits_cereaux: [],
              snacks: [],
              autre: ''
            },
            pas_de_gouter: false
          },
          boissons: {
            eau: { selectionne: false, frequence_jour: null, litres_jour: null },
            eau_gazeuse: { selectionne: false, frequence_jour: null, litres_jour: null },
            the: { selectionne: false, frequence_jour: null },
            cafe: { selectionne: false, frequence_jour: null },
            cacao: { selectionne: false, frequence_jour: null },
            lait: { selectionne: false, frequence_jour: null },
            jus_fruits: { selectionne: false, frequence_jour: null },
            jus_legumes: { selectionne: false, frequence_jour: null },
            smoothie: { selectionne: false, frequence_jour: null },
            infusion: { selectionne: false, frequence_jour: null },
            boisson_gazeuse: { selectionne: false, frequence_jour: null },
            boisson_energetique: { selectionne: false, frequence_jour: null },
            boisson_sucree: { selectionne: false, frequence_jour: null },
            boisson_sans_sucre: { selectionne: false, frequence_jour: null },
            autre: { selectionne: false, frequence_jour: null, precision: '' }
          }
        }
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Return loading state if not initialized
  if (!formData.alimentation) {
    return null
  }

  const handleSauteRepasChange = () => {
    setFormData(prev => ({
      ...prev,
      alimentation: {
        ...prev.alimentation,
        saute_repas: !prev.alimentation.saute_repas
      }
    }))
  }

  const handleRepasModeChange = (repasKey, modeValue) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const repas = { ...alimentation[repasKey] }
      const currentModes = [...repas.mode]
      
      if (currentModes.includes(modeValue)) {
        repas.mode = currentModes.filter(m => m !== modeValue)
      } else {
        repas.mode = [...currentModes, modeValue]
      }
      
      // Clean up rice frequency if no longer cooking at home
      if (!repas.mode.includes('cuisine_chez_moi')) {
        repas.riz_frequence_jour = null
      }
      
      alimentation[repasKey] = repas
      return { ...prev, alimentation }
    })
    
    // Clear validation errors
    if (validationErrors[`${repasKey}_mode`]) {
      setValidationErrors(prev => ({ ...prev, [`${repasKey}_mode`]: null }))
    }
  }

  const handleAlimentChange = (repasKey, category, alimentValue) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const repas = { ...alimentation[repasKey] }
      const aliments = { ...repas.aliments }
      const currentCategory = [...aliments[category]]
      
      if (currentCategory.includes(alimentValue)) {
        aliments[category] = currentCategory.filter(a => a !== alimentValue)
        
        // Clean up conditional data
        if (alimentValue === 'autre') {
          aliments.autre = ''
        }
        if (alimentValue === 'riz' && !repas.mode.includes('cuisine_chez_moi')) {
          repas.riz_frequence_jour = null
        }
      } else {
        aliments[category] = [...currentCategory, alimentValue]
      }
      
      repas.aliments = aliments
      alimentation[repasKey] = repas
      return { ...prev, alimentation }
    })
    
    // Clear validation errors
    if (validationErrors[`${repasKey}_${category}`]) {
      setValidationErrors(prev => ({ ...prev, [`${repasKey}_${category}`]: null }))
    }
  }

  const handleAutreChange = (repasKey, value) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const repas = { ...alimentation[repasKey] }
      const aliments = { ...repas.aliments }
      aliments.autre = value
      repas.aliments = aliments
      alimentation[repasKey] = repas
      return { ...prev, alimentation }
    })
    
    if (validationErrors[`${repasKey}_autre`]) {
      setValidationErrors(prev => ({ ...prev, [`${repasKey}_autre`]: null }))
    }
  }

  const handleRizFrequenceChange = (repasKey, value) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const repas = { ...alimentation[repasKey] }
      repas.riz_frequence_jour = value
      alimentation[repasKey] = repas
      return { ...prev, alimentation }
    })
    
    if (validationErrors[`${repasKey}_riz_frequence`]) {
      setValidationErrors(prev => ({ ...prev, [`${repasKey}_riz_frequence`]: null }))
    }
  }

  const handlePasDeGouterChange = (checked) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const gouter = { ...alimentation.gouter }
      
      if (checked) {
        // Clear all snack selections if "no snack" is selected
        gouter.pas_de_gouter = true
        gouter.mode = []
        gouter.aliments = {
          boissons: [],
          fruits: [],
          produits_cereaux: [],
          snacks: [],
          autre: ''
        }
      } else {
        gouter.pas_de_gouter = false
      }
      
      alimentation.gouter = gouter
      return { ...prev, alimentation }
    })
  }

  const handleBoissonChange = (boissonKey) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const boissons = { ...alimentation.boissons }
      const boisson = { ...boissons[boissonKey] }
      
      if (boisson.selectionne) {
        // Deselect and clean up
        boissons[boissonKey] = {
          selectionne: false,
          frequence_jour: null,
          ...(boissonKey === 'autre' && { precision: '' }),
          ...((boissonKey === 'eau' || boissonKey === 'eau_gazeuse') && { litres_jour: null })
        }
      } else {
        // Select
        boissons[boissonKey] = {
          ...boisson,
          selectionne: true
        }
      }
      
      alimentation.boissons = boissons
      return { ...prev, alimentation }
    })
    
    // Clear validation errors
    if (validationErrors[`boisson_${boissonKey}`]) {
      setValidationErrors(prev => ({ ...prev, [`boisson_${boissonKey}`]: null }))
    }
  }

  const handleBoissonFrequenceChange = (boissonKey, value) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const boissons = { ...alimentation.boissons }
      boissons[boissonKey] = {
        ...boissons[boissonKey],
        frequence_jour: value
      }
      alimentation.boissons = boissons
      return { ...prev, alimentation }
    })
    
    if (validationErrors[`boisson_${boissonKey}_frequence`]) {
      setValidationErrors(prev => ({ ...prev, [`boisson_${boissonKey}_frequence`]: null }))
    }
  }

  const handleBoissonLitresChange = (boissonKey, value) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const boissons = { ...alimentation.boissons }
      boissons[boissonKey] = {
        ...boissons[boissonKey],
        litres_jour: value
      }
      alimentation.boissons = boissons
      return { ...prev, alimentation }
    })
    
    if (validationErrors[`boisson_${boissonKey}_litres`]) {
      setValidationErrors(prev => ({ ...prev, [`boisson_${boissonKey}_litres`]: null }))
    }
  }

  const handleBoissonAutreChange = (value) => {
    setFormData(prev => {
      const alimentation = { ...prev.alimentation }
      const boissons = { ...alimentation.boissons }
      boissons.autre = {
        ...boissons.autre,
        precision: value
      }
      alimentation.boissons = boissons
      return { ...prev, alimentation }
    })
    
    if (validationErrors.boisson_autre_precision) {
      setValidationErrors(prev => ({ ...prev, boisson_autre_precision: null }))
    }
  }

  // Helper to check if rice frequency should be shown
  const shouldShowRizFrequence = (repasKey) => {
    const repas = formData.alimentation[repasKey]
    const hasRiz = repas.aliments.feculents?.includes('riz')
    const cooksAtHome = repas.mode?.includes('cuisine_chez_moi')
    return hasRiz && cooksAtHome
  }

  // Helper to check if water quantity should be shown
  const shouldShowWaterQuantity = (boissonKey) => {
    return (boissonKey === 'eau' || boissonKey === 'eau_gazeuse') && 
           formData.alimentation.boissons[boissonKey]?.selectionne
  }

  // Render meal section
  const renderMealSection = (title, repasKey, categories) => {
    const repas = formData.alimentation[repasKey]
    const showRizFrequence = shouldShowRizFrequence(repasKey)

    return (
      <div key={repasKey} className="border border-text-secondary/10 rounded-md p-3">
        <h3 className="text-text-primary font-medium mb-3">{title}</h3>
        
        {/* Mode selection */}
        <div className="mb-4">
          <p className="text-text-secondary text-sm mb-2">Mode de repas :</p>
          <div className="space-y-2">
            {repasModes.map(mode => (
              <label key={mode.value} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={repas.mode?.includes(mode.value)}
                  onChange={() => handleRepasModeChange(repasKey, mode.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary text-sm">{mode.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Food categories */}
        {repas.mode && repas.mode.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(categories).map(([categoryName, options]) => (
              <div key={categoryName} className="border border-text-secondary/20 px-2 py-1 rounded-md">
                <p className="text-text-secondary text-xs uppercase mb-2">
                  {categoryName.replace(/_/g, ' ')}
                </p>
                <div className="space-y-2 ml-2">
                  {options.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={repas.aliments[categoryName]?.includes(option.value)}
                        onChange={() => handleAlimentChange(repasKey, categoryName, option.value)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-primary text-sm pr-1">{option.label}</span>
                    </label>
                  ))}
                </div>
                {/* Autre text field */}
                {repas.aliments[categoryName]?.includes('autre') && (
                  <input
                    type="text"
                    placeholder="Précisez"
                    value={repas.aliments.autre}
                    onChange={(e) => handleAutreChange(repasKey, e.target.value)}
                    className="w-full mt-2 px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Rice frequency conditional */}
        {showRizFrequence && (
          <div className="mt-4 ml-2">
            <label className="block text-text-secondary text-sm mb-2">
              Combien de fois par jour cuisinez-vous du riz ?
            </label>
            <input
              type="number"
              min="0"
              value={repas.riz_frequence_jour || ''}
              onChange={(e) => handleRizFrequenceChange(repasKey, e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
            {validationErrors[`${repasKey}_riz_frequence`] && (
              <p className="text-danger text-sm mt-1">{validationErrors[`${repasKey}_riz_frequence`]}</p>
            )}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Skip meals option */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Repas</h2>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.alimentation.saute_repas}
            onChange={handleSauteRepasChange}
            className="w-4 h-4 text-primary"
          />
          <span className="text-text-primary font-medium">Je saute parfois des repas</span>
        </label>
      </div>

      {/* Petit déjeuner */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Petit déjeuner</h2>
        {renderMealSection('Petit déjeuner', 'petit_dejeuner', petitDejeunerCategories)}
      </div>

      {/* Déjeuner */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Déjeuner</h2>
        {renderMealSection('Déjeuner', 'dejeuner', repasCategories)}
      </div>

      {/* Dîner */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Dîner</h2>
        {renderMealSection('Dîner', 'diner', repasCategories)}
      </div>

      {/* Goûter */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Goûter</h2>
        <div className="border border-text-secondary/10 rounded-md p-3">
          <h3 className="text-text-primary font-medium mb-3">Goûter</h3>
          
          {/* Mode selection */}
          <div className="mb-4">
            <p className="text-text-secondary text-sm mb-2">Mode de repas :</p>
            <div className="space-y-2">
              {repasModes.map(mode => (
                <label key={mode.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.alimentation.gouter.mode?.includes(mode.value)}
                    onChange={() => handleRepasModeChange('gouter', mode.value)}
                    disabled={formData.alimentation.gouter.pas_de_gouter}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary text-sm">{mode.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* No snack option */}
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <input
              type="checkbox"
              checked={formData.alimentation.gouter.pas_de_gouter}
              onChange={(e) => handlePasDeGouterChange(e.target.checked)}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary text-sm">Je ne prends pas de goûter</span>
          </label>

          {/* Food categories */}
          {!formData.alimentation.gouter.pas_de_gouter && formData.alimentation.gouter.mode && formData.alimentation.gouter.mode.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {Object.entries(gouterCategories).map(([categoryName, options]) => (
                <div key={categoryName} className="border border-text-secondary/20 px-2 py-1 rounded-md">
                  <p className="text-text-secondary text-xs uppercase mb-2">
                    {categoryName.replace(/_/g, ' ')}
                  </p>
                  <div className="space-y-2 ml-2">
                    {options.map(option => (
                      <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.alimentation.gouter.aliments[categoryName]?.includes(option.value)}
                          onChange={() => handleAlimentChange('gouter', categoryName, option.value)}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-text-primary text-sm">{option.label}</span>
                      </label>
                    ))}
                  </div>
                  {/* Autre text field */}
                  {formData.alimentation.gouter.aliments[categoryName]?.includes('autre') && (
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.alimentation.gouter.aliments.autre}
                      onChange={(e) => handleAutreChange('gouter', e.target.value)}
                      className="w-full mt-2 px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Boissons */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Boissons</h2>
        <p className="text-text-secondary text-sm mb-4">Toutes les boissons consommées dans la journée</p>
        
        <div className="grid md:grid-cols-2 gap-3">
          {boissonsList.map(boisson => (
            <div key={boisson.value} className="border border-text-secondary/10 rounded-md p-3">
              <label className="flex items-center gap-3 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={formData.alimentation.boissons[boisson.value]?.selectionne}
                  onChange={() => handleBoissonChange(boisson.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary font-medium">{boisson.label}</span>
              </label>
              
              {formData.alimentation.boissons[boisson.value]?.selectionne && (
                <div className="ml-7 space-y-2">
                  {/* Frequency */}
                  <div>
                    <label className="block text-text-secondary text-sm mb-1">
                      Combien de fois par jour en buvez-vous ?
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.alimentation.boissons[boisson.value].frequence_jour || ''}
                      onChange={(e) => handleBoissonFrequenceChange(boisson.value, e.target.value)}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {validationErrors[`boisson_${boisson.value}_frequence`] && (
                      <p className="text-danger text-sm mt-1">{validationErrors[`boisson_${boisson.value}_frequence`]}</p>
                    )}
                  </div>
                  
                  {/* Water quantity (for water types) */}
                  {shouldShowWaterQuantity(boisson.value) && (
                    <div>
                      <label className="block text-text-secondary text-sm mb-1">
                        Combien de litres d'eau buvez-vous par jour ?
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={formData.alimentation.boissons[boisson.value].litres_jour || ''}
                        onChange={(e) => handleBoissonLitresChange(boisson.value, e.target.value)}
                        className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      {validationErrors[`boisson_${boisson.value}_litres`] && (
                        <p className="text-danger text-sm mt-1">{validationErrors[`boisson_${boisson.value}_litres`]}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Autre precision */}
                  {boisson.value === 'autre' && (
                    <div>
                      <label className="block text-text-secondary text-sm mb-1">
                        Précisez la boisson
                      </label>
                      <input
                        type="text"
                        value={formData.alimentation.boissons.autre.precision || ''}
                        onChange={(e) => handleBoissonAutreChange(e.target.value)}
                        className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                      />
                      {validationErrors.boisson_autre_precision && (
                        <p className="text-danger text-sm mt-1">{validationErrors.boisson_autre_precision}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Alimentation