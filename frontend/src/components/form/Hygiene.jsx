function Hygiene({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors
}) {

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

  const handleCheckboxChange = (field, value) => {
    setFormData(prev => {
      const currentValues = Array.isArray(prev[field])
        ? prev[field]
        : []

      const newValues = currentValues.includes(value)
        ? currentValues.filter(item => item !== value)
        : [...currentValues, value]

      return {
        ...prev,
        [field]: newValues
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

      {/* Section produits chimiques et d'hygiène */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Produits chimiques et d'hygiène
        </h2>

        <div className="space-y-6">

          {/* Q51 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quels types de produits chimiques ou d'hygiène utilisez-vous régulièrement dans votre vie quotidienne ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="produits_chimiques_utilises"
                  value="savons_gels_douche"
                  checked={
                    Array.isArray(formData.produits_chimiques_utilises) &&
                    formData.produits_chimiques_utilises.includes('savons_gels_douche')
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'produits_chimiques_utilises',
                      'savons_gels_douche'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Savons et gels douche
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="produits_chimiques_utilises"
                  value="cosmetiques"
                  checked={
                    Array.isArray(formData.produits_chimiques_utilises) &&
                    formData.produits_chimiques_utilises.includes('cosmetiques')
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'produits_chimiques_utilises',
                      'cosmetiques'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Produits cosmétiques (crèmes, parfums, déodorants)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="produits_chimiques_utilises"
                  value="nettoyage_domestique"
                  checked={
                    Array.isArray(formData.produits_chimiques_utilises) &&
                    formData.produits_chimiques_utilises.includes('nettoyage_domestique')
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'produits_chimiques_utilises',
                      'nettoyage_domestique'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Produits de nettoyage domestique (détergents, eau de javel)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="produits_chimiques_utilises"
                  value="pharmaceutiques"
                  checked={
                    Array.isArray(formData.produits_chimiques_utilises) &&
                    formData.produits_chimiques_utilises.includes('pharmaceutiques')
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'produits_chimiques_utilises',
                      'pharmaceutiques'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Produits pharmaceutiques / médicaments
                </span>
              </label>

            </div>

            {validationErrors.produits_chimiques_utilises && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.produits_chimiques_utilises}
              </p>
            )}
          </div>

          {/* Q52 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Lisez-vous systématiquement la composition chimique ou les étiquettes des produits d'entretien et cosmétiques avant achat ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lit_etiquettes_produits"
                  checked={formData.lit_etiquettes_produits === true}
                  onChange={() =>
                    setField('lit_etiquettes_produits', true)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lit_etiquettes_produits"
                  checked={formData.lit_etiquettes_produits === false}
                  onChange={() =>
                    setField('lit_etiquettes_produits', false)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.lit_etiquettes_produits && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.lit_etiquettes_produits}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Section chimie verte et durabilité */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Chimie verte et durabilité
        </h2>

        <div className="space-y-6">

          {/* Q53 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Connaissez-vous les 12 principes fondamentaux de la chimie verte (ex : prévention des déchets, réduction de la pollution) ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="connait_principes_chimie_verte"
                  checked={formData.connait_principes_chimie_verte === true}
                  onChange={() =>
                    setField('connait_principes_chimie_verte', true)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="connait_principes_chimie_verte"
                  checked={formData.connait_principes_chimie_verte === false}
                  onChange={() =>
                    setField('connait_principes_chimie_verte', false)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.connait_principes_chimie_verte && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.connait_principes_chimie_verte}
              </p>
            )}
          </div>

          {/* Q54 */}
          <div>
            <label className="block text-text-secondary mb-2">
              En tant qu'étudiant, pensez-vous que les procédés chimiques industriels, miniers et domestiques locaux appliquent suffisamment les concepts de durabilité ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="procedes_locaux_durables"
                  checked={formData.procedes_locaux_durables === true}
                  onChange={() =>
                    setField('procedes_locaux_durables', true)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="procedes_locaux_durables"
                  checked={formData.procedes_locaux_durables === false}
                  onChange={() =>
                    setField('procedes_locaux_durables', false)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.procedes_locaux_durables && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.procedes_locaux_durables}
              </p>
            )}
          </div>

          {/* Q55 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Seriez-vous favorable à la mise en place d'ateliers pratiques à l'ESPA pour synthétiser des produits d'entretien écologiques ou valoriser des co-produits locaux (ex : bac de déchets appropriés, assainissement d'eau propre et sale) ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="favorable_ateliers_ecologiques"
                  checked={formData.favorable_ateliers_ecologiques === true}
                  onChange={() =>
                    setField('favorable_ateliers_ecologiques', true)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="favorable_ateliers_ecologiques"
                  checked={formData.favorable_ateliers_ecologiques === false}
                  onChange={() =>
                    setField('favorable_ateliers_ecologiques', false)
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.favorable_ateliers_ecologiques && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.favorable_ateliers_ecologiques}
              </p>
            )}
          </div>

          {/* Q56 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Expliquez brièvement comment votre formation et vos compétences peuvent contribuer à réduire l'empreinte environnementale des industries et activités locales :
            </label>

            <textarea
              value={formData.contribution_formation_environnement}
              onChange={e =>
                setField(
                  'contribution_formation_environnement',
                  e.target.value
                )
              }
              rows={5}
              placeholder="Réponse libre"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {validationErrors.contribution_formation_environnement && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.contribution_formation_environnement}
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

export default Hygiene