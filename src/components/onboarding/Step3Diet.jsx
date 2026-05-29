export default function Step3Diet({ data, onUpdate, onNext, onBack, lang }) {
    const en = lang === 'en'
  
    const t = {
      title: en ? 'Diet & Allergies' : 'Mityba ir alergijos',
      subtitle: en ? 'Select your dietary preferences' : 'Pasirinkite savo mitybos ypatybes',
      city: en ? 'City' : 'Miestas',
      cityPlaceholder: en ? 'e.g. Vilnius' : 'pvz. Vilnius',
      dietLabel: en ? 'Dietary preferences' : 'Mitybos pasirinkimai',
      allergyLabel: en ? 'Allergies' : 'Alergijos',
      continue: en ? 'Continue →' : 'Tęsti →',
      back: en ? '← Back' : '← Atgal',
    }
  
    const dietaryOptions = en ? [
      { value: 'be gliuteno', label: 'Gluten-free', emoji: '🌾' },
      { value: 'be laktozes', label: 'Lactose-free', emoji: '🥛' },
      { value: 'vegetariska', label: 'Vegetarian', emoji: '🥗' },
      { value: 'veganiska', label: 'Vegan', emoji: '🌱' },
      { value: 'halal', label: 'Halal', emoji: '☪️' },
      { value: 'keto', label: 'Keto', emoji: '🥑' },
      { value: 'be kiaulienos', label: 'No pork', emoji: '🐷' },
      { value: 'be jūros gėrybių', label: 'No shellfish', emoji: '🦐' },
    ] : [
      { value: 'be gliuteno', label: 'Be gliuteno', emoji: '🌾' },
      { value: 'be laktozes', label: 'Be laktozės', emoji: '🥛' },
      { value: 'vegetariska', label: 'Vegetariška', emoji: '🥗' },
      { value: 'veganiska', label: 'Veganiška', emoji: '🌱' },
      { value: 'halal', label: 'Halal', emoji: '☪️' },
      { value: 'keto', label: 'Keto', emoji: '🥑' },
      { value: 'be kiaulienos', label: 'Be kiaulienos', emoji: '🐷' },
      { value: 'be jūros gėrybių', label: 'Be jūros gėrybių', emoji: '🦐' },
    ]
  
    const allergies = en ? [
      { value: 'riesutai', label: 'Nuts', emoji: '🥜' },
      { value: 'kiausIniai', label: 'Eggs', emoji: '🥚' },
      { value: 'soja', label: 'Soy', emoji: '🫘' },
      { value: 'zuvis', label: 'Fish', emoji: '🐟' },
      { value: 'kvieciai', label: 'Wheat', emoji: '🌾' },
      { value: 'pienas', label: 'Dairy', emoji: '🥛' },
      { value: 'jokiu', label: 'No allergies', emoji: '✅' },
    ] : [
      { value: 'riesutai', label: 'Riešutai', emoji: '🥜' },
      { value: 'kiausIniai', label: 'Kiaušiniai', emoji: '🥚' },
      { value: 'soja', label: 'Soja', emoji: '🫘' },
      { value: 'zuvis', label: 'Žuvis', emoji: '🐟' },
      { value: 'kvieciai', label: 'Kviečiai', emoji: '🌾' },
      { value: 'pienas', label: 'Pienas', emoji: '🥛' },
      { value: 'jokiu', label: 'Jokių alergijų', emoji: '✅' },
    ]
  
    const toggleOption = (field, value) => {
      const current = data[field] || []
      if (value === 'jokiu') {
        onUpdate({ [field]: ['jokiu'] })
        return
      }
      const filtered = current.filter(v => v !== 'jokiu')
      const exists = filtered.includes(value)
      onUpdate({
        [field]: exists ? filtered.filter(v => v !== value) : [...filtered, value]
      })
    }
  
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>
  
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.city}</label>
          <input
            type="text"
            placeholder={t.cityPlaceholder}
            value={data.location || ''}
            onChange={e => onUpdate({ location: e.target.value })}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
        </div>
  
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.dietLabel}</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {dietaryOptions.map(option => {
              const selected = (data.dietaryOptions || []).includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => toggleOption('dietaryOptions', option.value)}
                  className={`px-3 py-2 rounded-full text-xs font-medium border transition-all ${
                    selected ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {option.emoji} {option.label}
                </button>
              )
            })}
          </div>
        </div>
  
        <div>
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.allergyLabel}</label>
          <div className="flex flex-wrap gap-2 mt-2">
            {allergies.map(option => {
              const selected = (data.allergies || []).includes(option.value)
              return (
                <button
                  key={option.value}
                  onClick={() => toggleOption('allergies', option.value)}
                  className={`px-3 py-2 rounded-full text-xs font-medium border transition-all ${
                    selected ? 'bg-red-100 text-red-700 border-red-300' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}
                >
                  {option.emoji} {option.label}
                </button>
              )
            })}
          </div>
        </div>
  
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">
            {t.back}
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold active:scale-95 transition-all"
          >
            {t.continue}
          </button>
        </div>
      </div>
    )
  }