export default function Step2Activity({ data, onUpdate, onNext, onBack, lang }) {
    const en = lang === 'en'
  
    const t = {
      title: en ? 'Physical Activity' : 'Fizinis aktyvumas',
      subtitle: en ? 'What is your activity level?' : 'Koks jūsų aktyvumo lygis?',
      continue: en ? 'Continue →' : 'Tęsti →',
      back: en ? '← Back' : '← Atgal',
    }
  
    const activities = [
      {
        value: 'sedentary',
        label: en ? 'Sedentary' : 'Sėdimas gyvenimo būdas',
        description: en ? 'Little or no exercise, desk job' : 'Mažai arba jokio fizinio aktyvumo, darbas prie stalo',
        emoji: '🛋️',
      },
      {
        value: 'lightly_active',
        label: en ? 'Lightly Active' : 'Lengvai aktyvus',
        description: en ? 'Light exercise 1-3 days/week' : 'Lengvas fizinis aktyvumas 1-3 dienas per savaitę',
        emoji: '🚶',
      },
      {
        value: 'moderately_active',
        label: en ? 'Moderately Active' : 'Vidutiniškai aktyvus',
        description: en ? 'Moderate exercise 3-5 days/week' : 'Vidutinis fizinis aktyvumas 3-5 dienas per savaitę',
        emoji: '🏃',
      },
      {
        value: 'very_active',
        label: en ? 'Very Active' : 'Labai aktyvus',
        description: en ? 'Hard exercise 6-7 days/week' : 'Intensyvus fizinis aktyvumas 6-7 dienas per savaitę',
        emoji: '💪',
      },
    ]
  
    return (
      <div className="flex flex-col gap-5">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
          <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
        </div>
  
        <div className="flex flex-col gap-3">
          {activities.map(activity => (
            <button
              key={activity.value}
              onClick={() => onUpdate({ activityLevel: activity.value })}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                data.activityLevel === activity.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-100 bg-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activity.emoji}</span>
                <div>
                  <p className={`text-sm font-semibold ${
                    data.activityLevel === activity.value ? 'text-blue-700' : 'text-gray-900'
                  }`}>
                    {activity.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
  
        <div className="flex gap-3">
          <button onClick={onBack} className="flex-1 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">
            {t.back}
          </button>
          <button
            onClick={onNext}
            disabled={!data.activityLevel}
            className={`flex-1 py-3 rounded-xl text-sm font-semibold transition-all ${
              data.activityLevel
                ? 'bg-blue-600 text-white active:scale-95'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {t.continue}
          </button>
        </div>
      </div>
    )
  }