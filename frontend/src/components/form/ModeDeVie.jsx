function ModeDeVie({ formData, setFormData, validationErrors, setValidationErrors }) {
  const typeDechetOptions = [
    { value: 'organique', label: 'Organique' },
    { value: 'plastique', label: 'Plastique' },
    { value: 'inerte', label: 'Inerte' }
  ]

  const sousCategoriesOrganique = [
    { value: 'epluchure', label: 'Épluchures' },
    { value: 'reste_repas', label: 'Reste de repas' },
    { value: 'autre_organique', label: 'Autre' }
  ]

  const sousCategoriesPlastique = [
    { value: 'bouteilles', label: 'Bouteilles' },
    { value: 'sacs', label: 'Sacs' },
    { value: 'emballages', label: 'Emballages' },
    { value: 'autre_plastique', label: 'Autre' }
  ]

  const sousCategoriesInerte = [
    { value: 'verre', label: 'Verre' },
    { value: 'metal', label: 'Métal' },
    { value: 'papier_carton', label: 'Papier/Carton' },
    { value: 'autre_inerte', label: 'Autre' }
  ]

  const eliminationOptions = [
    { value: 'bac_ordure', label: 'Bac à ordures' },
    { value: 'bruler', label: 'Faire brûler' },
    { value: 'composte', label: 'Composte' }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Produits stupéfiants</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.alcool_boit}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, alcool_boit: e.target.checked }))
                if (!e.target.checked) {
                  setFormData(prev => ({ ...prev, produits_stupéfiants_frequence_semaine: '' }))
                }
              }}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Alcool</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.tabac}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, tabac: e.target.checked }))
                if (!e.target.checked) {
                  setFormData(prev => ({ ...prev, produits_stupéfiants_frequence_semaine: '' }))
                }
              }}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Tabac</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.cigarettes}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, cigarettes: e.target.checked }))
                if (!e.target.checked) {
                  setFormData(prev => ({ ...prev, produits_stupéfiants_frequence_semaine: '' }))
                }
              }}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Cigarettes</span>
          </label>
          {(formData.alcool_boit || formData.tabac || formData.cigarettes) && (
            <div className="ml-7">
              <label className="block text-text-secondary mb-2">Combien de fois par semaine ?</label>
              <input
                type="number"
                min="0"
                value={formData.produits_stupéfiants_frequence_semaine}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, produits_stupéfiants_frequence_semaine: e.target.value }))
                  if (validationErrors.produits_stupéfiants_frequence_semaine) setValidationErrors(prev => ({ ...prev, produits_stupéfiants_frequence_semaine: null }))
                }}
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.produits_stupéfiants_frequence_semaine && <p className="text-danger text-sm mt-1">{validationErrors.produits_stupéfiants_frequence_semaine}</p>}
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Gestion des déchets</h2>
        <div className="space-y-4">
          <div>
            <p className="text-text-secondary text-sm mb-2">Type de déchets</p>
            <div className="space-y-2">
              {typeDechetOptions.map(option => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.type_dechet?.includes(option.value) || false}
                    onChange={(e) => {
                      const newTypes = e.target.checked
                        ? [...(formData.type_dechet || []), option.value]
                        : (formData.type_dechet || []).filter(item => item !== option.value)
                      setFormData(prev => ({ ...prev, type_dechet: newTypes }))
                      // Clear subcategories when type is deselected
                      if (!e.target.checked) {
                        if (option.value === 'organique') {
                          setFormData(prev => ({ ...prev, sous_categories_organique: [], autre_organique_precision: '' }))
                          if (validationErrors.autre_organique_precision) setValidationErrors(prev => ({ ...prev, autre_organique_precision: null }))
                        } else if (option.value === 'plastique') {
                          setFormData(prev => ({ ...prev, sous_categories_plastique: [], autre_plastique_precision: '' }))
                          if (validationErrors.autre_plastique_precision) setValidationErrors(prev => ({ ...prev, autre_plastique_precision: null }))
                        } else if (option.value === 'inerte') {
                          setFormData(prev => ({ ...prev, sous_categories_inerte: [], autre_inerte_precision: '' }))
                          if (validationErrors.autre_inerte_precision) setValidationErrors(prev => ({ ...prev, autre_inerte_precision: null }))
                        }
                      }
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>

            {/* Sous-catégories Organique */}
            {formData.type_dechet?.includes('organique') && (
              <div className="ml-7 mt-3 border-l-2 border-text-secondary/20 pl-3">
                <p className="text-text-secondary text-xs mb-2">Détails organique :</p>
                <div className="space-y-2">
                  {sousCategoriesOrganique.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sous_categories_organique?.includes(option.value) || false}
                        onChange={(e) => {
                          const newSubTypes = e.target.checked
                            ? [...(formData.sous_categories_organique || []), option.value]
                            : (formData.sous_categories_organique || []).filter(item => item !== option.value)
                          setFormData(prev => ({ ...prev, sous_categories_organique: newSubTypes }))
                          if (!e.target.checked && option.value === 'autre_organique') {
                            setFormData(prev => ({ ...prev, autre_organique_precision: '' }))
                            if (validationErrors.autre_organique_precision) setValidationErrors(prev => ({ ...prev, autre_organique_precision: null }))
                          }
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-primary text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formData.sous_categories_organique?.includes('autre_organique') && (
                  <div>
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_organique_precision || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, autre_organique_precision: e.target.value }))
                        if (validationErrors.autre_organique_precision) setValidationErrors(prev => ({ ...prev, autre_organique_precision: null }))
                      }}
                      className="w-full mt-2 px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {validationErrors.autre_organique_precision && <p className="text-danger text-sm mt-1">{validationErrors.autre_organique_precision}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Sous-catégories Plastique */}
            {formData.type_dechet?.includes('plastique') && (
              <div className="ml-7 mt-3 border-l-2 border-text-secondary/20 pl-3">
                <p className="text-text-secondary text-xs mb-2">Détails plastique :</p>
                <div className="space-y-2">
                  {sousCategoriesPlastique.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sous_categories_plastique?.includes(option.value) || false}
                        onChange={(e) => {
                          const newSubTypes = e.target.checked
                            ? [...(formData.sous_categories_plastique || []), option.value]
                            : (formData.sous_categories_plastique || []).filter(item => item !== option.value)
                          setFormData(prev => ({ ...prev, sous_categories_plastique: newSubTypes }))
                          if (!e.target.checked && option.value === 'autre_plastique') {
                            setFormData(prev => ({ ...prev, autre_plastique_precision: '' }))
                            if (validationErrors.autre_plastique_precision) setValidationErrors(prev => ({ ...prev, autre_plastique_precision: null }))
                          }
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-primary text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formData.sous_categories_plastique?.includes('autre_plastique') && (
                  <div>
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_plastique_precision || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, autre_plastique_precision: e.target.value }))
                        if (validationErrors.autre_plastique_precision) setValidationErrors(prev => ({ ...prev, autre_plastique_precision: null }))
                      }}
                      className="w-full mt-2 px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {validationErrors.autre_plastique_precision && <p className="text-danger text-sm mt-1">{validationErrors.autre_plastique_precision}</p>}
                  </div>
                )}
              </div>
            )}

            {/* Sous-catégories Inerte */}
            {formData.type_dechet?.includes('inerte') && (
              <div className="ml-7 mt-3 border-l-2 border-text-secondary/20 pl-3">
                <p className="text-text-secondary text-xs mb-2">Détails inerte :</p>
                <div className="space-y-2">
                  {sousCategoriesInerte.map(option => (
                    <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sous_categories_inerte?.includes(option.value) || false}
                        onChange={(e) => {
                          const newSubTypes = e.target.checked
                            ? [...(formData.sous_categories_inerte || []), option.value]
                            : (formData.sous_categories_inerte || []).filter(item => item !== option.value)
                          setFormData(prev => ({ ...prev, sous_categories_inerte: newSubTypes }))
                          if (!e.target.checked && option.value === 'autre_inerte') {
                            setFormData(prev => ({ ...prev, autre_inerte_precision: '' }))
                            if (validationErrors.autre_inerte_precision) setValidationErrors(prev => ({ ...prev, autre_inerte_precision: null }))
                          }
                        }}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-primary text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
                {formData.sous_categories_inerte?.includes('autre_inerte') && (
                  <div>
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_inerte_precision || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, autre_inerte_precision: e.target.value }))
                        if (validationErrors.autre_inerte_precision) setValidationErrors(prev => ({ ...prev, autre_inerte_precision: null }))
                      }}
                      className="w-full mt-2 px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                    {validationErrors.autre_inerte_precision && <p className="text-danger text-sm mt-1">{validationErrors.autre_inerte_precision}</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de fois par semaine jetez-vous les ordures ?</label>
            <input
              type="number"
              min="0"
              value={formData.ordures_frequence_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, ordures_frequence_semaine: e.target.value }))
                if (validationErrors.ordures_frequence_semaine) setValidationErrors(prev => ({ ...prev, ordures_frequence_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.ordures_frequence_semaine && <p className="text-danger text-sm mt-1">{validationErrors.ordures_frequence_semaine}</p>}
          </div>

          <div>
            <p className="text-text-secondary text-sm mb-2">Où jetez-vous les ordures ?</p>
            <div className="space-y-2">
              {eliminationOptions.map(option => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.elimination_ordures?.includes(option.value) || false}
                    onChange={(e) => {
                      const newElimination = e.target.checked
                        ? [...(formData.elimination_ordures || []), option.value]
                        : (formData.elimination_ordures || []).filter(item => item !== option.value)
                      setFormData(prev => ({ ...prev, elimination_ordures: newElimination }))
                    }}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModeDeVie