import { calculateMacros } from './bmr.js'
import { MARKET_DATA } from '../data/vilniusMarkets.js'

/**
 * Set user goal and return target calories + macros
 * @param {"lose"|"maintain"|"gain"} goal
 * @param {Object} bmrProfile - from getFullBMRProfile()
 * @returns {Object}
 */
export function setUserGoal(goal, bmrProfile) {
  const targetCalories =
    goal === 'lose'
      ? bmrProfile.loseCalories
      : goal === 'gain'
      ? bmrProfile.gainCalories
      : bmrProfile.maintainCalories

  const macros = calculateMacros(targetCalories)

  const weeklyChange = goal === 'lose'
    ? '-0.35kg per savaitę'
    : goal === 'gain'
    ? '+0.35kg per savaitę'
    : 'Svoris išlaikomas stabilus'

  const weeklyProjection =
    goal === 'lose'
      ? `Šiuo tempu numessite apie ${weeklyChange}`
      : goal === 'gain'
      ? `Šiuo tempu priaugsite apie ${weeklyChange}`
      : weeklyChange

  return {
    goal,
    targetCalories,
    macros,
    weeklyProjection,
  }
}

/**
 * Analyze grocery list and find macro gaps
 * @param {Array} groceryList - items user confirmed as bought
 * @param {number} targetCalories
 * @param {Object} macros - { protein, carbs, fat }
 * @returns {Object}
 */
export function analyzeGroceryListGaps(groceryList, targetCalories, macros) {
  if (!groceryList || groceryList.length === 0) {
    return {
      proteinGap: macros.protein,
      carbsGap: macros.carbs,
      fatGap: macros.fat,
      calorieGap: targetCalories,
      suggestions: MARKET_DATA.slice(0, 3),
    }
  }

  // Estimate weekly macros available from grocery list
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0
  let totalCalories = 0

  groceryList.forEach(item => {
    const servingGrams = 100 * (item.weeklyQty || 1)
    totalProtein += (item.proteinPer100g || 0) * servingGrams / 100
    totalCarbs += (item.carbsPer100g || 0) * servingGrams / 100
    totalFat += (item.fatPer100g || 0) * servingGrams / 100
    totalCalories += (item.kcalPer100g || 0) * servingGrams / 100
  })

  // Daily averages (divide by 7 days)
  const dailyProtein = Math.round(totalProtein / 7)
  const dailyCarbs = Math.round(totalCarbs / 7)
  const dailyFat = Math.round(totalFat / 7)
  const dailyCalories = Math.round(totalCalories / 7)

  const proteinGap = Math.max(0, macros.protein - dailyProtein)
  const carbsGap = Math.max(0, macros.carbs - dailyCarbs)
  const fatGap = Math.max(0, macros.fat - dailyFat)
  const calorieGap = Math.max(0, targetCalories - dailyCalories)

  // Find suggestions from market data to fill gaps
  const suggestions = []

  if (proteinGap > 20) {
    const proteinItem = MARKET_DATA.find(
      item => item.category === 'protein' &&
      !groceryList.find(g => g.id === item.id)
    )
    if (proteinItem) suggestions.push(proteinItem)
  }

  if (carbsGap > 30) {
    const carbItem = MARKET_DATA.find(
      item => item.category === 'carbs' &&
      !groceryList.find(g => g.id === item.id)
    )
    if (carbItem) suggestions.push(carbItem)
  }

  if (fatGap > 10) {
    const fatItem = MARKET_DATA.find(
      item => item.category === 'fat' &&
      !groceryList.find(g => g.id === item.id)
    )
    if (fatItem) suggestions.push(fatItem)
  }

  return {
    proteinGap,
    carbsGap,
    fatGap,
    calorieGap,
    dailyProtein,
    dailyCarbs,
    dailyFat,
    dailyCalories,
    suggestions,
  }
}

/**
 * Calculate weekly progress from meal logs
 * @param {Array} mealLogs - [{ kcal, date }]
 * @param {number} targetCalories
 * @returns {Object}
 */
export function calculateWeeklyProgress(mealLogs, targetCalories) {
  if (!mealLogs || mealLogs.length === 0) {
    return {
      avgDailyKcal: 0,
      daysLogged: 0,
      adherencePercent: 0,
      trend: 'nėra duomenų',
    }
  }

  const totalKcal = mealLogs.reduce((sum, log) => sum + (log.kcal || 0), 0)
  const avgDailyKcal = Math.round(totalKcal / mealLogs.length)
  const adherencePercent = Math.round(
    (avgDailyKcal / targetCalories) * 100
  )

  let trend = 'pagal planą'
  if (adherencePercent > 110) trend = 'per daug'
  else if (adherencePercent < 90) trend = 'per mažai'

  return {
    avgDailyKcal,
    daysLogged: mealLogs.length,
    adherencePercent,
    trend,
  }
}