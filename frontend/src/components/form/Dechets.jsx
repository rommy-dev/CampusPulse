function Dechets({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors
}) {
  const handleChange = (field, value) => {
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
      const currentValues = prev[field] || []

      return {
        ...prev,
        [field]: currentValues.includes(value)
          ? currentValues.filter(item => item !== value)
          : [...currentValues, value]
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
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Production de déchets et gestion
        </h2>

        <div className="space-y-6">

          {/* Q57 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quels types de déchets produisez-vous le plus fréquemment sur le campus et dans votre logement ? (Plusieurs choix possibles) *
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.types_dechets_produits?.includes('organiques') || false
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'types_dechets_produits',
                      'organiques'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Déchets organiques (épluchures, restes alimentaires)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.types_dechets_produits?.includes('plastiques') || false
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'types_dechets_produits',
                      'plastiques'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Déchets plastiques (bouteilles d'eau, sachets « sakaosy », emballages)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.types_dechets_produits?.includes('papiers_cartons') || false
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'types_dechets_produits',
                      'papiers_cartons'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Papiers, cartons, polycopiés de cours
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.types_dechets_produits?.includes('canettes_verre') || false
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'types_dechets_produits',
                      'canettes_verre'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Canettes métalliques / verre
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    formData.types_dechets_produits?.includes('electroniques_toxiques') || false
                  }
                  onChange={() =>
                    handleCheckboxChange(
                      'types_dechets_produits',
                      'electroniques_toxiques'
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Déchets électroniques et toxiques (piles, câbles, chargeurs, ampoules)
                </span>
              </label>
            </div>

            {validationErrors.types_dechets_produits && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.types_dechets_produits}
              </p>
            )}
          </div>

          {/* Q58 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Utilisez-vous des contenants réutilisables (gourde, bouteille réutilisable, sac en tissu/raphia, stylos rechargeables) pour vos achats ? *
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="utilise_contenants_reutilisables"
                  value="toujours"
                  checked={
                    formData.utilise_contenants_reutilisables === 'toujours'
                  }
                  onChange={e =>
                    handleChange(
                      'utilise_contenants_reutilisables',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Toujours</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="utilise_contenants_reutilisables"
                  value="souvent"
                  checked={
                    formData.utilise_contenants_reutilisables === 'souvent'
                  }
                  onChange={e =>
                    handleChange(
                      'utilise_contenants_reutilisables',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Souvent</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="utilise_contenants_reutilisables"
                  value="parfois"
                  checked={
                    formData.utilise_contenants_reutilisables === 'parfois'
                  }
                  onChange={e =>
                    handleChange(
                      'utilise_contenants_reutilisables',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Parfois</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="utilise_contenants_reutilisables"
                  value="jamais"
                  checked={
                    formData.utilise_contenants_reutilisables === 'jamais'
                  }
                  onChange={e =>
                    handleChange(
                      'utilise_contenants_reutilisables',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Jamais</span>
              </label>
            </div>

            {validationErrors.utilise_contenants_reutilisables && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.utilise_contenants_reutilisables}
              </p>
            )}
          </div>

          {/* Q59 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Pratiquez-vous le tri sélectif de vos déchets (séparation des plastiques, organiques, papiers) lorsque les infrastructures le permettent ou dans votre logement ? *
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pratique_tri_selectif"
                  value="oui_systematiquement"
                  checked={
                    formData.pratique_tri_selectif === 'oui_systematiquement'
                  }
                  onChange={e =>
                    handleChange(
                      'pratique_tri_selectif',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui, systématiquement
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pratique_tri_selectif"
                  value="parfois"
                  checked={
                    formData.pratique_tri_selectif === 'parfois'
                  }
                  onChange={e =>
                    handleChange(
                      'pratique_tri_selectif',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Parfois</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pratique_tri_selectif"
                  value="non_jamais"
                  checked={
                    formData.pratique_tri_selectif === 'non_jamais'
                  }
                  onChange={e =>
                    handleChange(
                      'pratique_tri_selectif',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Non, jamais</span>
              </label>
            </div>

            {validationErrors.pratique_tri_selectif && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.pratique_tri_selectif}
              </p>
            )}
          </div>

          {/* Q60 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Revendez-vous vos bouteilles en plastique vides ou vos métaux aux collecteurs informels locaux pour recyclage ? *
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="revend_bouteilles_metaux_collecteurs"
                  checked={
                    formData.revend_bouteilles_metaux_collecteurs === true
                  }
                  onChange={() =>
                    handleChange(
                      'revend_bouteilles_metaux_collecteurs',
                      true
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Oui</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="revend_bouteilles_metaux_collecteurs"
                  checked={
                    formData.revend_bouteilles_metaux_collecteurs === false
                  }
                  onChange={() =>
                    handleChange(
                      'revend_bouteilles_metaux_collecteurs',
                      false
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Non</span>
              </label>
            </div>

            {validationErrors.revend_bouteilles_metaux_collecteurs && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.revend_bouteilles_metaux_collecteurs}
              </p>
            )}
          </div>

          {/* Q61 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Où jetez-vous habituellement vos déchets quotidiens ? *
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lieu_elimination_dechets"
                  value="poubelle_publique_dediee"
                  checked={
                    formData.lieu_elimination_dechets ===
                    'poubelle_publique_dediee'
                  }
                  onChange={e =>
                    handleChange(
                      'lieu_elimination_dechets',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Dans une poubelle publique ou dédiée
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lieu_elimination_dechets"
                  value="par_terre_espaces_ouverts"
                  checked={
                    formData.lieu_elimination_dechets ===
                    'par_terre_espaces_ouverts'
                  }
                  onChange={e =>
                    handleChange(
                      'lieu_elimination_dechets',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Par terre / espaces ouverts (par manque de poubelles à proximité)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lieu_elimination_dechets"
                  value="incineration_brulement"
                  checked={
                    formData.lieu_elimination_dechets ===
                    'incineration_brulement'
                  }
                  onChange={e =>
                    handleChange(
                      'lieu_elimination_dechets',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Incinération / brûlage à l'air libre
                </span>
              </label>
            </div>

            {validationErrors.lieu_elimination_dechets && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.lieu_elimination_dechets}
              </p>
            )}
          </div>

          {/* Q62 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Savez-vous que la combustion à l'air libre des polymères plastiques et déchets émet des polluants toxiques (dioxines, furanes, COV) nocifs pour la santé et l'atmosphère ? *
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="connait_toxicite_combustion_plastiques"
                  checked={
                    formData.connait_toxicite_combustion_plastiques === true
                  }
                  onChange={() =>
                    handleChange(
                      'connait_toxicite_combustion_plastiques',
                      true
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Oui</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="connait_toxicite_combustion_plastiques"
                  checked={
                    formData.connait_toxicite_combustion_plastiques === false
                  }
                  onChange={() =>
                    handleChange(
                      'connait_toxicite_combustion_plastiques',
                      false
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Non</span>
              </label>
            </div>

            {validationErrors.connait_toxicite_combustion_plastiques && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.connait_toxicite_combustion_plastiques}
              </p>
            )}
          </div>

          {/* Q63 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Selon vous, existe-t-il suffisamment de poubelles adaptées et accessibles sur le campus de l'ESPA / CUR ? *
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="poubelles_suffisantes_campus"
                  value="oui_tout_a_fait"
                  checked={
                    formData.poubelles_suffisantes_campus ===
                    'oui_tout_a_fait'
                  }
                  onChange={e =>
                    handleChange(
                      'poubelles_suffisantes_campus',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui, tout à fait
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="poubelles_suffisantes_campus"
                  value="partiellement"
                  checked={
                    formData.poubelles_suffisantes_campus ===
                    'partiellement'
                  }
                  onChange={e =>
                    handleChange(
                      'poubelles_suffisantes_campus',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Partiellement
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="poubelles_suffisantes_campus"
                  value="non_insuffisant"
                  checked={
                    formData.poubelles_suffisantes_campus ===
                    'non_insuffisant'
                  }
                  onChange={e =>
                    handleChange(
                      'poubelles_suffisantes_campus',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non, pas du tout / Insuffisant
                </span>
              </label>
            </div>

            {validationErrors.poubelles_suffisantes_campus && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.poubelles_suffisantes_campus}
              </p>
            )}
          </div>

          {/* Q64 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Seriez-vous prêt(e) à participer activement à des actions de tri, de recyclage et de sensibilisation à l'environnement sur le campus ? *
            </label>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pret_a_participer_actions_environnementales"
                  value="oui_tout_a_fait_favorable"
                  checked={
                    formData.pret_a_participer_actions_environnementales ===
                    'oui_tout_a_fait_favorable'
                  }
                  onChange={e =>
                    handleChange(
                      'pret_a_participer_actions_environnementales',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui, tout à fait favorable
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pret_a_participer_actions_environnementales"
                  value="peut_etre"
                  checked={
                    formData.pret_a_participer_actions_environnementales ===
                    'peut_etre'
                  }
                  onChange={e =>
                    handleChange(
                      'pret_a_participer_actions_environnementales',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Peut-être / Selon les modalités
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="pret_a_participer_actions_environnementales"
                  value="non_peu_interesse"
                  checked={
                    formData.pret_a_participer_actions_environnementales ===
                    'non_peu_interesse'
                  }
                  onChange={e =>
                    handleChange(
                      'pret_a_participer_actions_environnementales',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non, peu intéressé(e)
                </span>
              </label>
            </div>

            {validationErrors.pret_a_participer_actions_environnementales && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.pret_a_participer_actions_environnementales}
              </p>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dechets