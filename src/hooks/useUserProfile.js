import { useCallback } from 'react'
import useAppStore from '../store/appState.js'
import { getFullBMRProfile } from '../logic/bmr.js'

/**
 * Hook for managing user profile and BMR calculations
 */
export function useUserProfile() {
  const {
    user,
    bmrData,
    setUser,
    updateUser,
    setBMRData,
    setGoal,
    completeOnboarding,
    resetAll,
    toggleFavoriteFood,
  } = useAppStore()

  /**
   * Update profile fields and recalculate BMR if body stats changed
   */
  const updateProfile = useCallback((fields) => {
    updateUser(fields)

    // Recalculate BMR if relevant fields changed
    const bmrFields = ['weight', 'height', 'age', 'gender', 'activityLevel']
    const hasBMRChange = Object.keys(fields).some(k => bmrFields.includes(k))

    if (hasBMRChange) {
      const updatedUser = { ...user, ...fields }
      if (
        updatedUser.weight &&
        updatedUser.height &&
        updatedUser.age &&
        updatedUser.gender &&
        updatedUser.activityLevel
      ) {
        const profile = getFullBMRProfile(updatedUser)
        setBMRData({
          ...profile,
          targetCalories: updatedUser.goal === 'lose'
            ? profile.loseCalories
            : updatedUser.goal === 'gain'
            ? profile.gainCalories
            : profile.maintainCalories,
        })
      }
    }
  }, [user, updateUser, setBMRData])

  /**
   * Calculate and save BMR from current user data
   */
  const calculateBMR = useCallback(() => {
    if (
      user.weight &&
      user.height &&
      user.age &&
      user.gender &&
      user.activityLevel
    ) {
      const profile = getFullBMRProfile(user)
      setBMRData({
        ...profile,
        targetCalories: user.goal === 'lose'
          ? profile.loseCalories
          : user.goal === 'gain'
          ? profile.gainCalories
          : profile.maintainCalories,
      })
      return profile
    }
    return null
  }, [user, setBMRData])

  /**
   * Complete onboarding and set final goal
   */
  const finishOnboarding = useCallback((goal) => {
    setGoal(goal)
    completeOnboarding()
  }, [setGoal, completeOnboarding])

  /**
   * Reset everything
   */
  const resetProfile = useCallback(() => {
    resetAll()
  }, [resetAll])

  /**
   * Toggle a food as favorite
   */
  const toggleFavorite = useCallback((foodId) => {
    toggleFavoriteFood(foodId)
  }, [toggleFavoriteFood])

  const isOnboarded = user.onboardingComplete

  return {
    user,
    bmrData,
    isOnboarded,
    updateProfile,
    calculateBMR,
    finishOnboarding,
    resetProfile,
    toggleFavorite,
  }
}