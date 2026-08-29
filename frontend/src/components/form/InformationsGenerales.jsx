import { FILIERES, ANNEES_UNIVERSITAIRES } from '../../constants/filieres'

function InformationsGenerales({ formData, setFormData, validationErrors, setValidationErrors }) {

  const setField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (validationErrors[field]) setValidationErrors(prev => ({ ...prev, [field]: null }))
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Informations personnelles</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Date de naissance <span className="text-danger">*</span></label>
            <input
              type="date"
              value={formData.date_naissance}
              onChange={(e) => setField('date_naissance', e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {validationErrors.date_naissance && <p className="text-danger text-sm mt-1">{validationErrors.date_naissance}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Genre <span className="text-danger">*</span></label>
            <select
              value={formData.genre}
              onChange={(e) => setField('genre', e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner...</option>
              <option value="Masculin">Masculin</option>
              <option value="Féminin">Féminin</option>
            </select>
            {validationErrors.genre && <p className="text-danger text-sm mt-2">{validationErrors.genre}</p>}
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">
        <h2 className="text-lg font-semibold text-text-primary mb-4">Cursus à l'ESPA</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-text-secondary mb-2">Filière <span className="text-danger">*</span></label>
            <select
              value={formData.filiere}
              onChange={(e) => setField('filiere', e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner...</option>
              {FILIERES.map((groupe) => (
                <optgroup key={groupe.pole} label={groupe.pole}>
                  {groupe.options.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            {validationErrors.filiere && <p className="text-danger text-sm mt-2">{validationErrors.filiere}</p>}
          </div>

          <div>
            <label className="block text-text-secondary mb-2">Niveau universitaire <span className="text-danger">*</span></label>
            <select
              value={formData.annee_universitaire}
              onChange={(e) => setField('annee_universitaire', e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner...</option>
              {ANNEES_UNIVERSITAIRES.map((annee) => (
                <option key={annee} value={annee}>{annee}</option>
              ))}
            </select>
            {validationErrors.annee_universitaire && <p className="text-danger text-sm mt-2">{validationErrors.annee_universitaire}</p>}
          </div>
        </div>
      </div>

            <div className="bg-surface rounded-lg shadow-sm border border-text-secondary/10 p-4 md:p-6">

        <h2 className="text-lg font-semibold text-text-primary mb-4">
          Conditions de vie et financement
        </h2>

        <div className="space-y-4">

          {/* Q7 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Où résidez-vous principalement pendant l'année universitaire ?
              <span className="text-danger">*</span>
            </label>

            <select
              value={formData.residence_principale}
              onChange={(e) => setField('residence_principale', e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner...</option>
              <option value="Cité universitaire (CUR / Vontovorona)">
                Cité universitaire (CUR / Vontovorona)
              </option>
              <option value="Logement étudiant en colocation / location en ville">
                Logement étudiant en colocation / location en ville (Antananarivo / périphérie)
              </option>
              <option value="Chez vos parents ou en famille">
                Chez vos parents ou en famille
              </option>
              <option value="Foyer ou autre type de logement">
                Foyer ou autre type de logement
              </option>
            </select>

            {validationErrors.residence_principale && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.residence_principale}
              </p>
            )}
          </div>

          {/* Q8 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Si vous louez un logement, quel est le montant de votre loyer mensuel (charges comprises) ?
              <span className="text-danger">*</span>
            </label>

            <select
              value={formData.loyer_mensuel}
              onChange={(e) => setField('loyer_mensuel', e.target.value)}
              className="w-full px-3 py-2 border border-text-secondary/20 rounded-md bg-bg text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Sélectionner...</option>
              <option value="Je ne paie pas de loyer (logement familial / cité)">
                Je ne paie pas de loyer (logement familial / cité)
              </option>
              <option value="Moins de 50 000 Ar">
                Moins de 50 000 Ar
              </option>
              <option value="50 000 à 100 000 Ar">
                50 000 à 100 000 Ar
              </option>
              <option value="100 001 à 250 000 Ar">
                100 001 à 250 000 Ar
              </option>
              <option value="Plus de 250 000 Ar">
                Plus de 250 000 Ar
              </option>
            </select>

            {validationErrors.loyer_mensuel && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.loyer_mensuel}
              </p>
            )}
          </div>

          {/* Q9 */}
          <div>
            <label className="block text-text-secondary mb-2">
              Quelle est votre principale source de financement / revenus ?
              <span className="text-danger">*</span>
            </label>

            <div className="space-y-3">

              {[
                'Soutien financier familial',
                "Bourse d'études",
                'Emploi ou activité rémunérée / Freelance',
                'Économies personnelles',
              ].map((source) => (
                <label
                  key={source}
                  className="flex items-center gap-3 text-text-primary cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.source_financement?.includes(source) || false}
                    onChange={(e) => {
                      const currentSources = formData.source_financement || []

                      const updatedSources = e.target.checked
                        ? [...currentSources, source]
                        : currentSources.filter((item) => item !== source)

                      setField('source_financement', updatedSources)
                    }}
                    className="w-4 h-4 rounded border-text-secondary/20 text-primary focus:ring-primary"
                  />

                  <span>{source}</span>
                </label>
              ))}

            </div>

            {validationErrors.source_financement && (
              <p className="text-danger text-sm mt-2">
                {validationErrors.source_financement}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InformationsGenerales
