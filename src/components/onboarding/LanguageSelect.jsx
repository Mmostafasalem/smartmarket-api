export default function LanguageSelect({ onSelect }) {
    const languages = [
      { code: 'lt', label: 'Lietuvių', flag: '🇱🇹', description: 'Tęsti lietuvių kalba' },
      { code: 'en', label: 'English', flag: '🇬🇧', description: 'Continue in English' },
    ]
  
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
  
          {/* Logo */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-4 shadow-lg">
              🛒
            </div>
            <h1 className="text-3xl font-bold text-gray-900">SmartMarket</h1>
            <p className="text-gray-500 mt-2 text-sm">AI-powered grocery & meal planner</p>
          </div>
  
          {/* Language options */}
          <div className="flex flex-col gap-3">
            {languages.map(lang => (
              <button
                key={lang.code}
                onClick={() => onSelect(lang.code)}
                className="w-full bg-white rounded-2xl p-5 border-2 border-gray-100 flex items-center gap-4 hover:border-blue-500 hover:bg-blue-50 active:scale-95 transition-all shadow-sm"
              >
                <span className="text-4xl">{lang.flag}</span>
                <div className="text-left">
                  <p className="text-base font-bold text-gray-900">{lang.label}</p>
                  <p className="text-sm text-gray-500">{lang.description}</p>
                </div>
                <span className="ml-auto text-gray-300 text-xl">›</span>
              </button>
            ))}
          </div>
  
          <p className="text-center text-xs text-gray-400 mt-8">
            Powered by Claude AI · Vilnius, Lithuania
          </p>
        </div>
      </div>
    )
  }