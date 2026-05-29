import { getFullBMRProfile } from '../../logic/bmr.js'

export default function Step5Results({ data, onUpdate, onFinish, onBack, lang }) {
  const en = lang === 'en'
  const bmr = getFullBMRProfile(data)

  const t = {
    title: en ? 'Your Results 🎯' : 'Jūsų rezultatai 🎯',
    subtitle: en ? 'Choose your goal' : 'Pasirinkite savo tikslą',
    bmrLabel: en ? 'Basal Metabolic Rate' : 'Bazinis medžiagų apykaitos greitis',
    kcalDay: en ? 'kcal / day' : 'kcal / dieną',
    tdeeLabel: en ? 'Total Daily Energy Expenditure (TDEE)' : 'Bendras energijos poreikis (TDEE)',
    macrosLabel: en ? 'Daily macro targets' : 'Makroelementai per dieną',
    protein: en ? 'Protein' : 'Baltymai',
    carbs: en ? 'Carbs' : 'Angliavandeniai',
    fat: en ? 'Fat' : 'Riebalai',
    back: en ? '← Back' : '← Atgal',
    start: en ? 'Start →' : 'Pradėti →',
  }

  const goals = [
    {
      value: 'lose',
      label: en ? 'Lose Weight' : 'Numesti svorio',
      emoji: '🔥',
      calories: bmr.loseCalories,
      description: en ? '-350 kcal/day deficit' : '-350 kcal/dieną',
      color: 'orange',
    },
    {
      value: 'maintain',
      label: en ? 'Maintain Weight' : 'Išlaikyti svorį',
      emoji: '⚖️',
      calories: bmr.maintainCalories,
      description: en ? 'Stay at current weight' : 'Stabilus svoris',
      color: 'blue',
    },
    {
      value: 'gain',
      label: en ? 'Gain Muscle' : 'Auginti raumenis',
      emoji: '💪',
      calories: bmr.gainCalories,
      description: en ? '+350 kcal/day surplus' : '+350 kcal/dieną',
      color: 'green',
    },
  ]

  const selectedGoal = goals.find(g => g.value === data.goal)
  const macros = selectedGoal ? {
    protein: Math.round((selectedGoal.calories * 0.30) / 4),
    carbs: Math.round((selectedGoal.calories * 0.45) / 4),
    fat: Math.round((selectedGoal.calories * 0.25) / 9),
  } : null

  const colorMap = {
    orange: { border: 'border-orange-400', bg: 'bg-orange-50', text: 'text-orange-700', badge: 'bg-orange-100 text-orange-700' },
    blue: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700' },
    green: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', badge: 'bg-green-100 text-green-700' },
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl p-5 text-white">
        <p className="text-xs font-medium opacity-70 uppercase tracking-wide mb-1">{t.bmrLabel}</p>
        <p className="text-5xl font-bold">{bmr.bmr}</p>
        <p className="text-sm opacity-80 mt-1">{t.kcalDay}</p>
        <div className="mt-3 pt-3 border-t border-white border-opacity-20">
          <p className="text-xs opacity-70">{t.tdeeLabel}</p>
          <p className="text-2xl font-semibold">{bmr.tdee} kcal</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {goals.map(goal => {
          const colors = colorMap[goal.color]
          const isSelected = data.goal === goal.value
          return (
            <button
              key={goal.value}
              onClick={() => onUpdate({ goal: goal.value })}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                isSelected ? `${colors.border} ${colors.bg}` : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{goal.emoji}</span>
                  <div>
                    <p className={`text-sm font-semibold ${isSelected ? colors.text : 'text-gray-900'}`}>
                      {goal.label}
                    </p>
                    <p className="text-xs text-gray-500">{goal.description}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                  isSelected ? colors.badge : 'bg-gray-100 text-gray-600'
                }`}>
                  {goal.calories} kcal
                </div>
              </div>
            </button>
          )
        })}
      </div>

      {macros && (
        <div className="bg-gray-50 rounded-2xl p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{t.macrosLabel}</p>
          <div className="flex gap-3">
            <div className="flex-1 text-center bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-lg font-bold text-blue-600">{macros.protein}g</p>
              <p className="text-xs text-gray-500">{t.protein}</p>
            </div>
            <div className="flex-1 text-center bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-lg font-bold text-amber-600">{macros.carbs}g</p>
              <p className="text-xs text-gray-500">{t.carbs}</p>
            </div>
            <div className="flex-1 text-center bg-white rounded-xl p-3 border border-gray-100">
              <p className="text-lg font-bold text-green-600">{macros.fat}g</p>
              <p className="text-xs text-gray-500">{t.fat}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">
          {t.back}
        </button>
        <button
          onClick={onFinish}
          disabled={!data.goal}
          className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
            data.goal ? 'bg-blue-600 text-white active:scale-95' : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          {t.start}
        </button>
      </div>
    </div>
  )
}