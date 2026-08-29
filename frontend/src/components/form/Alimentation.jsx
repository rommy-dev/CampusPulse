function Alimentation({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors
}) {
  const repasOptions = [
    { value: '1_repas', label: '1 repas' },
    { value: '2_repas', label: '2 repas' },
    { value: '3_repas_ou_plus', label: '3 repas ou plus' }
  ]

  const lieuRepasOptions = [
    {
      value: 'maison_cuisine',
      label: 'Préparés par vos soins à la maison / cuisine'
    },
    {
      value: 'gargote_restaurant',
      label: 'Gargote ou restaurant autour du campus'
    },
    {
      value: 'restaurant_universitaire',
      label: "Restaurant universitaire / cantine de l'ESPA"
    },
    {
      value: 'famille_parents',
      label: 'Chez la famille / parents'
    }
  ]

  const approvisionnementOptions = [
    {
      value: 'marche_local',
      label: 'Marché local (Vontovorona, Alasora, Antananarivo)'
    },
    {
      value: 'cantine_gargotes',
      label: 'Cantine universitaire / gargotes locales'
    },
    {
      value: 'maison_denrees_familiales',
      label: 'Préparé à la maison / denrées familiales'
    },
    {
      value: 'supermarches_produits_transformes',
      label: 'Supermarchés / produits transformés emballés'
    }
  ]

  const cuissonOptions = [
    {
      value: 'charbon_bois',
      label: 'Charbon de bois (Mangaoka)'
    },
    {
      value: 'gaz_butane',
      label: 'Gaz butane (réchaud)'
    },
    {
      value: 'electricite',
      label: 'Électricité (plaque, réchaud)'
    },
    {
      value: 'bois_chauffe',
      label: 'Bois de chauffe'
    },
    {
      value: 'ne_cuisine_pas',
      label: 'Je ne cuisine pas (restauration externe)'
    }
  ]

  const collationOptions = [
    { value: 'tous_les_jours', label: 'Tous les jours' },
    {
      value: 'plusieurs_fois_semaine',
      label: 'Plusieurs fois par semaine'
    },
    {
      value: 'occasionnellement',
      label: 'Occasionnellement'
    },
    {
      value: 'rarement_jamais',
      label: 'Rarement ou jamais'
    }
  ]

  const depenseAlimentationOptions = [
    { value: 'moins_2000', label: 'Moins de 2 000 Ar' },
    { value: '2000_4000', label: '2 000 à 4 000 Ar' },
    { value: '4001_6000', label: '4 001 à 6 000 Ar' },
    { value: 'plus_6000', label: 'Plus de 6 000 Ar' }
  ]

  const ouiNonOptions = [
    { value: 'oui', label: 'Oui' },
    { value: 'non', label: 'Non' }
  ]

  const equilibreOptions = [
    { value: 'oui_tout_a_fait', label: 'Oui, tout à fait' },
    {
      value: 'partiellement',
      label: 'Partiellement / Plutôt oui'
    },
    {
      value: 'non_pas_du_tout',
      label: 'Non, pas du tout'
    }
  ]

  const restesOptions = [
    {
      value: 'conserves',
      label: 'Conservés pour un autre repas'
    },
    {
      value: 'proches_donnes',
      label: 'Consommés par les proches / donnés'
    },
    {
      value: 'animaux_compostage',
      label: "Utilisés pour l'alimentation animale / compostage"
    },
    {
      value: 'ordures_menageres',
      label: 'Jetés avec les ordures ménagères'
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

  const renderRadioOptions = (field, options) => (
    <div className="space-y-2">
      {options.map(option => (
        <label
          key={option.value}
          className="flex items-center gap-3 cursor-pointer"
        >
          <input
            type="radio"
            name={field}
            value={option.value}
            checked={formData[field] === option.value}
            onChange={(e) => setField(field, e.target.value)}
            className="w-4 h-4 text-primary"
          />

          <span className="text-text-primary">
            {option.label}
          </span>
        </label>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">

      {/* Habitudes alimentaires */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Alimentation
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-text-secondary mb-2">
              Combien de repas principaux prenez-vous par jour en moyenne ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions('nombre_repas_jour', repasOptions)}

            {validationErrors.nombre_repas_jour && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.nombre_repas_jour}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Où prenez-vous généralement vos repas principaux en période de cours ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions('lieu_repas_principaux', lieuRepasOptions)}

            {validationErrors.lieu_repas_principaux && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.lieu_repas_principaux}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Quelle est la source principale d'approvisionnement de vos denrées alimentaires ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'source_approvisionnement_alimentaire',
              approvisionnementOptions
            )}

            {validationErrors.source_approvisionnement_alimentaire && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.source_approvisionnement_alimentaire}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Quelle énergie utilisez-vous principalement pour la cuisson de vos repas (si vous cuisinez vous-même) ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions('energie_cuisson', cuissonOptions)}

            {validationErrors.energie_cuisson && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.energie_cuisson}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Prenez-vous régulièrement un goûter ou une collation entre les repas ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'frequence_collation',
              collationOptions
            )}

            {validationErrors.frequence_collation && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.frequence_collation}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Combien dépensez-vous par jour en moyenne pour votre alimentation (repas et collations) ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'depense_alimentation_jour',
              depenseAlimentationOptions
            )}

            {validationErrors.depense_alimentation_jour && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.depense_alimentation_jour}
              </p>
            )}
          </div>

        </div>
      </div>

      {/* Composition et gestion de l'alimentation */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Consommation et gestion des aliments
        </h2>

        <div className="space-y-4">

          <div>
            <label className="block text-text-secondary mb-2">
              Mangez-vous de la viande (zébu, porc, volaille) ou du poisson à presque tous vos repas ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'consommation_viande_poisson',
              ouiNonOptions
            )}

            {validationErrors.consommation_viande_poisson && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.consommation_viande_poisson}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Consommez-vous régulièrement des fruits et légumes locaux de saison (sans pesticides de synthèse) ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'fruits_legumes_locaux_saison',
              ouiNonOptions
            )}

            {validationErrors.fruits_legumes_locaux_saison && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.fruits_legumes_locaux_saison}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Achetez-vous fréquemment des produits alimentaires emballés dans du plastique à usage unique (snacks, biscuits, boissons en bouteille PET) ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'produits_plastique_usage_unique',
              ouiNonOptions
            )}

            {validationErrors.produits_plastique_usage_unique && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.produits_plastique_usage_unique}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Considérez-vous que votre alimentation quotidienne est suffisamment équilibrée ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'alimentation_equilibree',
              equilibreOptions
            )}

            {validationErrors.alimentation_equilibree && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.alimentation_equilibree}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              Que faites-vous généralement des restes alimentaires ou épluchures lorsque vous en avez ?
              <span className="text-danger">*</span>
            </label>

            {renderRadioOptions(
              'gestion_restes_alimentaires',
              restesOptions
            )}

            {validationErrors.gestion_restes_alimentaires && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.gestion_restes_alimentaires}
              </p>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">
              En tant qu'étudiant, comment évaluez-vous l'impact de la chaîne d'approvisionnement alimentaire sur l'empreinte carbone locale ?
              <span className="text-danger">*</span>
            </label>

            <textarea
              value={formData.impact_chaine_approvisionnement || ''}
              onChange={(e) =>
                setField(
                  'impact_chaine_approvisionnement',
                  e.target.value
                )
              }
              rows={4}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              placeholder="Votre réponse..."
            />

            {validationErrors.impact_chaine_approvisionnement && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.impact_chaine_approvisionnement}
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

export default Alimentation