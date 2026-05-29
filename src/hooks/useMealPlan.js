import { useState, useCallback } from 'react'
import useAppStore from '../store/appState.js'
import {
  generateMealPlan,
  generateGapFillers,
  generateShoppingAdvice,
} from '../logic/mealPlanAgent.js'
import { calculateWeeklyProgress } from '../logic/goalEngine.js'

export function useMealPlan(lang) {
  const {
    user,
    bmrData,
    groceryList,
    currentMealPlan,
    mealPlanHistory,
    setMealPlan,
  } = useAppStore()

  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingGapFillers, setIsLoadingGapFillers] = useState(false)
  const [isLoadingAdvice, setIsLoadingAdvice] = useState(false)
  const [error, setError] = useState(null)
  const [gapFillers, setGapFillers] = useState([])
  const [shoppingAdvice, setShoppingAdvice] = useState([])
  const [mealLogs, setMealLogs] = useState([])

  const generatePlan = useCallback(async () => {
    if (!user.goal || !bmrData.bmr) {
      setError(lang === 'en'
        ? 'Please complete onboarding and select a goal first.'
        : 'Pirmiausia užbaik registraciją ir pasirink tikslą.')
      return
    }
    setIsGenerating(true)
    setError(null)
    try {
        console.log('Generating meal plan with lang:', lang)
        const plan = await generateMealPlan(user, bmrData, groceryList, user.goal, lang)
      setMealPlan(plan)
    } catch (err) {
      setError(err.message || (lang === 'en' ? 'Failed to generate meal plan.' : 'Nepavyko sugeneruoti mitybos plano.'))
    } finally {
      setIsGenerating(false)
    }
  }, [user, bmrData, groceryList, setMealPlan, lang])

  const regeneratePlan = useCallback(async () => {
    useAppStore.setState({ currentMealPlan: null })
    await generatePlan()
  }, [generatePlan])

  const logMeal = useCallback((day, mealType, kcal) => {
    setMealLogs(prev => [...prev, {
      day,
      mealType,
      kcal,
      loggedAt: new Date().toISOString(),
    }])
  }, [])

  const getTodayKcal = useCallback(() => {
    const today = new Date().toDateString()
    return mealLogs
      .filter(log => new Date(log.loggedAt).toDateString() === today)
      .reduce((sum, log) => sum + log.kcal, 0)
  }, [mealLogs])

  const getDayPlan = useCallback((day) => {
    if (!currentMealPlan) return null
    return currentMealPlan[day] || null
  }, [currentMealPlan])

  const fetchGapFillers = useCallback(async () => {
    if (!currentMealPlan || !bmrData.targetCalories) return
    setIsLoadingGapFillers(true)
    try {
      const fillers = await generateGapFillers(
        currentMealPlan,
        bmrData.targetCalories,
        bmrData.macros,
        lang
      )
      setGapFillers(fillers)
    } catch (err) {
      console.error('Gap fillers error:', err)
    } finally {
      setIsLoadingGapFillers(false)
    }
  }, [currentMealPlan, bmrData, lang])

  const fetchShoppingAdvice = useCallback(async () => {
    if (!user.goal || !bmrData.macros) return
    setIsLoadingAdvice(true)
    try {
      const advice = await generateShoppingAdvice(
        groceryList,
        user.goal,
        bmrData.macros,
        lang
      )
      setShoppingAdvice(advice)
    } catch (err) {
      console.error('Shopping advice error:', err)
    } finally {
      setIsLoadingAdvice(false)
    }
  }, [groceryList, user.goal, bmrData, lang])

  const weeklyProgress = calculateWeeklyProgress(
    mealLogs,
    bmrData.targetCalories || 2000
  )

  const en = lang === 'en'

  const DAYS = [
    { key: 'pirmadienis', label: en ? 'Mon' : 'Pr' },
    { key: 'antradienis', label: en ? 'Tue' : 'An' },
    { key: 'treciadienis', label: en ? 'Wed' : 'Tr' },
    { key: 'ketvirtadienis', label: en ? 'Thu' : 'Kt' },
    { key: 'pentadienis', label: en ? 'Fri' : 'Pn' },
    { key: 'sestadienis', label: en ? 'Sat' : 'Št' },
    { key: 'sekmadienis', label: en ? 'Sun' : 'Sk' },
  ]

  const MEAL_TYPES = [
    { key: 'pusryciai', label: en ? 'Breakfast' : 'Pusryčiai', emoji: '🌅' },
    { key: 'pietūs', label: en ? 'Lunch' : 'Pietūs', emoji: '☀️' },
    { key: 'vakariene', label: en ? 'Dinner' : 'Vakarienė', emoji: '🌙' },
    { key: 'uzkandziai', label: en ? 'Snack' : 'Užkandis', emoji: '🍎' },
  ]

  return {
    mealPlan: currentMealPlan,
    mealPlanHistory,
    isGenerating,
    isLoadingGapFillers,
    isLoadingAdvice,
    error,
    gapFillers,
    shoppingAdvice,
    mealLogs,
    weeklyProgress,
    DAYS,
    MEAL_TYPES,
    generatePlan,
    regeneratePlan,
    logMeal,
    getTodayKcal,
    getDayPlan,
    fetchGapFillers,
    fetchShoppingAdvice,
  }
}