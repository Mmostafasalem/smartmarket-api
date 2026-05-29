import { useState } from 'react'
import LanguageSelect from './components/onboarding/LanguageSelect.jsx'
import Onboarding from './components/onboarding/Onboarding.jsx'
import Dashboard from './components/dashboard/Dashboard.jsx'
import Deals from './components/deals/Deals.jsx'
import MealPlan from './components/mealplan/MealPlan.jsx'
import Profile from './components/dashboard/Profile.jsx'
import { useAgentLoop } from './hooks/useAgentLoop.js'
import useAppStore from './store/appState.js'

function MainApp({ lang }) {
  const [activeTab, setActiveTab] = useState('dashboard')
  const { isAgentRunning, latestEvent, triggerAgent } = useAgentLoop()

  const tabs = [
    { key: 'dashboard', label: lang === 'en' ? 'Home' : 'Pradžia', emoji: '🏠' },
    { key: 'deals', label: lang === 'en' ? 'Deals' : 'Nuolaidos', emoji: '🏷️' },
    { key: 'mealplan', label: lang === 'en' ? 'Meals' : 'Mityba', emoji: '🥗' },
    { key: 'profile', label: lang === 'en' ? 'Profile' : 'Profilis', emoji: '👤' },
  ]

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center">
      <div className="w-full max-w-sm relative">

        {/* Agent status bar */}
        {latestEvent && (
          <div className={`px-4 py-2 text-xs font-medium flex items-center gap-2 ${
            latestEvent.type === 'MEAL_PLAN_READY'
              ? 'bg-green-500 text-white'
              : latestEvent.type === 'MEAL_PLAN_GENERATING'
              ? 'bg-blue-500 text-white'
              : latestEvent.type === 'NEW_DEAL_NOTIFICATIONS'
              ? 'bg-amber-500 text-white'
              : latestEvent.type === 'MEAL_PLAN_ERROR'
              ? 'bg-red-500 text-white'
              : 'bg-gray-800 text-gray-300'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              isAgentRunning ? 'bg-green-300 animate-pulse' : 'bg-gray-500'
            }`} />
            <span className="flex-1 truncate">{latestEvent.message}</span>
            <button
              onClick={triggerAgent}
              className="text-white opacity-70 hover:opacity-100 flex-shrink-0"
            >
              ▶
            </button>
          </div>
        )}

        {/* Page content */}
        <div className="px-4 pt-4">
          {activeTab === 'dashboard' && (
            <Dashboard onTabChange={setActiveTab} lang={lang} />
          )}
          {activeTab === 'deals' && (
            <Deals lang={lang} />
          )}
          {activeTab === 'mealplan' && (
            <MealPlan lang={lang} />
          )}
          {activeTab === 'profile' && (
            <Profile onReset={() => window.location.reload()} lang={lang} />
          )}
        </div>

        {/* Bottom nav */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
          <div className="w-full max-w-sm bg-white border-t border-gray-100 shadow-lg">
            <div className="flex">
              {tabs.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${
                    activeTab === tab.key
                      ? 'text-blue-600'
                      : 'text-gray-400'
                  }`}
                >
                  <span className="text-xl">{tab.emoji}</span>
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

function App() {
  const [lang, setLang] = useState(null)
  const [onboarded, setOnboarded] = useState(false)

  if (!lang) {
    return <LanguageSelect onSelect={setLang} />
  }

  if (!onboarded) {
    return (
      <Onboarding
        onComplete={() => setOnboarded(true)}
        lang={lang}
      />
    )
  }

  return <MainApp lang={lang} />
}

export default App