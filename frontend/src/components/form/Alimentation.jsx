function Alimentation({ formData, setFormData, validationErrors, setValidationErrors }) {
  const repasTypes = [
    { key: 'repas_maison', label: 'Repas à la maison', options: ['riz', 'legumes', 'viande', 'poisson', 'legumineuses', 'feculents', 'autre'] },
    { key: 'cantine', label: 'Cantine', options: ['menu_du_jour', 'sandwich', 'salade', 'plat_rapide', 'autre'] },
    { key: 'fast_food', label: 'Fast food', options: ['burger', 'pizza', 'frites', 'brochettes_grillades', 'autre'] },
    { key: 'repas_rue', label: 'Repas de rue', options: ['mofo_gasy', 'beignets', 'brochettes_rue', 'snacks_locaux', 'autre'] }
  ]

  const goutersOptions = [
    { value: 'fruits', label: 'Fruits' },
    { value: 'biscuits_sucres', label: 'Biscuits sucrés' },
    { value: 'snacks_sales', label: 'Snacks salés' },
    { value: 'rien', label: 'Je ne prends pas de goûter' },
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

  const handleRepasChange = (type, subOption) => {
    setFormData(prev => {
      const repas = { ...prev.repas }
      if (!repas[type]) {
        repas[type] = []
      }
      if (repas[type].includes(subOption)) {
        repas[type] = repas[type].filter(item => item !== subOption)
        if (repas[type].length === 0) delete repas[type]
      } else {
        repas[type] = [...repas[type], subOption]
      }
      return { ...prev, repas }
    })
    if (validationErrors.repas) {
      setValidationErrors(prev => ({ ...prev, repas: null }))
    }
  }

  const handleRepasTypeToggle = (type) => {
    setFormData(prev => {
      const repas = { ...prev.repas }
      if (repas[type]) {
        delete repas[type]
      } else {
        repas[type] = []
      }
      return { ...prev, repas }
    })
    if (validationErrors.repas) {
      setValidationErrors(prev => ({ ...prev, repas: null }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Repas</h2>
        <p className="text-text-secondary text-sm mb-4">Cochez les types de repas que vous consommez, puis précisez les options</p>
        
        <div className="space-y-4">
          {repasTypes.map(type => (
            <div key={type.key} className="border border-text-secondary/10 rounded-md p-3">
              <label className="flex items-center gap-3 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={!!formData.repas[type.key]}
                  onChange={() => handleRepasTypeToggle(type.key)}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary font-medium">{type.label}</span>
              </label>
              {formData.repas[type.key] && (
                <div className="ml-7 space-y-2">
                  {type.options.map(option => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.repas[type.key]?.includes(option)}
                        onChange={() => handleRepasChange(type.key, option)}
                        className="w-4 h-4 text-primary"
                      />
                      <span className="text-text-primary text-sm capitalize">{option.replace(/_/g, ' ')}</span>
                    </label>
                  ))}
                  {type.key === 'repas_maison' && formData.repas[type.key]?.includes('autre') && (
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_repas_maison}
                      onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_maison: e.target.value }))}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  )}
                  {type.key === 'cantine' && formData.repas[type.key]?.includes('autre') && (
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_repas_cantine}
                      onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_cantine: e.target.value }))}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  )}
                  {type.key === 'fast_food' && formData.repas[type.key]?.includes('autre') && (
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_repas_fast_food}
                      onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_fast_food: e.target.value }))}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  )}
                  {type.key === 'repas_rue' && formData.repas[type.key]?.includes('autre') && (
                    <input
                      type="text"
                      placeholder="Précisez"
                      value={formData.autre_repas_repas_rue}
                      onChange={(e) => setFormData(prev => ({ ...prev, autre_repas_repas_rue: e.target.value }))}
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                  )}
                </div>
              )}
            </div>
          ))}

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.repas.saute_repas}
              onChange={() => handleRepasTypeToggle('saute_repas')}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary font-medium">Je saute parfois des repas</span>
          </label>
        </div>
        {validationErrors.repas && <p className="text-danger text-sm mt-2">{validationErrors.repas}</p>}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Goûters</h2>
        <p className="text-text-secondary text-sm mb-3">Choisissez toutes les options qui s'appliquent</p>
        <div className="space-y-2">
          {goutersOptions.map(option => (
            <label key={option.value} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.gouters.includes(option.value)}
                onChange={() => handleCheckboxChange('gouters', option.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-text-primary">{option.label}</span>
            </label>
          ))}
        </div>
        {validationErrors.gouters && <p className="text-danger text-sm mt-2">{validationErrors.gouters}</p>}
        {formData.gouters.includes('autre') && (
          <div className="mt-4">
            <input
              type="text"
              placeholder="Précisez votre goûter"
              value={formData.autre_gouters}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, autre_gouters: e.target.value }))
                if (validationErrors.autre_gouters) setValidationErrors(prev => ({ ...prev, autre_gouters: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.autre_gouters && <p className="text-danger text-sm mt-1">{validationErrors.autre_gouters}</p>}
          </div>
        )}
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Café</h2>
        <label className="flex items-center gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={formData.cafe_boit}
            onChange={(e) => setFormData(prev => ({ ...prev, cafe_boit: e.target.checked }))}
            className="w-4 h-4 text-primary"
          />
          <span className="text-text-primary">Je bois du café</span>
        </label>
        {formData.cafe_boit && (
          <div className="ml-7">
            <label className="block text-text-secondary mb-2">Combien de fois par jour ?</label>
            <input
              type="number"
              min="0"
              value={formData.cafe_frequence_jour}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, cafe_frequence_jour: e.target.value }))
                if (validationErrors.cafe_frequence_jour) setValidationErrors(prev => ({ ...prev, cafe_frequence_jour: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.cafe_frequence_jour && <p className="text-danger text-sm mt-1">{validationErrors.cafe_frequence_jour}</p>}
          </div>
        )}
      </div>
    </div>
  )
}

export default Alimentation