export default function BottomNav({ activeTab, onTabChange }) {
    const tabs = [
      { key: 'dashboard', label: 'Pradžia', emoji: '🏠' },
      { key: 'deals', label: 'Nuolaidos', emoji: '🏷️' },
      { key: 'mealplan', label: 'Mityba', emoji: '🥗' },
      { key: 'profile', label: 'Profilis', emoji: '👤' },
    ]
  
    return (
      <div className="fixed bottom-0 left-0 right-0 flex justify-center z-50">
        <div className="w-full max-w-sm bg-white border-t border-gray-100 shadow-lg">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => onTabChange(tab.key)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all ${
                  activeTab === tab.key
                    ? 'text-blue-600'
                    : 'text-gray-400'
                }`}
              >
                <span className="text-xl">{tab.emoji}</span>
                <span className="text-xs font-medium">{tab.label}</span>
                {activeTab === tab.key && (
                  <div className="absolute top-0 w-8 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }