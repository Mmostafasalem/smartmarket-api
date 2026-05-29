import { useState, useEffect, useCallback } from 'react'
import useAppStore from '../store/appState.js'
import {
  simulateDealCheck,
  checkDealsForUser,
  generateNotificationQueue,
} from '../logic/notificationEngine.js'

/**
 * Hook for managing market deals and notifications
 */
export function useMarketDeals() {
  const {
    user,
    activeDeals,
    groceryList,
    notifications,
    addToGroceryList,
    addNotification,
    dismissNotification,
  } = useAppStore()

  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  /**
   * Fetch fresh deals and check against user favorites
   */
  const refreshDeals = useCallback(() => {
    setIsLoading(true)

    // Simulate API call with slight delay to feel real
    setTimeout(() => {
      const freshDeals = simulateDealCheck()

      // Update active deals in store
      useAppStore.setState({ activeDeals: freshDeals })

      // Check which deals match user favorites
      const matched = checkDealsForUser(
        user.favoriteFoods || [],
        freshDeals
      )

      // Generate notifications for new matches
      if (matched.length > 0) {
        const queue = generateNotificationQueue(matched)

        // Only add notifications not already in queue
        const existingIds = notifications.map(n => n.dealItem?.id)
        const newNotifs = queue.filter(
          n => !existingIds.includes(n.dealItem?.id)
        )

        newNotifs.forEach(notif => addNotification(notif))
      }

      setLastUpdated(new Date())
      setIsLoading(false)
    }, 800)
  }, [user.favoriteFoods, notifications, addNotification])

  /**
   * Mark item as bought — adds to grocery list and dismisses notification
   */
  const markAsBought = useCallback((deal) => {
    // Add to grocery list if not already there
    const alreadyBought = groceryList.find(i => i.id === deal.id)
    if (!alreadyBought) {
      addToGroceryList(deal)
    }

    // Dismiss any notification for this deal
    const relatedNotif = notifications.find(
      n => n.dealItem?.id === deal.id
    )
    if (relatedNotif) {
      dismissNotification(relatedNotif.id)
    }
  }, [groceryList, notifications, addToGroceryList, dismissNotification])

  /**
   * Skip a deal — just dismisses the notification
   */
  const skipDeal = useCallback((notificationId) => {
    dismissNotification(notificationId)
  }, [dismissNotification])

  /**
   * Get deals filtered by store
   */
  const getDealsByStore = useCallback((store) => {
    if (!store || store === 'Visos') return activeDeals
    return activeDeals.filter(d => d.store === store)
  }, [activeDeals])

  /**
   * Get deals for user favorites only
   */
  const getFavoriteDeals = useCallback(() => {
    return checkDealsForUser(
      user.favoriteFoods || [],
      activeDeals
    ).map(m => m.dealItem)
  }, [user.favoriteFoods, activeDeals])

  // Initial load on mount
  useEffect(() => {
    refreshDeals()
  }, [])

  // Refresh every 30 seconds to simulate live market data
  useEffect(() => {
    const interval = setInterval(refreshDeals, 30000)
    return () => clearInterval(interval)
  }, [refreshDeals])

  // Check for new matching deals whenever favorites change
  useEffect(() => {
    if (user.favoriteFoods?.length > 0 && activeDeals.length > 0) {
      const matched = checkDealsForUser(user.favoriteFoods, activeDeals)
      if (matched.length > 0) {
        const queue = generateNotificationQueue(matched)
        const existingIds = notifications.map(n => n.dealItem?.id)
        const newNotifs = queue.filter(
          n => !existingIds.includes(n.dealItem?.id)
        )
        newNotifs.forEach(notif => addNotification(notif))
      }
    }
  }, [user.favoriteFoods])

  return {
    activeDeals,
    matchedDeals: getFavoriteDeals(),
    notificationQueue: notifications,
    groceryList,
    isLoading,
    lastUpdated,
    refreshDeals,
    markAsBought,
    skipDeal,
    getDealsByStore,
    getFavoriteDeals,
  }
}