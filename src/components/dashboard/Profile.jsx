import { useState } from 'react'
import useAppStore from '../../store/appState.js'
import { useUserProfile } from '../../hooks/useUserProfile.js'
import { formatShoppingList } from '../../logic/basketOptimizer.js'
import ToastNotification from '../shared/ToastNotification.jsx'

export default function Profile({ onReset, lang }) {
  const [toast, setToast] = useState(null)
  const [showShoppingList, setShowShoppingList] = useState(false)
  const en = lang === 'en'

  const t = {
    title: en ? 'Profile' : 'Profilis',
    personalInfo: en ? 'Personal Information' : 'Asmeninė informacija',
    age: en ? 'Age' : 'Amžius',
    weight: en ? 'Weight' : 'Svoris',
    height: en ? 'Height' : 'Ūgis',
    goalTitle: en ? 'Goal & Calories' : 'Tikslas ir kalorijų norma',
    goal: {
      lose: en ? '🔥 Lose weight' : '🔥 Numesti svorio',
      maintain: en ? '⚖️ Maintain weight' : '⚖️ Išlaikyti svorį',
      gain: en ? '💪 Gain muscle' : '💪 Auginti raumenis',
    },
    activity: {
      sedentary: en ? 'Sedentary' : 'Sėdimas gyvenimo būdas',
      lightly_active: en ? 'Lightly active' : 'Lengvai aktyvus',
      moderately_active: en ? 'Moderately active' : 'Vidutiniškai aktyvus',
      very_active: en ? 'Very active' : 'Labai aktyvus',
    },
    bmr: 'BMR',
    tdee: 'TDEE',
    protein: en ? 'Protein' : 'Baltymai',
    carbs: en ? 'Carbs' : 'Angl.',
    fat: en ? 'Fat' : 'Riebalai',
    dietTitle: en ? 'Diet & Allergies' : 'Mityba ir alergijos',
    dietPrefs: en ? 'Dietary preferences' : 'Mitybos pasirinkimai',
    allergies: en ? 'Allergies' : 'Alergijos',
    favFoods: en ? 'Favorite Foods' : 'Mėgstami produktai',
    noFavFoods: en ? 'No favorite foods selected' : 'Nepasirinkta mėgstamų produktų',
    groceryList: en ? 'Grocery List' : 'Pirkinių sąrašas',
    emptyGrocery: en ? 'Grocery list is empty' : 'Pirkinių sąrašas tuščias',
    total: en ? 'Total' : 'Viso',
    saved: en ? 'Saved' : 'Sutaupyta',
    copy: en ? '📋 Copy' : '📋 Kopijuoti',
    copied: en ? '📋 List copied!' : '📋 Sąrašas nukopijuotas!',
    show: en ? 'Show' : 'Rodyti',
    hide: en ? 'Hide' : 'Slėpti',
    reset: en ? '🗑️ Delete all data' : '🗑️ Ištrinti visus duomenis',
    confirmReset: en ? 'Are you sure you want to delete all data?' : 'Ar tikrai norite ištrinti visus duomenis?',
    perDay: en ? 'kcal/day' : 'kcal/d.',
    whereStore: en ? 'Store' : 'Parduotuvė',
  }

  const user = useAppStore(state => state.user)
  const bmrData = useAppStore(state => state.bmrData)
  const groceryList = useAppStore(state => state.groceryList)
  const removeFromGroceryList = useAppStore(state => state.removeFromGroceryList)
  const { resetProfile } = useUserProfile()
  const shoppingList = formatShoppingList(groceryList)

  const handleCopyList = () => {
    navigator.clipboard.writeText(shoppingList.plainText)
    setToast({ message: t.copied, type: 'success' })
  }

  const handleReset = () => {
    if (window.confirm(t.confirmReset)) {
      resetProfile()
      onReset()
    }
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

      <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>

      {/* User info */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{t.personalInfo}</p>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-2xl">
            {user.gender === 'male' ? '👨' : '👩'}
          </div>
          <div>
            <p className="text-lg font-bold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.location}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: t.age, value: `${user.age}` },
            { label: t.weight, value: `${user.weight} kg` },
            { label: t.height, value: `${user.height} cm` },
          ].map(item => (
            <div key={item.label} className="bg-gray-50 rounded-xl p-2 text-center">
              <p className="text-sm font-bold text-gray-900">{item.value}</p>
              <p className="text-xs text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Goal & BMR */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{t.goalTitle}</p>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-gray-900">{t.goal[user.goal] || ''}</p>
          <span className="text-xs bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full">
            {bmrData.targetCalories} {t.perDay}
          </span>
        </div>
        <p className="text-xs text-gray-500 mb-3">{t.activity[user.activityLevel] || ''}</p>
        <div className="flex gap-2 mb-2">
          {[
            { label: t.bmr, value: bmrData.bmr, color: 'text-blue-600' },
            { label: t.tdee, value: bmrData.tdee, color: 'text-purple-600' },
          ].map(item => (
            <div key={item.label} className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
              <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400">{item.label} kcal</p>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {[
            { label: t.protein, value: `${bmrData.macros?.protein}g`, color: 'text-blue-600' },
            { label: t.carbs, value: `${bmrData.macros?.carbs}g`, color: 'text-amber-600' },
            { label: t.fat, value: `${bmrData.macros?.fat}g`, color: 'text-green-600' },
          ].map(item => (
            <div key={item.label} className="flex-1 bg-gray-50 rounded-xl p-2 text-center">
              <p className={`text-sm font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-400">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Dietary */}
      {(user.dietaryOptions?.length > 0 || user.allergies?.length > 0) && (
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">{t.dietTitle}</p>
          {user.dietaryOptions?.length > 0 && (
            <div className="mb-2">
              <p className="text-xs text-gray-400 mb-1">{t.dietPrefs}</p>
              <div className="flex flex-wrap gap-1">
                {user.dietaryOptions.map(opt => (
                  <span key={opt} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{opt}</span>
                ))}
              </div>
            </div>
          )}
          {user.allergies?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 mb-1">{t.allergies}</p>
              <div className="flex flex-wrap gap-1">
                {user.allergies.map(a => (
                  <span key={a} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{a}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Favorite foods */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
          {t.favFoods} ({user.favoriteFoods?.length || 0})
        </p>
        {user.favoriteFoods?.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {user.favoriteFoods.map(id => (
              <span key={id} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">❤️ {id}</span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">{t.noFavFoods}</p>
        )}
      </div>

      {/* Grocery list */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            {t.groceryList} ({groceryList.length})
          </p>
          {groceryList.length > 0 && (
            <button
              onClick={() => setShowShoppingList(!showShoppingList)}
              className="text-xs text-blue-600 font-medium"
            >
              {showShoppingList ? t.hide : t.show}
            </button>
          )}
        </div>

        {groceryList.length === 0 ? (
          <p className="text-sm text-gray-400">{t.emptyGrocery}</p>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <div>
                <p className="text-sm font-bold text-gray-900">{t.total}: €{shoppingList.grandTotal}</p>
                <p className="text-xs text-green-600">
                  {t.saved}: €{shoppingList.totalSavings} ({shoppingList.savingsPercent}%)
                </p>
              </div>
              <button
                onClick={handleCopyList}
                className="text-xs bg-gray-100 text-gray-600 px-3 py-2 rounded-xl font-medium active:scale-95 transition-all"
              >
                {t.copy}
              </button>
            </div>

            {showShoppingList && (
              <div className="flex flex-col gap-3">
                {shoppingList.stores.map(store => (
                  <div key={store.name}>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      📍 {store.name} — €{store.storeTotal}
                    </p>
                    {store.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm">{item.name}</span>
                        </div>
                        <span className="text-xs text-gray-500">x{item.qty} — €{item.totalPrice}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap gap-2 mt-3">
              {groceryList.map(item => (
                <div key={item.id} className="flex items-center gap-1 bg-gray-50 rounded-full px-2 py-1">
                  <span className="text-xs">{item.emoji} {item.name.split(' ')[0]}</span>
                  <button
                    onClick={() => removeFromGroceryList(item.id)}
                    className="text-gray-400 hover:text-red-500 text-xs ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <button
        onClick={handleReset}
        className="w-full py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-sm font-medium active:scale-95 transition-all"
      >
        {t.reset}
      </button>
    </div>
  )
}