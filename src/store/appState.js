import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // User profile
  user: {
    name: null,
    age: null,
    weight: null,
    height: null,
    gender: null,
    activityLevel: null,
    location: null,
    dietaryOptions: [],
    allergies: [],
    favoriteFoods: [],
    goal: null,
    onboardingComplete: false,
  },

  // BMR & calorie results
  bmrData: {
    bmr: null,
    tdee: null,
    loseCalories: null,
    maintainCalories: null,
    gainCalories: null,
    targetCalories: null,
    macros: {
      protein: null,
      carbs: null,
      fat: null,
    }
  },

  // Market & grocery
  activeDeals: [],
  groceryList: [],
  notifications: [],

  // Meal plans
  currentMealPlan: null,
  mealPlanHistory: [],

  // Actions
  setUser: (userData) => set({ user: userData }),

  updateUser: (fields) => set((state) => ({
    user: { ...state.user, ...fields }
  })),

  setBMRData: (data) => set({ bmrData: data }),

  setGoal: (goal) => set((state) => ({
    user: { ...state.user, goal },
    bmrData: {
      ...state.bmrData,
      targetCalories: goal === 'lose'
        ? state.bmrData.loseCalories
        : goal === 'gain'
        ? state.bmrData.gainCalories
        : state.bmrData.maintainCalories
    }
  })),

  toggleFavoriteFood: (foodId) => set((state) => {
    const favs = state.user.favoriteFoods
    const exists = favs.includes(foodId)
    return {
      user: {
        ...state.user,
        favoriteFoods: exists
          ? favs.filter(id => id !== foodId)
          : [...favs, foodId]
      }
    }
  }),

  addToGroceryList: (item) => set((state) => ({
    groceryList: [...state.groceryList, item]
  })),

  removeFromGroceryList: (itemId) => set((state) => ({
    groceryList: state.groceryList.filter(i => i.id !== itemId)
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [...state.notifications, notification]
  })),

  dismissNotification: (id) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  setMealPlan: (plan) => set((state) => ({
    currentMealPlan: plan,
    mealPlanHistory: [...state.mealPlanHistory, plan]
  })),

  completeOnboarding: () => set((state) => ({
    user: { ...state.user, onboardingComplete: true }
  })),

  resetAll: () => set({
    user: {
      name: null, age: null, weight: null, height: null,
      gender: null, activityLevel: null, location: null,
      dietaryOptions: [], allergies: [], favoriteFoods: [],
      goal: null, onboardingComplete: false,
    },
    bmrData: {
      bmr: null, tdee: null, loseCalories: null,
      maintainCalories: null, gainCalories: null,
      targetCalories: null,
      macros: { protein: null, carbs: null, fat: null }
    },
    activeDeals: [],
    groceryList: [],
    notifications: [],
    currentMealPlan: null,
    mealPlanHistory: [],
  })
}))

export default useAppStore