import {
    simulateDealCheck,
    checkDealsForUser,
    generateNotificationQueue,
  } from './notificationEngine.js'
  import { analyzeGroceryListGaps } from './goalEngine.js'
  import { generateShoppingRecommendations } from './basketOptimizer.js'
  import { generateMealPlan, generateGapFillers } from './mealPlanAgent.js'
  
  export function createAgentLoop(getState, setState, onEvent) {
    let isRunning = false
    let intervalId = null
    let mealPlanGenerating = false
    let lastGroceryListLength = 0
  
    function observe() {
      const state = getState()
      return {
        user: state.user,
        bmrData: state.bmrData,
        groceryList: state.groceryList,
        notifications: state.notifications,
        currentMealPlan: state.currentMealPlan,
        activeDeals: state.activeDeals,
      }
    }
  
    function decide(observation) {
      const actions = []
      actions.push({ type: 'REFRESH_DEALS' })
      if (
        observation.groceryList.length !== lastGroceryListLength &&
        observation.groceryList.length > 0 &&
        !mealPlanGenerating
      ) {
        actions.push({ type: 'REGENERATE_MEAL_PLAN' })
      }
      if (observation.currentMealPlan && observation.bmrData.macros) {
        actions.push({ type: 'CHECK_GAPS' })
      }
      if (observation.user.favoriteFoods?.length > 0) {
        actions.push({ type: 'CHECK_DEAL_MATCHES' })
      }
      if (observation.groceryList.length > 0) {
        actions.push({ type: 'CHECK_SHOPPING_GAPS' })
      }
      return actions
    }
  
    async function act(actions, observation) {
      for (const action of actions) {
        switch (action.type) {
  
          case 'REFRESH_DEALS': {
            const freshDeals = simulateDealCheck()
            setState({ activeDeals: freshDeals })
            onEvent({
              type: 'DEALS_REFRESHED',
              message: `${freshDeals.length} nuolaidų atnaujinta`,
              deals: freshDeals,
            })
            break
          }
  
          case 'CHECK_DEAL_MATCHES': {
            const state = getState()
            const matched = checkDealsForUser(
              observation.user.favoriteFoods,
              state.activeDeals
            )
            if (matched.length > 0) {
              const queue = generateNotificationQueue(matched)
              const existingIds = observation.notifications.map(n => n.dealItem?.id)
              const newNotifs = queue.filter(
                n => !existingIds.includes(n.dealItem?.id)
              )
              if (newNotifs.length > 0) {
                const currentNotifs = getState().notifications
                setState({ notifications: [...currentNotifs, ...newNotifs] })
                onEvent({
                  type: 'NEW_DEAL_NOTIFICATIONS',
                  message: `${newNotifs.length} naujas pasiūlymas jūsų mėgstamiems produktams!`,
                  notifications: newNotifs,
                })
              }
            }
            break
          }
  
          case 'REGENERATE_MEAL_PLAN': {
            if (mealPlanGenerating) break
            if (!observation.user.goal || !observation.bmrData.bmr) break
            mealPlanGenerating = true
            lastGroceryListLength = observation.groceryList.length
            onEvent({
              type: 'MEAL_PLAN_GENERATING',
              message: 'Agentas generuoja naują mitybos planą pagal jūsų pirkinius...',
            })
            try {
              const plan = await generateMealPlan(
                observation.user,
                observation.bmrData,
                observation.groceryList,
                observation.user.goal
              )
              setState({ currentMealPlan: plan })
              onEvent({
                type: 'MEAL_PLAN_READY',
                message: '✅ Mitybos planas atnaujintas pagal jūsų naujus pirkinius!',
                plan,
              })
            } catch (err) {
              onEvent({
                type: 'MEAL_PLAN_ERROR',
                message: 'Nepavyko sugeneruoti mitybos plano. Bandoma vėliau...',
              })
            } finally {
              mealPlanGenerating = false
            }
            break
          }
  
          case 'CHECK_GAPS': {
            if (!observation.bmrData.macros || !observation.bmrData.targetCalories) break
            const gaps = analyzeGroceryListGaps(
              observation.groceryList,
              observation.bmrData.targetCalories,
              observation.bmrData.macros
            )
            if (gaps.proteinGap > 20 || gaps.carbsGap > 30 || gaps.fatGap > 10) {
              onEvent({
                type: 'MACRO_GAPS_DETECTED',
                message: `⚠️ Trūksta: baltymai -${gaps.proteinGap}g, angliavandeniai -${gaps.carbsGap}g`,
                gaps,
                suggestions: gaps.suggestions,
              })
            }
            break
          }
  
          case 'CHECK_SHOPPING_GAPS': {
            if (!observation.bmrData.macros) break
            const recommendations = generateShoppingRecommendations(
              observation.groceryList,
              observation.bmrData.macros,
              null
            )
            if (recommendations.length > 0) {
              onEvent({
                type: 'SHOPPING_RECOMMENDATIONS',
                message: `🛒 Agentas rekomenduoja nusipirkti ${recommendations.length} produktus tikslui pasiekti`,
                recommendations,
              })
            }
            break
          }
        }
      }
    }
  
    async function tick() {
      if (!isRunning) return
      const observation = observe()
      const actions = decide(observation)
      await act(actions, observation)
    }
  
    function start(intervalMs = 30000) {
      if (isRunning) return
      isRunning = true
      onEvent({
        type: 'AGENT_STARTED',
        message: '🤖 SmartMarket agentas paleistas. Stebiu nuolaidas...',
      })
      tick()
      intervalId = setInterval(tick, intervalMs)
    }
  
    function stop() {
      isRunning = false
      if (intervalId) {
        clearInterval(intervalId)
        intervalId = null
      }
      onEvent({
        type: 'AGENT_STOPPED',
        message: '🤖 Agentas sustabdytas.',
      })
    }
  
    function forceTick() {
      tick()
    }
  
    return { start, stop, forceTick }
  }