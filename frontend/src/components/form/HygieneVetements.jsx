function HygieneVetements({ formData, setFormData, validationErrors, setValidationErrors }) {
  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Hygiène</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.douche_quotidienne}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, douche_quotidienne: e.target.checked }))
                if (validationErrors.douche_frequence) setValidationErrors(prev => ({ ...prev, douche_frequence: null }))
              }}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Je prends une douche quotidienne</span>
          </label>
          {formData.douche_quotidienne && (
            <div className="ml-7">
              <label className="block text-text-secondary mb-2">Nombre de douches par semaine</label>
              <input
                type="number"
                min="0"
                value={formData.douche_frequence}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, douche_frequence: e.target.value }))
                  if (validationErrors.douche_frequence) setValidationErrors(prev => ({ ...prev, douche_frequence: null }))
                }}
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.douche_frequence && <p className="text-danger text-sm mt-1">{validationErrors.douche_frequence}</p>}
            </div>
          )}
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.eau_bouillir}
              onChange={(e) => setFormData(prev => ({ ...prev, eau_bouillir: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">Je fais bouillir l'eau pour me laver</span>
          </label>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Vêtements</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Estimation du nombre de tenues différentes utilisées par semaine</label>
            <input
              type="number"
              min="0"
              value={formData.vetements_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, vetements_semaine: e.target.value }))
                if (validationErrors.vetements_semaine) setValidationErrors(prev => ({ ...prev, vetements_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.vetements_semaine && <p className="text-danger text-sm mt-1">{validationErrors.vetements_semaine}</p>}
          </div>
          <div>
            <label className="block text-text-secondary mb-2">Nombre de tenues à laver ou à repasser par semaine</label>
            <input
              type="number"
              min="0"
              value={formData.vetements_laver_repasser}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, vetements_laver_repasser: e.target.value }))
                if (validationErrors.vetements_laver_repasser) setValidationErrors(prev => ({ ...prev, vetements_laver_repasser: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.vetements_laver_repasser && <p className="text-danger text-sm mt-1">{validationErrors.vetements_laver_repasser}</p>}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Soins capillaires</h2>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.brushing_utilise}
              onChange={(e) => setFormData(prev => ({ ...prev, brushing_utilise: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">J'utilise un brushing</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.lissage_utilise}
              onChange={(e) => setFormData(prev => ({ ...prev, lissage_utilise: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">J'utilise un lissage</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default HygieneVetements