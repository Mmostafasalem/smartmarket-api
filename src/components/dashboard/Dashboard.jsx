import { useState } from 'react'
import useAppStore from '../../store/appState.js'
import DonutChart from '../shared/DonutChart.jsx'
import DealCard from '../shared/DealCard.jsx'
import ToastNotification from '../shared/ToastNotification.jsx'
import DealNotification from '../notifications/DealNotification.jsx'
import { useMarketDeals } from '../../hooks/useMarketDeals.js'
import { useMealPlan } from '../../hooks/useMealPlan.js'

export default function Dashboard({ onTabChange, lang }) {
  const user = useAppStore(state => state.user)
  const bmrData = useAppStore(state => state.bmrData)
  const [toast, setToast] = useState(null)
  const en = lang === 'en'

  const t = {
    greeting: (name) => {
      const hour = new Date().getHours()
      const g = hour < 12
        ? (en ? 'Good morning' : 'Labas rytas')
        : hour < 18
        ? (en ? 'Good afternoon' : 'Laba diena')
        : (en ? 'Good evening' : 'Labas vakaras')
      return `${g}, ${name} 👋`
    },
    goal: {
      lose: en ? 'Lose weight 🔥' : 'Numesti svorio 🔥',
      maintain: en ? 'Maintain weight ⚖️' : 'Išlaikyti svorį ⚖️',
      gain: en ? 'Gain muscle 💪' : 'Auginti raumenis 💪',
    },
    todayConsumed: en ? 'Today consumed' : 'Šiandien suvarta',
    of: en ? 'of' : 'iš',
    remaining: en ? 'Remaining' : 'Liko',
    protein: en ? 'Protein' : 'Baltymai',
    carbs: en ? 'Carbs' : 'Angl.',
    fat: en ? 'Fat' : 'Riebalai',
    newDeals: (n) => en ? `${n} new deals on your list!` : `${n} nauji pasiūlymai jūsų produktams!`,
    tapToView: en ? 'Tap to view deals' : 'Palieskite peržiūrėti nuolaidas',
    todayDeals: en ? "Today's deals for you" : 'Šiandien jūsų produktams',
    allDeals: en ? 'All deals →' : 'Visos nuolaidos →',
    noDeals: en ? 'No deals on your favorite items today' : 'Šiandien nuolaidų jūsų mėgstamiems produktams nėra',
    todayMeals: en ? "Today's meals" : 'Šiandienos mityba',
    fullPlan: en ? 'Full plan →' : 'Visas planas →',
    noMealPlan: en ? 'No meal plan yet' : 'Mitybos plano dar nėra',
    noMealPlanDesc: en ? 'Buy discounted items and the agent will build your plan automatically' : 'Nupirkite nuolaidų produktų ir agentas sugeneruos planą automatiškai',
    generateNow: en ? 'Generate now' : 'Generuoti dabar',
    generating: en ? 'Generating...' : 'Generuojama...',
    logMeal: en ? '+ Log' : '+ Užregistruoti',
    weeklyGroceries: en ? "This week's groceries" : 'Šios savaitės pirkiniai',
    agentGenerating: en ? 'items · Agent generating meal plan...' : 'produktai · Agentas generuoja mitybos planą...',
    added: (emoji) => en ? `${emoji} Added to grocery list!` : `${emoji} Pridėta į pirkinių sąrašą!`,
    kcal: 'kcal',
  }

  const {
    activeDeals,
    matchedDeals,
    notificationQueue,
    markAsBought,
    skipDeal,
    groceryList,
  } = useMarketDeals()

  const {
    mealPlan,
    isGenerating,
    generatePlan,
    DAYS,
    MEAL_TYPES,
    getTodayKcal,
    logMeal,
  } = useMealPlan(lang)

  const todayKcal = getTodayKcal()
  const targetKcal = bmrData.targetCalories || 0
  const currentNotif = notificationQueue[0] || null

  const handleBuy = (deal) => {
    markAsBought(deal)
    setToast({ message: t.added(deal.emoji), type: 'success' })
  }

  const handleSkip = (notifId) => {
    skipDeal(notifId)
  }

  const todayPlan = mealPlan
    ? mealPlan[DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]?.key]
    : null

  return (
    <div className="flex flex-col gap-4 pb-24">

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {currentNotif && (
        <DealNotification
          notification={currentNotif}
          onBuy={handleBuy}
          onSkip={handleSkip}
          lang={lang}
        />
      )}

      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-5 text-white">
        <p className="text-sm opacity-80">{t.greeting(user.name).split(',')[0]},</p>
        <h1 className="text-2xl font-bold mt-0.5">{user.name} 👋</h1>
        <p className="text-xs opacity-70 mt-1">{t.goal[user.goal] || ''}</p>

        <div className="flex items-center gap-6 mt-4">
          <DonutChart
            value={todayKcal}
            max={targetKcal}
            color="#ffffff"
            size={90}
            sublabel={t.kcal}
          />
          <div>
            <p className="text-xs opacity-70">{t.todayConsumed}</p>
            <p className="text-2xl font-bold">{todayKcal}</p>
            <p className="text-xs opacity-70">{t.of} {targetKcal} {t.kcal}</p>
            <p className="text-xs opacity-70 mt-2">{t.remaining}: {Math.max(0, targetKcal - todayKcal)} {t.kcal}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-4">
          {[
            { label: t.protein, value: bmrData.macros?.protein, unit: 'g' },
            { label: t.carbs, value: bmrData.macros?.carbs, unit: 'g' },
            { label: t.fat, value: bmrData.macros?.fat, unit: 'g' },
          ].map(macro => (
            <div key={macro.label} className="flex-1 bg-white bg-opacity-20 rounded-xl p-2 text-center">
              <p className="text-sm font-bold">{macro.value}{macro.unit}</p>
              <p className="text-xs opacity-70">{macro.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Notifications banner */}
      {notificationQueue.length > 0 && (
        <div
          className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex items-center gap-3 cursor-pointer"
          onClick={() => onTabChange('deals')}
        >
          <span className="text-2xl">🔔</span>
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">{t.newDeals(notificationQueue.length)}</p>
            <p className="text-xs text-amber-600">{t.tapToView}</p>
          </div>
          <span className="text-amber-400">›</span>
        </div>
      )}

      {/* Today's Deals */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.todayDeals}</p>
          <button onClick={() => onTabChange('deals')} className="text-xs text-blue-600 font-medium">
            {t.allDeals}
          </button>
        </div>

        {matchedDeals.length === 0 ? (
          <div className="bg-white rounded-2xl p-4 border border-gray-100 text-center">
            <p className="text-2xl mb-2">🛒</p>
            <p className="text-sm text-gray-500">{t.noDeals}</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {matchedDeals.slice(0, 2).map(deal => (
              <DealCard
                key={deal.id}
                deal={deal}
                onBuy={handleBuy}
                onSkip={() => {}}
                isBought={groceryList.some(i => i.id === deal.id)}
                lang={lang}
              />
            ))}
          </div>
        )}
      </div>

      {/* Today's Meals */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.todayMeals}</p>
          <button onClick={() => onTabChange('mealplan')} className="text-xs text-blue-600 font-medium">
            {t.fullPlan}
          </button>
        </div>

        {!mealPlan ? (
          <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
            <p className="text-3xl mb-2">🍽️</p>
            <p className="text-sm font-medium text-gray-700 mb-1">{t.noMealPlan}</p>
            <p className="text-xs text-gray-500 mb-3">{t.noMealPlanDesc}</p>
            <button
              onClick={generatePlan}
              disabled={isGenerating}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium active:scale-95 transition-all"
            >
              {isGenerating ? t.generating : t.generateNow}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {MEAL_TYPES.map(meal => {
              const mealData = todayPlan?.[meal.key]
              if (!mealData) return null
              return (
                <div key={meal.key} className="bg-white rounded-2xl p-3 border border-gray-100 flex items-center gap-3">
                  <span className="text-xl">{meal.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{mealData.pavadinimas}</p>
                    <p className="text-xs text-gray-400">{mealData.kcal} {t.kcal}</p>
                  </div>
                  <button
                    onClick={() => logMeal('today', meal.key, mealData.kcal)}
                    className="text-xs bg-green-50 text-green-600 font-medium px-3 py-1.5 rounded-xl"
                  >
                    {t.logMeal}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Grocery list summary */}
      {groceryList.length > 0 && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            {t.weeklyGroceries}
          </p>
          <div className="flex flex-wrap gap-2">
            {groceryList.map(item => (
              <span key={item.id} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">
                {item.emoji} {item.name.split(' ')[0]}
              </span>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {groceryList.length} {t.agentGenerating}
          </p>
        </div>
      )}
    </div>
  )
}