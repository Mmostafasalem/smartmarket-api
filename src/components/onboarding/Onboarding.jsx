import { useState } from 'react'
import Step1Personal from './Step1Personal.jsx'
import Step2Activity from './Step2Activity.jsx'
import Step3Diet from './Step3Diet.jsx'
import Step4Foods from './Step4Foods.jsx'
import Step5Results from './Step5Results.jsx'
import { useUserProfile } from '../../hooks/useUserProfile.js'

export default function Onboarding({ onComplete, lang }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: null,
    activityLevel: null,
    location: 'Vilnius',
    dietaryOptions: [],
    allergies: [],
    favoriteFoods: [],
    goal: null,
  })

  const { updateProfile, calculateBMR, finishOnboarding } = useUserProfile()

  const updateFormData = (fields) => {
    setFormData(prev => ({ ...prev, ...fields }))
  }

  const handleFinish = () => {
    updateProfile(formData)
    calculateBMR()
    finishOnboarding(formData.goal)
    onComplete()
  }

  const totalSteps = 5
  const progress = (step / totalSteps) * 100
  const stepLabel = lang === 'en' ? `Step ${step} of ${totalSteps}` : `${step} / ${totalSteps} žingsnis`

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-400 font-medium">{stepLabel}</span>
            <span className="text-xs text-blue-600 font-medium">{Math.round(progress)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="px-6 pb-6">
          {step === 1 && (
            <Step1Personal
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setStep(2)}
              lang={lang}
            />
          )}
          {step === 2 && (
            <Step2Activity
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setStep(3)}
              onBack={() => setStep(1)}
              lang={lang}
            />
          )}
          {step === 3 && (
            <Step3Diet
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setStep(4)}
              onBack={() => setStep(2)}
              lang={lang}
            />
          )}
          {step === 4 && (
            <Step4Foods
              data={formData}
              onUpdate={updateFormData}
              onNext={() => setStep(5)}
              onBack={() => setStep(3)}
              lang={lang}
            />
          )}
          {step === 5 && (
            <Step5Results
              data={formData}
              onUpdate={updateFormData}
              onFinish={handleFinish}
              onBack={() => setStep(4)}
              lang={lang}
            />
          )}
        </div>
      </div>
    </div>
  )
}