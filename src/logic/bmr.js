export function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
      return Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5)
    } else {
      return Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161)
    }
  }
  
  export function calculateTDEE(bmr, activityLevel) {
    const multipliers = {
      sedentary: 1.2,
      lightly_active: 1.375,
      moderately_active: 1.55,
      very_active: 1.725,
    }
    const multiplier = multipliers[activityLevel] || 1.2
    return Math.round(bmr * multiplier)
  }
  
  export function calculateGoalCalories(tdee) {
    return {
      lose: tdee - 350,
      maintain: tdee,
      gain: tdee + 350,
    }
  }
  
  export function calculateMacros(targetCalories) {
    return {
      protein: Math.round((targetCalories * 0.30) / 4),
      carbs: Math.round((targetCalories * 0.45) / 4),
      fat: Math.round((targetCalories * 0.25) / 9),
    }
  }
  
  export function getFullBMRProfile(user) {
    const bmr = calculateBMR(user.weight, user.height, user.age, user.gender)
    const tdee = calculateTDEE(bmr, user.activityLevel)
    const goals = calculateGoalCalories(tdee)
    const macros = calculateMacros(goals.maintain)
    return {
      bmr,
      tdee,
      loseCalories: goals.lose,
      maintainCalories: goals.maintain,
      gainCalories: goals.gain,
      macros,
    }
  }