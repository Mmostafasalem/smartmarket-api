import { useState } from 'react'

export default function Step1Personal({ data, onUpdate, onNext, lang }) {
  const [errors, setErrors] = useState({})
  const en = lang === 'en'

  const t = {
    title: en ? 'Welcome! 👋' : 'Sveiki! 👋',
    subtitle: en ? 'Enter your details to get started' : 'Įveskite savo duomenis kad pradėtume',
    name: en ? 'Name' : 'Vardas',
    namePlaceholder: en ? 'Your name' : 'Jūsų vardas',
    age: en ? 'Age' : 'Amžius',
    weight: en ? 'Weight (kg)' : 'Svoris (kg)',
    height: en ? 'Height (cm)' : 'Ūgis (cm)',
    gender: en ? 'Gender' : 'Lytis',
    male: en ? '👨 Male' : '👨 Vyras',
    female: en ? '👩 Female' : '👩 Moteris',
    continue: en ? 'Continue →' : 'Tęsti →',
    errName: en ? 'Please enter your name' : 'Įveskite vardą',
    errAge: en ? 'Enter age (10-100)' : 'Įveskite amžių (10-100)',
    errWeight: en ? 'Enter weight (30-300 kg)' : 'Įveskite svorį (30-300 kg)',
    errHeight: en ? 'Enter height (100-250 cm)' : 'Įveskite ūgį (100-250 cm)',
    errGender: en ? 'Please select gender' : 'Pasirinkite lytį',
  }

  const validate = () => {
    const newErrors = {}
    if (!data.name?.trim()) newErrors.name = t.errName
    if (!data.age || data.age < 10 || data.age > 100) newErrors.age = t.errAge
    if (!data.weight || data.weight < 30 || data.weight > 300) newErrors.weight = t.errWeight
    if (!data.height || data.height < 100 || data.height > 250) newErrors.height = t.errHeight
    if (!data.gender) newErrors.gender = t.errGender
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{t.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{t.subtitle}</p>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.name}</label>
        <input
          type="text"
          placeholder={t.namePlaceholder}
          value={data.name || ''}
          onChange={e => onUpdate({ name: e.target.value })}
          className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
        />
        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.age}</label>
          <input
            type="number"
            placeholder="21"
            value={data.age || ''}
            onChange={e => onUpdate({ age: Number(e.target.value) })}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
          {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
        </div>
        <div className="flex-1">
          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.weight}</label>
          <input
            type="number"
            placeholder="70"
            value={data.weight || ''}
            onChange={e => onUpdate({ weight: Number(e.target.value) })}
            className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
          />
          {errors.weight && <p className="text-xs text-red-500 mt-1">{errors.weight}</p>}
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.height}</label>
        <input
          type="number"
          placeholder="175"
          value={data.height || ''}
          onChange={e => onUpdate({ height: Number(e.target.value) })}
          className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-500 bg-white"
        />
        {errors.height && <p className="text-xs text-red-500 mt-1">{errors.height}</p>}
      </div>

      <div>
        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">{t.gender}</label>
        <div className="flex gap-3 mt-1">
          {[
            { value: 'male', label: t.male },
            { value: 'female', label: t.female },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => onUpdate({ gender: option.value })}
              className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition-all ${
                data.gender === option.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 bg-white text-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        {errors.gender && <p className="text-xs text-red-500 mt-1">{errors.gender}</p>}
      </div>

      <button
        onClick={() => { if (validate()) onNext() }}
        className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold mt-2 active:scale-95 transition-all"
      >
        {t.continue}
      </button>
    </div>
  )
}