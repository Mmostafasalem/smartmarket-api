import { ALL_FOODS } from '../../data/vilniusMarkets.js'

export default function Step4Foods({ data, onUpdate, onNext, onBack, lang }) {
  const en = lang === 'en'
  const favorites = data.favoriteFoods || []

  const t = {
    title: en ? 'Favorite Foods' : 'Mėgstami produktai',
    subtitle: en ? 'Pick at least 5 foods — we\'ll alert you when they go on sale' : 'Pasirinkite bent 5 produktus — pranešime kai bus nuolaidos',
    selected: en ? 'selected' : 'pasirinkta',
    back: en ? '← Back' : '← Atgal',
    selectMore: (n) => en ? `Select ${n} more` : `Pasirinkite dar ${n}`,
    continue: en ? 'Continue →' : 'Tęsti →',
  }

  const categories = en ? [
    { key: 'protein', label: 'Proteins', emoji: '🥩' },
    { key: 'carbs', label: 'Carbohydrates', emoji: '🌾' },
    { key: 'vegetable', label: 'Vegetables', emoji: '🥦' },
    { key: 'fat', label: 'Fats', emoji: '🥑' },
  ] : [
    { key: 'protein', label: 'Baltymai', emoji: '🥩' },
    { key: 'carbs', label: 'Angliavandeniai', emoji: '🌾' },
    { key: 'vegetable', label: 'Daržovės', emoji: '🥦' },
    { key: 'fat', label: 'Riebalai', emoji: '🥑' },
  ]

  const toggleFood = (foodId) => {
    const exists = favorites.includes(foodId)
    onUpdate({
      favoriteFoods: exists
        ? favorites.filter(id => id !== foodId)
        : [...favorites, foodId]
    })
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {favorites.length} {t.selected}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
      </div>

      {categories.map(cat => (
        <div key={cat.key}>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            {cat.emoji} {cat.label}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ALL_FOODS.filter(f => f.category === cat.key).map(food => {
              const selected = favorites.includes(food.id)
              return (
                <button
                  key={food.id}
                  onClick={() => toggleFood(food.id)}
                  className={`relative p-3 rounded-2xl border-2 text-center transition-all ${
                    selected ? 'border-blue-500 bg-blue-50' : 'border-gray-100 bg-white'
                  }`}
                >
                  {selected && <span className="absolute top-1 right-1 text-xs">❤️</span>}
                  <div className="text-2xl mb-1">{food.emoji}</div>
                  <div className={`text-xs font-medium leading-tight ${
                    selected ? 'text-blue-700' : 'text-gray-700'
                  }`}>
                    {food.name}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="flex gap-3 mt-2">
        <button onClick={onBack} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">
          {t.back}
        </button>
        <button
          onClick={onNext}
          disabled={favorites.length < 5}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            favorites.length >= 5
              ? 'bg-blue-600 text-white active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {favorites.length < 5 ? t.selectMore(5 - favorites.length) : t.continue}
        </button>
      </div>
    </div>
  )
}