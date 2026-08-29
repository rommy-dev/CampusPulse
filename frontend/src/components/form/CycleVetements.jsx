function CycleVetements({
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

  return (
    <div className="space-y-6">

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Cycle de vie des vêtements et textiles
        </h2>

        <div className="space-y-6">

          {/* Q42 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Combien de tenues vestimentaires différentes utilisez-vous au cours d'une même semaine ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="nombre_tenues_semaine"
                  value="1_3"
                  checked={formData.nombre_tenues_semaine === '1_3'}
                  onChange={e => handleChange('nombre_tenues_semaine', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  1 à 3 tenues
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="nombre_tenues_semaine"
                  value="4_6"
                  checked={formData.nombre_tenues_semaine === '4_6'}
                  onChange={e => handleChange('nombre_tenues_semaine', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  4 à 6 tenues
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="nombre_tenues_semaine"
                  value="7_plus"
                  checked={formData.nombre_tenues_semaine === '7_plus'}
                  onChange={e => handleChange('nombre_tenues_semaine', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  7 tenues ou plus
                </span>
              </label>

            </div>

            {validationErrors.nombre_tenues_semaine && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.nombre_tenues_semaine}
              </p>
            )}
          </div>

          {/* Q43 */}
          <div>
            <label className="block text-text-secondary mb-2">
              À quelle fréquence renouvelez-vous vos vêtements ou achetez-vous de nouveaux habillements ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequence_renouvellement_vetements"
                  value="plusieurs_fois_an"
                  checked={formData.frequence_renouvellement_vetements === 'plusieurs_fois_an'}
                  onChange={e => handleChange('frequence_renouvellement_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Plusieurs fois par an
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequence_renouvellement_vetements"
                  value="une_fois_an"
                  checked={formData.frequence_renouvellement_vetements === 'une_fois_an'}
                  onChange={e => handleChange('frequence_renouvellement_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Une fois par an
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequence_renouvellement_vetements"
                  value="2_3_ans"
                  checked={formData.frequence_renouvellement_vetements === '2_3_ans'}
                  onChange={e => handleChange('frequence_renouvellement_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Tous les 2 à 3 ans
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="frequence_renouvellement_vetements"
                  value="usure_necessite"
                  checked={formData.frequence_renouvellement_vetements === 'usure_necessite'}
                  onChange={e => handleChange('frequence_renouvellement_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Uniquement en cas d'usure ou nécessité absolue
                </span>
              </label>

            </div>

            {validationErrors.frequence_renouvellement_vetements && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.frequence_renouvellement_vetements}
              </p>
            )}
          </div>

          {/* Q44 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Achetez-vous des vêtements neufs fréquemment ou privilégiez-vous la seconde main (friperie) et le troc entre étudiants ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="origine_achat_vetements"
                  value="neuf"
                  checked={formData.origine_achat_vetements === 'neuf'}
                  onChange={e => handleChange('origine_achat_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Principalement du neuf
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="origine_achat_vetements"
                  value="seconde_main"
                  checked={formData.origine_achat_vetements === 'seconde_main'}
                  onChange={e => handleChange('origine_achat_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Principalement de la seconde main (friperie / troc)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="origine_achat_vetements"
                  value="mixte"
                  checked={formData.origine_achat_vetements === 'mixte'}
                  onChange={e => handleChange('origine_achat_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Mixte selon les besoins
                </span>
              </label>

            </div>

            {validationErrors.origine_achat_vetements && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.origine_achat_vetements}
              </p>
            )}
          </div>

          {/* Q45 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Possédez-vous des vêtements confectionnés à base de fibres naturelles locales (coton malgache, soie sauvage landy, raphia, sisal) ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="possede_fibres_naturelles_locales"
                  checked={formData.possede_fibres_naturelles_locales === true}
                  onChange={() => handleChange('possede_fibres_naturelles_locales', true)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="possede_fibres_naturelles_locales"
                  checked={formData.possede_fibres_naturelles_locales === false}
                  onChange={() => handleChange('possede_fibres_naturelles_locales', false)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.possede_fibres_naturelles_locales && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.possede_fibres_naturelles_locales}
              </p>
            )}
          </div>

          {/* Q46 */}
          <div>
            <label className="block text-text-secondary mb-2">
              À quelle fréquence lavez-vous vos vêtements et comment effectuez-vous vos lessives ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="methode_lavage_vetements"
                  value="lavage_main"
                  checked={formData.methode_lavage_vetements === 'lavage_main'}
                  onChange={e => handleChange('methode_lavage_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Lavage à la main (eau froide / tiède) après chaque utilisation ou tous les 2-3 ports
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="methode_lavage_vetements"
                  value="machine"
                  checked={formData.methode_lavage_vetements === 'machine'}
                  onChange={e => handleChange('methode_lavage_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Utilisation d'une machine à laver domestique / semi-automatique
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="methode_lavage_vetements"
                  value="laverie_externe"
                  checked={formData.methode_lavage_vetements === 'laverie_externe'}
                  onChange={e => handleChange('methode_lavage_vetements', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Service de laverie externe
                </span>
              </label>

            </div>

            {validationErrors.methode_lavage_vetements && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.methode_lavage_vetements}
              </p>
            )}
          </div>

          {/* Q47 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Utilisez-vous des lessives écologiques ou biodégradables n'altérant pas les nappes phréatiques et sols locaux ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lessive_ecologique_utilisee"
                  checked={formData.lessive_ecologique_utilisee === true}
                  onChange={() => handleChange('lessive_ecologique_utilisee', true)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="lessive_ecologique_utilisee"
                  checked={formData.lessive_ecologique_utilisee === false}
                  onChange={() => handleChange('lessive_ecologique_utilisee', false)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.lessive_ecologique_utilisee && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.lessive_ecologique_utilisee}
              </p>
            )}
          </div>

          {/* Q48 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Faites-vous sécher votre linge à l'extérieur (soleil et vent naturels de Vontovorona) plutôt qu'en sèche-linge électrique ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sechage_exterieur"
                  checked={formData.sechage_exterieur === true}
                  onChange={() => handleChange('sechage_exterieur', true)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="sechage_exterieur"
                  checked={formData.sechage_exterieur === false}
                  onChange={() => handleChange('sechage_exterieur', false)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.sechage_exterieur && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.sechage_exterieur}
              </p>
            )}
          </div>

          {/* Q49 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Réparez-vous vos vêtements abîmés (recoudre, rapiécer) ou les confiez-vous à un tailleur local ? *
            </label>

            <div className="flex gap-6">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repare_vetements"
                  checked={formData.repare_vetements === true}
                  onChange={() => handleChange('repare_vetements', true)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Oui
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="repare_vetements"
                  checked={formData.repare_vetements === false}
                  onChange={() => handleChange('repare_vetements', false)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Non
                </span>
              </label>

            </div>

            {validationErrors.repare_vetements && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.repare_vetements}
              </p>
            )}
          </div>

          {/* Q50 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Que faites-vous principalement de vos vêtements usagés ou dont vous ne vous servez plus ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="devenir_vetements_usages"
                  value="dons"
                  checked={formData.devenir_vetements_usages === 'dons'}
                  onChange={e => handleChange('devenir_vetements_usages', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Je les donne à des proches ou à des associations caritatives
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="devenir_vetements_usages"
                  value="revente"
                  checked={formData.devenir_vetements_usages === 'revente'}
                  onChange={e => handleChange('devenir_vetements_usages', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Je les revends d'occasion (fripes / ventes en ligne)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="devenir_vetements_usages"
                  value="reutilisation"
                  checked={formData.devenir_vetements_usages === 'reutilisation'}
                  onChange={e => handleChange('devenir_vetements_usages', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Je les transforme / réutilise (bricolage, chiffons, accessoires)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="devenir_vetements_usages"
                  value="jetes_brules"
                  checked={formData.devenir_vetements_usages === 'jetes_brules'}
                  onChange={e => handleChange('devenir_vetements_usages', e.target.value)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">
                  Je les jette avec les ordures ménagères ou les brûle à l'air libre
                </span>
              </label>

            </div>

            {validationErrors.devenir_vetements_usages && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.devenir_vetements_usages}
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

export default CycleVetements