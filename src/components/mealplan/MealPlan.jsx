import { useState } from 'react'
import { useMealPlan } from '../../hooks/useMealPlan.js'
import useAppStore from '../../store/appState.js'
import ToastNotification from '../shared/ToastNotification.jsx'

export default function MealPlan({ lang }) {
  const [activeDay, setActiveDay] = useState('pirmadienis')
  const [toast, setToast] = useState(null)
  const [showAdvice, setShowAdvice] = useState(false)
  const en = lang === 'en'

  const t = {
    title: en ? 'Meal Plan' : 'Mitybos planas',
    weeklyProgress: en ? 'Weekly Progress' : 'Savaitės progresas',
    avgKcal: en ? 'Avg kcal/day' : 'Vid. kcal/d.',
    days: en ? 'Days' : 'Dienos',
    accuracy: en ? 'Accuracy' : 'Tikslumas',
    trend: en ? 'Trend' : 'Tendencija',
    agentReady: en ? 'Agent Ready' : 'Agentas paruoštas',
    hasItems: (n) => en ? `You have ${n} items. Generating plan from your purchases.` : `Turite ${n} produktų. Generuojame planą pagal jūsų pirkinius.`,
    noItems: en ? 'Buy discounted items and the agent will automatically generate your meal plan.' : 'Nupirkite nuolaidų produktų ir agentas automatiškai sugeneruos mitybos planą.',
    generateBtn: en ? '🍽️ Generate meal plan' : '🍽️ Generuoti mitybos planą',
    generating: en ? 'Generating...' : 'Generuojama...',
    refresh: en ? '🔄 Refresh' : '🔄 Atnaujinti',
    dailyCalories: en ? 'Daily calories' : 'Dienos kalorijos',
    logMeal: en ? '✓ Log meal' : '✓ Užregistruoti valgymą',
    mealLogged: (kcal) => en ? `✅ Meal logged — ${kcal} kcal` : `✅ Patiekalas užregistruotas — ${kcal} kcal`,
    agentRec: en ? 'Agent Recommendations' : 'Agento rekomendacijos',
    loadingGaps: en ? 'Agent analyzing macro gaps...' : 'Agentas analizuoja trūkstamus makroelementus...',
    noRecs: en ? 'Click to get recommendations' : 'Spauskite norėdami gauti rekomendacijas',
    shoppingBtn: en ? '🛒 What else to buy this week?' : '🛒 Ką dar nusipirkti šią savaitę?',
    loadingAdvice: en ? '⏳ Loading...' : '⏳ Kraunama...',
    noDay: en ? 'No plan for this day' : 'Šiai dienai plano nėra',
  }

  const bmrData = useAppStore(state => state.bmrData)
  const groceryList = useAppStore(state => state.groceryList)

  const {
    mealPlan,
    isGenerating,
    error,
    gapFillers,
    shoppingAdvice,
    isLoadingGapFillers,
    isLoadingAdvice,
    DAYS,
    MEAL_TYPES,
    generatePlan,
    regeneratePlan,
    logMeal,
    fetchGapFillers,
    fetchShoppingAdvice,
    weeklyProgress,
  } = useMealPlan(lang)

  const dayPlan = mealPlan?.[activeDay]

  const getDayTotal = (day) => {
    if (!mealPlan?.[day]) return 0
    return Object.values(mealPlan[day])
      .filter(v => typeof v === 'object' && v.kcal)
      .reduce((sum, meal) => sum + (meal.kcal || 0), 0)
  }

  const handleLogMeal = (mealType, kcal) => {
    logMeal(activeDay, mealType, kcal)
    setToast({ message: t.mealLogged(kcal), type: 'success' })
  }

  const handleRegenerate = async () => {
    console.log('Regenerating with lang:', lang)
    await regeneratePlan()
  }

  return (
    <div className="flex flex-col gap-4 pb-24">

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
        {mealPlan && (
          <button
            onClick={handleRegenerate}
            disabled={isGenerating}
            className="text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white active:scale-95 transition-all"
          >
            {isGenerating ? '⏳' : t.refresh}
          </button>
        )}
      </div>

      {weeklyProgress.daysLogged > 0 && (
        <div className="bg-blue-50 rounded-2xl p-4">
          <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-2">
            {t.weeklyProgress}
          </p>
          <div className="flex gap-3">
            {[
              { value: weeklyProgress.avgDailyKcal, label: t.avgKcal },
              { value: weeklyProgress.daysLogged, label: t.days },
              { value: `${weeklyProgress.adherencePercent}%`, label: t.accuracy },
              { value: weeklyProgress.trend, label: t.trend },
            ].map(item => (
              <div key={item.label} className="flex-1 text-center">
                <p className="text-lg font-bold text-blue-700">{item.value}</p>
                <p className="text-xs text-blue-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!mealPlan && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-4xl mb-3">🤖</p>
          <p className="text-base font-semibold text-gray-900 mb-1">{t.agentReady}</p>
          <p className="text-sm text-gray-500 mb-4">
            {groceryList.length > 0 ? t.hasItems(groceryList.length) : t.noItems}
          </p>
          {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
          <button
            onClick={() => {
              console.log('Generate clicked with lang:', lang)
              generatePlan()
            }}
            disabled={isGenerating}
            className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all ${
              isGenerating ? 'bg-gray-100 text-gray-400' : 'bg-blue-600 text-white active:scale-95'
            }`}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                {t.generating}
              </span>
            ) : t.generateBtn}
          </button>
        </div>
      )}

      {mealPlan && (
        <>
          <div className="flex gap-1 overflow-x-auto pb-1">
            {DAYS.map(day => {
              const dayTotal = getDayTotal(day.key)
              const isActive = activeDay === day.key
              return (
                <button
                  key={day.key}
                  onClick={() => setActiveDay(day.key)}
                  className={`flex-shrink-0 flex flex-col items-center px-3 py-2 rounded-xl transition-all ${
                    isActive ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-100'
                  }`}
                >
                  <span className="text-xs font-semibold">{day.label}</span>
                  {dayTotal > 0 && (
                    <span className={`text-xs mt-0.5 ${isActive ? 'opacity-80' : 'text-gray-400'}`}>
                      {dayTotal}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          {dayPlan && (
            <div className="bg-white rounded-2xl p-4 border border-gray-100">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-medium text-gray-500">{t.dailyCalories}</p>
                <p className="text-xs font-bold text-gray-900">
                  {getDayTotal(activeDay)} / {bmrData.targetCalories} kcal
                </p>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min((getDayTotal(activeDay) / (bmrData.targetCalories || 1)) * 100, 100)}%`
                  }}
                />
              </div>
            </div>
          )}

          {dayPlan ? (
            <div className="flex flex-col gap-3">
              {MEAL_TYPES.map(meal => {
                const mealData = dayPlan[meal.key]
                if (!mealData) return null
                return (
                  <div key={meal.key} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{meal.emoji}</span>
                        <span className="text-sm font-semibold text-gray-900">{meal.label}</span>
                      </div>
                      <span className="text-xs font-bold text-blue-600">{mealData.kcal} kcal</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900 mb-2">{mealData.pavadinimas}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {mealData.ingredientai?.map((ing, i) => (
                          <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                            {ing}
                          </span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleLogMeal(meal.key, mealData.kcal)}
                        className="w-full py-2 bg-green-50 text-green-700 rounded-xl text-xs font-semibold active:scale-95 transition-all"
                      >
                        {t.logMeal}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
              <p className="text-sm text-gray-500">{t.noDay}</p>
            </div>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => {
                setShowAdvice(!showAdvice)
                if (!showAdvice && gapFillers.length === 0) fetchGapFillers()
              }}
              className="w-full flex justify-between items-center px-4 py-3"
            >
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span className="text-sm font-semibold text-gray-900">{t.agentRec}</span>
              </div>
              <span className="text-gray-400">{showAdvice ? '▲' : '▼'}</span>
            </button>

            {showAdvice && (
              <div className="px-4 pb-4 border-t border-gray-100">
                {isLoadingGapFillers ? (
                  <div className="flex items-center gap-2 py-3">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">{t.loadingGaps}</p>
                  </div>
                ) : gapFillers.length > 0 ? (
                  <div className="flex flex-col gap-2 mt-3">
                    {gapFillers.map((filler, i) => (
                      <div key={i} className="bg-blue-50 rounded-xl p-3">
                        <p className="text-sm font-medium text-blue-900">{filler.pavadinimas}</p>
                        <p className="text-xs text-blue-600 mt-0.5">{filler.aprasymas}</p>
                        <p className="text-xs text-blue-400 mt-1">{filler.kcal} kcal</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-400 py-3">{t.noRecs}</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={fetchShoppingAdvice}
            disabled={isLoadingAdvice}
            className="w-full py-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl text-sm font-medium active:scale-95 transition-all"
          >
            {isLoadingAdvice ? t.loadingAdvice : t.shoppingBtn}
          </button>

          {shoppingAdvice.length > 0 && (
            <div className="flex flex-col gap-2">
              {shoppingAdvice.map((advice, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100">
                  <div className="flex justify-between items-start">
                    <p className="text-sm font-semibold text-gray-900">{advice.produktas}</p>
                    <span className="text-xs text-green-600 font-medium">{advice.apytiksleCena}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{advice.priezastis}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                      📍 {advice.kurPirkti}
                    </span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                      {advice.makroNauda}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}