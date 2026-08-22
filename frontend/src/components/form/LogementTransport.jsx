function LogementTransport({ formData, setFormData, validationErrors, setValidationErrors }) {
  // Madagascar administrative divisions data
  const madagascarData = {
    regions: [
      { value: 'analamanga', label: 'Analamanga' },
      { value: 'vakinankaratra', label: 'Vakinankaratra' },
      { value: 'itasy', label: 'Itasy' },
      { value: 'bongolava', label: 'Bongolava' },
      { value: 'maevatanana', label: 'Maevatanana' },
      { value: 'antsiranana', label: 'Antsiranana' },
      { value: 'sava', label: 'Sava' },
      { value: 'sofia', label: 'Sofia' },
      { value: 'boeny', label: 'Boeny' },
      { value: 'betsiboka', label: 'Betsiboka' },
      { value: 'melaky', label: 'Melaky' },
      { value: 'alaotra_mangoro', label: 'Alaotra-Mangoro' },
      { value: 'atsinanana', label: 'Atsinanana' },
      { value: 'analanjirofo', label: 'Analanjirofo' },
      { value: 'amoron_i_mania', label: 'Amoron\'i Mania' },
      { value: 'haute_matsiatra', label: 'Haute Matsiatra' },
      { value: 'vatovavy_fitovinany', label: 'Vatovavy-Fitovinany' },
      { value: 'ihorombe', label: 'Ihorombe' },
      { value: 'atsimo_atsinanana', label: 'Atsimo-Atsinanana' },
      { value: 'androy', label: 'Androy' },
      { value: 'anosy', label: 'Anosy' },
      { value: 'atsimo_andrefana', label: 'Atsimo-Andrefana' },
      { value: 'menabe', label: 'Menabe' }
    ],
    districts: {
      'analamanga': [
        { value: 'antananarivo_renivohitra', label: 'Antananarivo Renivohitra' },
        { value: 'antananarivo_atsimondrano', label: 'Antananarivo Atsimondrano' },
        { value: 'antananarivo_avaradrano', label: 'Antananarivo Avaradrano' },
        { value: 'ambohidratrimo', label: 'Ambohidratrimo' },
        { value: 'andramasina', label: 'Andramasina' },
        { value: 'anjiazingona', label: 'Anjiazingona' },
        { value: 'ankazobe', label: 'Ankazobe' },
        { value: 'arivonimamo', label: 'Arivonimamo' },
        { value: 'manjakandriana', label: 'Manjakandriana' },
        { value: 'miantsoarivo', label: 'Miantsoarivo' },
        { value: 'tsarasaotra', label: 'Tsarasaotra' }
      ],
      'vakinankaratra': [
        { value: 'antsirabe_i', label: 'Antsirabe I' },
        { value: 'antsirabe_ii', label: 'Antsirabe II' },
        { value: 'ambatolampy', label: 'Ambatolampy' },
        { value: 'betafo', label: 'Betafo' },
        { value: 'faratsiho', label: 'Faratsiho' },
        { value: 'mandoto', label: 'Mandoto' },
        { value: 'soavinandriana', label: 'Soavinandriana' }
      ],
      'itasy': [
        { value: 'miarinarivo', label: 'Miarinarivo' },
        { value: 'arivonimamo', label: 'Arivonimamo' },
        { value: 'soavinandriana', label: 'Soavinandriana' },
        { value: 'tsiroanomandidy', label: 'Tsiroanomandidy' }
      ],
      'bongolava': [
        { value: 'tsiroanomandidy', label: 'Tsiroanomandidy' },
        { value: 'fenoarivo', label: 'Fenoarivo' }
      ],
      'maevatanana': [
        { value: 'maevatanana', label: 'Maevatanana' },
        { value: 'tsaratanana', label: 'Tsaratanana' }
      ],
      'antsiranana': [
        { value: 'antsiranana_i', label: 'Antsiranana I' },
        { value: 'antsiranana_ii', label: 'Antsiranana II' },
        { value: 'ambilobe', label: 'Ambilobe' },
        { value: 'ambanja', label: 'Ambanja' },
        { value: 'androka', label: 'Androka' }
      ],
      'sava': [
        { value: 'sambava', label: 'Sambava' },
        { value: 'androka', label: 'Androka' },
        { value: 'vohemar', label: 'Vohemar' }
      ],
      'sofia': [
        { value: 'antoanifotsy', label: 'Antoanifotsy' },
        { value: 'benamevina', label: 'Benamevina' },
        { value: 'mandritsara', label: 'Mandritsara' },
        { value: 'port_berge', label: 'Port-Bergé' }
      ],
      'boeny': [
        { value: 'mahajanga_i', label: 'Mahajanga I' },
        { value: 'mahajanga_ii', label: 'Mahajanga II' },
        { value: 'ambato_boeny', label: 'Ambato-Boeny' },
        { value: 'marovoay', label: 'Marovoay' },
        { value: 'mitsinjo', label: 'Mitsinjo' }
      ],
      'betsiboka': [
        { value: 'maevatanana', label: 'Maevatanana' },
        { value: 'kandreho', label: 'Kandreho' }
      ],
      'melaky': [
        { value: 'maintirano', label: 'Maintirano' },
        { value: 'antsalova', label: 'Antsalova' }
      ],
      'alaotra_mangoro': [
        { value: 'ambatondrazaka', label: 'Ambatondrazaka' },
        { value: 'amparafaravola', label: 'Amparafaravola' },
        { value: 'moramanga', label: 'Moramanga' }
      ],
      'atsinanana': [
        { value: 'toamasina_i', label: 'Toamasina I' },
        { value: 'toamasina_ii', label: 'Toamasina II' },
        { value: 'brickaville', label: 'Brickaville' },
        { value: 'vatomandry', label: 'Vatomandry' }
      ],
      'analanjirofo': [
        { value: 'fenerive_est', label: 'Fénérive Est' },
        { value: 'mananara_nord', label: 'Mananara Nord' },
        { value: 'maroantsetra', label: 'Maroantsetra' }
      ],
      'amoron_i_mania': [
        { value: 'ambatofinandrahana', label: 'Ambatofinandrahana' },
        { value: 'antsirabe_ii', label: 'Antsirabe II' },
        { value: 'fandriana', label: 'Fandriana' }
      ],
      'haute_matsiatra': [
        { value: 'fianarantsoa_i', label: 'Fianarantsoa I' },
        { value: 'fianarantsoa_ii', label: 'Fianarantsoa II' },
        { value: 'ambalavao', label: 'Ambalavao' },
        { value: 'ikalamavony', label: 'Ikalamavony' }
      ],
      'vatovavy_fitovinany': [
        { value: 'manakara', label: 'Manakara' },
        { value: 'mananjary', label: 'Mananjary' },
        { value: 'vohipeno', label: 'Vohipeno' }
      ],
      'ihorombe': [
        { value: 'ihosy', label: 'Ihosy' },
        { value: 'iakora', label: 'Iakora' }
      ],
      'atsimo_atsinanana': [
        { value: 'farafangana', label: 'Farafangana' },
        { value: 'vangaindrano', label: 'Vangaindrano' },
        { value: 'midongy', label: 'Midongy' }
      ],
      'androy': [
        { value: 'ambovombe', label: 'Ambovombe' },
        { value: 'beloha', label: 'Beloha' },
        { value: 'tsihombe', label: 'Tsihombe' }
      ],
      'anosy': [
        { value: 'taolagnaro', label: 'Taolagnaro' },
        { value: 'amboasary', label: 'Amboasary' }
      ],
      'atsimo_andrefana': [
        { value: 'toliara_i', label: 'Toliara I' },
        { value: 'toliara_ii', label: 'Toliara II' },
        { value: 'morombe', label: 'Morombe' },
        { value: 'sakaraha', label: 'Sakaraha' }
      ],
      'menabe': [
        { value: 'morondava', label: 'Morondava' },
        { value: 'miandrivazo', label: 'Miandrivazo' },
        { value: 'mahabo', label: 'Mahabo' }
      ]
    },
    communes: {
      // This would be extensive - for now, adding sample communes for major districts
      'antananarivo_renivohitra': [
        { value: 'antananarivo_1', label: 'Antananarivo 1er Arrondissement' },
        { value: 'antananarivo_2', label: 'Antananarivo 2ème Arrondissement' },
        { value: 'antananarivo_3', label: 'Antananarivo 3ème Arrondissement' },
        { value: 'antananarivo_4', label: 'Antananarivo 4ème Arrondissement' },
        { value: 'antananarivo_5', label: 'Antananarivo 5ème Arrondissement' },
        { value: 'antananarivo_6', label: 'Antananarivo 6ème Arrondissement' }
      ],
      'antananarivo_atsimondrano': [
        { value: 'antsirabe_1', label: 'Antsirabe 1er' },
        { value: 'antsirabe_2', label: 'Antsirabe 2ème' }
      ],
      'antananarivo_avaradrano': [
        { value: 'ambohimanga', label: 'Ambohimanga' },
        { value: 'ambohitrolomahitsy', label: 'Ambohitrolomahitsy' }
      ],
      'ambohidratrimo': [
        { value: 'ambohidratrimo', label: 'Ambohidratrimo' },
        { value: 'manjakandriana', label: 'Manjakandriana' }
      ],
      'antsirabe_i': [
        { value: 'antsirabe_centre', label: 'Antsirabe Centre' },
        { value: 'antsirabe_nord', label: 'Antsirabe Nord' },
        { value: 'antsirabe_sud', label: 'Antsirabe Sud' }
      ],
      'toamasina_i': [
        { value: 'toamasina_centre', label: 'Toamasina Centre' },
        { value: 'toamasina_nord', label: 'Toamasina Nord' },
        { value: 'toamasina_sud', label: 'Toamasina Sud' }
      ],
      'fianarantsoa_i': [
        { value: 'fianarantsoa_centre', label: 'Fianarantsoa Centre' },
        { value: 'fianarantsoa_nord', label: 'Fianarantsoa Nord' },
        { value: 'fianarantsoa_sud', label: 'Fianarantsoa Sud' }
      ],
      'mahajanga_i': [
        { value: 'mahajanga_centre', label: 'Mahajanga Centre' },
        { value: 'mahajanga_nord', label: 'Mahajanga Nord' },
        { value: 'mahajanga_sud', label: 'Mahajanga Sud' }
      ],
      'toliara_i': [
        { value: 'toliara_centre', label: 'Toliara Centre' },
        { value: 'toliara_nord', label: 'Toliara Nord' },
        { value: 'toliara_sud', label: 'Toliara Sud' }
      ]
    },
    cities: {
      // Sample cities for major communes
      'antananarivo_1': [
        { value: 'antananarivo', label: 'Antananarivo' }
      ],
      'antananarivo_2': [
        { value: 'antananarivo', label: 'Antananarivo' }
      ],
      'antananarivo_3': [
        { value: 'antananarivo', label: 'Antananarivo' }
      ],
      'antananarivo_4': [
        { value: 'antananarivo', label: 'Antananarivo' }
      ],
      'antananarivo_5': [
        { value: 'antananarivo', label: 'Antananarivo' }
      ],
      'antananarivo_6': [
        { value: 'antananarivo', label: 'Antananarivo' }
      ],
      'antsirabe_centre': [
        { value: 'antsirabe', label: 'Antsirabe' }
      ],
      'antsirabe_nord': [
        { value: 'antsirabe', label: 'Antsirabe' }
      ],
      'antsirabe_sud': [
        { value: 'antsirabe', label: 'Antsirabe' }
      ],
      'toamasina_centre': [
        { value: 'toamasina', label: 'Toamasina' }
      ],
      'toamasina_nord': [
        { value: 'toamasina', label: 'Toamasina' }
      ],
      'toamasina_sud': [
        { value: 'toamasina', label: 'Toamasina' }
      ],
      'fianarantsoa_centre': [
        { value: 'fianarantsoa', label: 'Fianarantsoa' }
      ],
      'fianarantsoa_nord': [
        { value: 'fianarantsoa', label: 'Fianarantsoa' }
      ],
      'fianarantsoa_sud': [
        { value: 'fianarantsoa', label: 'Fianarantsoa' }
      ],
      'mahajanga_centre': [
        { value: 'mahajanga', label: 'Mahajanga' }
      ],
      'mahajanga_nord': [
        { value: 'mahajanga', label: 'Mahajanga' }
      ],
      'mahajanga_sud': [
        { value: 'mahajanga', label: 'Mahajanga' }
      ],
      'toliara_centre': [
        { value: 'toliara', label: 'Toliara' }
      ],
      'toliara_nord': [
        { value: 'toliara', label: 'Toliara' }
      ],
      'toliara_sud': [
        { value: 'toliara', label: 'Toliara' }
      ]
    }
  }

  const transportOptions = [
    { value: 'pied', label: 'À pied' },
    { value: 'velo', label: 'Vélo' },
    { value: 'moto', label: 'Moto' },
    { value: 'voiture', label: 'Voiture' },
    { value: 'transport_commun', label: 'Transport en commun' },
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

  const handleRegionChange = (region) => {
    setFormData(prev => ({
      ...prev,
      region,
      district: '',
      commune: '',
      ville: ''
    }))
    if (validationErrors.region) setValidationErrors(prev => ({ ...prev, region: null }))
  }

  const handleDistrictChange = (district) => {
    setFormData(prev => ({
      ...prev,
      district,
      commune: '',
      ville: ''
    }))
    if (validationErrors.district) setValidationErrors(prev => ({ ...prev, district: null }))
  }

  const handleCommuneChange = (commune) => {
    setFormData(prev => ({
      ...prev,
      commune,
      ville: ''
    }))
    if (validationErrors.commune) setValidationErrors(prev => ({ ...prev, commune: null }))
  }

  const getDistricts = () => {
    return madagascarData.districts[formData.region] || []
  }

  const getCommunes = () => {
    return madagascarData.communes[formData.district] || []
  }

  const getCities = () => {
    return madagascarData.cities[formData.commune] || []
  }

  return (
    <div className="space-y-6">
      {/* Section 1: Logement à Cur Vontovorona */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Logement à Cur Vontovorona</h2>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.habite_cur_vontovorona}
              onChange={(e) => setFormData(prev => ({ ...prev, habite_cur_vontovorona: e.target.checked }))}
              className="w-4 h-4 text-primary"
            />
            <span className="text-text-primary">J'habite à Cur Vontovorona</span>
          </label>

          {formData.habite_cur_vontovorona && (
            <div className="ml-7 space-y-4">
              <div>
                <label className="block text-text-secondary mb-2">Type de logement</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="type_logement_cur"
                      value="colocation"
                      checked={formData.type_logement_cur === 'colocation'}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, type_logement_cur: e.target.value }))
                        if (validationErrors.type_logement_cur) setValidationErrors(prev => ({ ...prev, type_logement_cur: null }))
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">Colocation</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="type_logement_cur"
                      value="location"
                      checked={formData.type_logement_cur === 'location'}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, type_logement_cur: e.target.value }))
                        if (validationErrors.type_logement_cur) setValidationErrors(prev => ({ ...prev, type_logement_cur: null }))
                      }}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">Location</span>
                  </label>
                </div>
                {validationErrors.type_logement_cur && <p className="text-danger text-sm mt-2">{validationErrors.type_logement_cur}</p>}
              </div>

              {formData.type_logement_cur === 'colocation' && (
                <div>
                  <label className="block text-text-secondary mb-2">Combien de colocataires ?</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.nombre_coloc}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, nombre_coloc: e.target.value }))
                      if (validationErrors.nombre_coloc) setValidationErrors(prev => ({ ...prev, nombre_coloc: null }))
                    }}
                    className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {validationErrors.nombre_coloc && <p className="text-danger text-sm mt-1">{validationErrors.nombre_coloc}</p>}
                </div>
              )}

              {formData.type_logement_cur === 'location' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-text-secondary mb-2">Type de location</label>
                    <div className="space-y-2">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="type_location"
                          value="seul"
                          checked={formData.type_location === 'seul'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, type_location: e.target.value }))
                            if (validationErrors.type_location) setValidationErrors(prev => ({ ...prev, type_location: null }))
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-text-primary">Seul(e)</span>
                      </label>
                      <label className="flex items-center gap-3 cursor-pointer">
                        <input
                          type="radio"
                          name="type_location"
                          value="plusieurs"
                          checked={formData.type_location === 'plusieurs'}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, type_location: e.target.value }))
                            if (validationErrors.type_location) setValidationErrors(prev => ({ ...prev, type_location: null }))
                          }}
                          className="w-4 h-4 text-primary"
                        />
                        <span className="text-text-primary">Plusieurs personnes</span>
                      </label>
                    </div>
                    {validationErrors.type_location && <p className="text-danger text-sm mt-2">{validationErrors.type_location}</p>}
                  </div>

                  {formData.type_location === 'plusieurs' && (
                    <div>
                      <label className="block text-text-secondary mb-2">Combien de personnes ?</label>
                      <input
                        type="number"
                        min="0"
                        value={formData.nombre_personnes_location}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, nombre_personnes_location: e.target.value }))
                          if (validationErrors.nombre_personnes_location) setValidationErrors(prev => ({ ...prev, nombre_personnes_location: null }))
                        }}
                        className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {validationErrors.nombre_personnes_location && <p className="text-danger text-sm mt-1">{validationErrors.nombre_personnes_location}</p>}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Origine */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <div className="text-text-primary mb-4">
          <h2 className="text-lg font-semibold">Origine</h2>
          <p className="text-sm italic text-text-secondary">Où vos parents habitent</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Région</label>
            <select
              value={formData.region}
              onChange={(e) => handleRegionChange(e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionnez une région</option>
              {madagascarData.regions.map(region => (
                <option key={region.value} value={region.value}>{region.label}</option>
              ))}
            </select>
            {validationErrors.region && <p className="text-danger text-sm mt-1">{validationErrors.region}</p>}
          </div>

          {formData.region && (
            <div>
              <label className="block text-text-secondary mb-2">District</label>
              {getDistricts().length > 0 ? (
                <select
                  value={formData.district}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionnez un district</option>
                  {getDistricts().map(district => (
                    <option key={district.value} value={district.value}>{district.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.district}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, district: e.target.value }))
                    if (validationErrors.district) setValidationErrors(prev => ({ ...prev, district: null }))
                  }}
                  placeholder="Entrez le nom de votre district"
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
              {validationErrors.district && <p className="text-danger text-sm mt-1">{validationErrors.district}</p>}
            </div>
          )}

          {formData.district && (
            <div>
              <label className="block text-text-secondary mb-2">Commune</label>
              {getCommunes().length > 0 ? (
                <select
                  value={formData.commune}
                  onChange={(e) => handleCommuneChange(e.target.value)}
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionnez une commune</option>
                  {getCommunes().map(commune => (
                    <option key={commune.value} value={commune.value}>{commune.label}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={formData.commune}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, commune: e.target.value }))
                    if (validationErrors.commune) setValidationErrors(prev => ({ ...prev, commune: null }))
                  }}
                  placeholder="Entrez le nom de votre commune"
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
              )}
              {validationErrors.commune && <p className="text-danger text-sm mt-1">{validationErrors.commune}</p>}
            </div>
          )}

          {formData.commune && (
            <div>
              <label className="block text-text-secondary mb-2">Ville</label>
              <input
                type="text"
                value={formData.ville}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, ville: e.target.value }))
                  if (validationErrors.ville) setValidationErrors(prev => ({ ...prev, ville: null }))
                }}
                placeholder="Entrez le nom de votre ville"
                className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
              {validationErrors.ville && <p className="text-danger text-sm mt-1">{validationErrors.ville}</p>}
            </div>
          )}

          <div>
            <label className="block text-text-secondary mb-2">Quartier</label>
            <input
              type="text"
              value={formData.quartier}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, quartier: e.target.value }))
                if (validationErrors.quartier) setValidationErrors(prev => ({ ...prev, quartier: null }))
              }}
              placeholder="Ex: Antanimena"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.quartier && <p className="text-danger text-sm mt-1">{validationErrors.quartier}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Venez-vous d'Antananarivo ?</label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="venant_antananarivo"
                  value={true}
                  checked={formData.venant_antananarivo === true}
                  onChange={() => {
                    setFormData(prev => ({ ...prev, venant_antananarivo: true }))
                    if (validationErrors.venant_antananarivo) setValidationErrors(prev => ({ ...prev, venant_antananarivo: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Oui</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="venant_antananarivo"
                  value={false}
                  checked={formData.venant_antananarivo === false}
                  onChange={() => {
                    setFormData(prev => ({ ...prev, venant_antananarivo: false }))
                    if (validationErrors.venant_antananarivo) setValidationErrors(prev => ({ ...prev, venant_antananarivo: null }))
                  }}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-text-primary">Non</span>
              </label>
            </div>
            {validationErrors.venant_antananarivo && <p className="text-danger text-sm mt-2">{validationErrors.venant_antananarivo}</p>}
          </div>

          {formData.venant_antananarivo === false && (
            <div className="ml-7 space-y-4">
              <div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.famille_antananarivo}
                    onChange={(e) => setFormData(prev => ({ ...prev, famille_antananarivo: e.target.checked }))}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">J'ai de la famille à Antananarivo</span>
                </label>
                {validationErrors.famille_antananarivo && <p className="text-danger text-sm mt-2">{validationErrors.famille_antananarivo}</p>}
              </div>

              {formData.famille_antananarivo === true && (
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.habite_chez_famille_ville}
                      onChange={(e) => setFormData(prev => ({ ...prev, habite_chez_famille_ville: e.target.checked }))}
                      className="w-4 h-4 text-primary"
                    />
                    <span className="text-text-primary">J'habite chez ma famille en ville</span>
                  </label>
                  {validationErrors.habite_chez_famille_ville && <p className="text-danger text-sm mt-2">{validationErrors.habite_chez_famille_ville}</p>}
                </div>
              )}

              {formData.famille_antananarivo === true && formData.habite_chez_famille_ville === true && (
                <div className="space-y-4">
                  <label className="block text-text-secondary mb-2">Où habite votre famille ?</label>
                  
                  <div>
                    <label className="block text-text-secondary mb-2">District</label>
                    {getDistricts().length > 0 ? (
                      <select
                        value={formData.famille_district || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, famille_district: e.target.value, famille_commune: '', famille_ville: '' }))
                        }}
                        className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Sélectionnez un district</option>
                        {getDistricts().map(district => (
                          <option key={district.value} value={district.value}>{district.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={formData.famille_district || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, famille_district: e.target.value }))
                        }}
                        placeholder="Entrez le nom du district"
                        className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    )}
                  </div>

                  {formData.famille_district && (
                    <div>
                      <label className="block text-text-secondary mb-2">Commune</label>
                      {getCommunes().length > 0 ? (
                        <select
                          value={formData.famille_commune || ''}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, famille_commune: e.target.value, famille_ville: '' }))
                          }}
                          className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="">Sélectionnez une commune</option>
                          {getCommunes().map(commune => (
                            <option key={commune.value} value={commune.value}>{commune.label}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={formData.famille_commune || ''}
                          onChange={(e) => {
                            setFormData(prev => ({ ...prev, famille_commune: e.target.value }))
                          }}
                          placeholder="Entrez le nom de la commune"
                          className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      )}
                    </div>
                  )}

                  {formData.famille_commune && (
                    <div>
                      <label className="block text-text-secondary mb-2">Ville</label>
                      <input
                        type="text"
                        value={formData.famille_ville || ''}
                        onChange={(e) => {
                          setFormData(prev => ({ ...prev, famille_ville: e.target.value }))
                        }}
                        placeholder="Entrez le nom de la ville"
                        className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-text-secondary mb-2">Quartier</label>
                    <input
                      type="text"
                      value={formData.famille_quartier || ''}
                      onChange={(e) => {
                        setFormData(prev => ({ ...prev, famille_quartier: e.target.value }))
                        if (validationErrors.famille_habite) setValidationErrors(prev => ({ ...prev, famille_habite: null }))
                      }}
                      placeholder="Ex: Antanimena"
                      className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {validationErrors.famille_habite && <p className="text-danger text-sm mt-1">{validationErrors.famille_habite}</p>}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Transport */}
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Transport</h2>
        <div className="space-y-4">
          <div>
            <p className="text-text-secondary text-sm mb-3">Choisissez tous les modes de transport que vous utilisez</p>
            <div className="space-y-2">
              {transportOptions.map(option => (
                <label key={option.value} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.transport.includes(option.value)}
                    onChange={() => handleCheckboxChange('transport', option.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span className="text-text-primary">{option.label}</span>
                </label>
              ))}
            </div>
            {validationErrors.transport && <p className="text-danger text-sm mt-2">{validationErrors.transport}</p>}
            {formData.transport.includes('autre') && (
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Précisez votre mode de transport"
                  value={formData.autre_transport}
                  onChange={(e) => {
                    setFormData(prev => ({ ...prev, autre_transport: e.target.value }))
                    if (validationErrors.autre_transport) setValidationErrors(prev => ({ ...prev, autre_transport: null }))
                  }}
                  className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                />
                {validationErrors.autre_transport && <p className="text-danger text-sm mt-1">{validationErrors.autre_transport}</p>}
              </div>
            )}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de jours par semaine restez-vous à Cur ?</label>
            <input
              type="number"
              min="0"
              max="7"
              value={formData.jours_cur_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, jours_cur_semaine: e.target.value }))
                if (validationErrors.jours_cur_semaine) setValidationErrors(prev => ({ ...prev, jours_cur_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.jours_cur_semaine && <p className="text-danger text-sm mt-1">{validationErrors.jours_cur_semaine}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de jours par semaine restez-vous à la maison (pas à Cur) ?</label>
            <input
              type="number"
              min="0"
              max="7"
              value={formData.jours_maison_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, jours_maison_semaine: e.target.value }))
                if (validationErrors.jours_maison_semaine) setValidationErrors(prev => ({ ...prev, jours_maison_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.jours_maison_semaine && <p className="text-danger text-sm mt-1">{validationErrors.jours_maison_semaine}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien d'allers-retours par semaine entre votre maison et Cur ?</label>
            <input
              type="number"
              min="0"
              value={formData.allers_retours_semaine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, allers_retours_semaine: e.target.value }))
                if (validationErrors.allers_retours_semaine) setValidationErrors(prev => ({ ...prev, allers_retours_semaine: null }))
              }}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.allers_retours_semaine && <p className="text-danger text-sm mt-1">{validationErrors.allers_retours_semaine}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Combien de fois par mois retournez-vous dans votre ville d'origine ?</label>
            <input
              type="number"
              min="0"
              value={formData.frequence_retour_origine}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, frequence_retour_origine: e.target.value }))
                if (validationErrors.frequence_retour_origine) setValidationErrors(prev => ({ ...prev, frequence_retour_origine: null }))
              }}
              placeholder="Ex: 2"
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.frequence_retour_origine && <p className="text-danger text-sm mt-1">{validationErrors.frequence_retour_origine}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogementTransport