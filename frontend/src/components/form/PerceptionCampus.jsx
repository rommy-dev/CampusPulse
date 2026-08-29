function PerceptionCampus({
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
          Perception et attentes pour le campus
        </h2>

        <div className="space-y-6">

          {/* Q65 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Pensez-vous que la production excessive de déchets et l'impact environnemental constituent un problème majeur pour l'ESPA et la commune de Vontovorona ? *
            </label>

            <div className="space-y-2">

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="perception_urgence_dechets"
                  value="urgent"
                  checked={formData.perception_urgence_dechets === 'urgent'}
                  onChange={e =>
                    handleChange(
                      'perception_urgence_dechets',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Oui, c'est un problème urgent
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="perception_urgence_dechets"
                  value="modere"
                  checked={formData.perception_urgence_dechets === 'modere'}
                  onChange={e =>
                    handleChange(
                      'perception_urgence_dechets',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  C'est un problème modéré
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="perception_urgence_dechets"
                  value="non_prioritaire"
                  checked={
                    formData.perception_urgence_dechets === 'non_prioritaire'
                  }
                  onChange={e =>
                    handleChange(
                      'perception_urgence_dechets',
                      e.target.value
                    )
                  }
                  className="w-4 h-4 text-primary"
                />

                <span className="text-text-primary">
                  Non, ce n'est pas une priorité
                </span>
              </label>

            </div>

            {validationErrors.perception_urgence_dechets && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.perception_urgence_dechets}
              </p>
            )}
          </div>

          {/* Q66 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quelles solutions ou améliorations concrètes prioriseriez-vous pour rendre l'ESPA plus propre, durable et éco-responsable ? (Gestion des déchets, eau, énergie, transport, sensibilisation...) *
            </label>

            <textarea
              value={formData.suggestions_amelioration_campus}
              onChange={e =>
                handleChange(
                  'suggestions_amelioration_campus',
                  e.target.value
                )
              }
              rows={5}
              placeholder="Réponse libre"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {validationErrors.suggestions_amelioration_campus && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.suggestions_amelioration_campus}
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  )
}

export default PerceptionCampus
