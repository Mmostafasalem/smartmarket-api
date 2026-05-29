import { MARKET_DATA } from '../data/vilniusMarkets.js'

/**
 * Check active deals against user's favorite foods
 * @param {Array} favoriteFoods - food IDs user favorited
 * @param {Array} activeDeals - current discounted items
 * @returns {Array} matched deals
 */
export function checkDealsForUser(favoriteFoods, activeDeals) {
  if (!favoriteFoods || !activeDeals) return []

  const matches = []

  activeDeals.forEach(deal => {
    const isFavorited = favoriteFoods.some(favId => {
      // Direct ID match
      if (deal.id === favId) return true
      // Category match via ALL_FOODS mapping
      const categoryMap = {
        101: 'protein', 102: 'protein', 103: 'protein', 104: 'protein',
        105: 'protein', 106: 'protein', 107: 'protein', 108: 'protein',
        109: 'carbs', 110: 'carbs', 111: 'carbs', 112: 'carbs',
        113: 'carbs', 114: 'carbs', 115: 'vegetable', 116: 'vegetable',
        117: 'vegetable', 118: 'vegetable', 119: 'fat', 120: 'fat',
        121: 'fat', 122: 'fat', 123: 'carbs', 124: 'vegetable',
      }
      return categoryMap[favId] === deal.category
    })

    if (isFavorited) {
      matches.push({
        dealItem: deal,
        matchedFavorite: favoriteFoods.find(f => f === deal.id) || null,
        isNewDeal: true,
      })
    }
  })

  // Sort by discount % descending
  return matches.sort((a, b) => b.dealItem.discount - a.dealItem.discount)
}

/**
 * Generate notification queue from matched deals
 * @param {Array} matchedDeals
 * @returns {Array} notification objects
 */
export function generateNotificationQueue(matchedDeals) {
  return matchedDeals.map((match, index) => {
    const deal = match.dealItem
    const priority =
      deal.discount >= 30 ? 'high' :
      deal.discount >= 15 ? 'medium' : 'low'

    return {
      id: `notif_${deal.id}_${Date.now()}_${index}`,
      productName: deal.name,
      brand: deal.brand,
      emoji: deal.emoji,
      storeName: deal.store,
      originalPrice: deal.originalPrice,
      discountedPrice: deal.discountedPrice,
      discountPercent: deal.discount,
      expiresIn: deal.expiresIn,
      category: deal.category,
      unit: deal.unit,
      weeklyQty: deal.weeklyQty,
      allergens: deal.allergens,
      dietaryTags: deal.dietaryTags,
      priority,
      createdAt: new Date().toISOString(),
      dealItem: deal,
    }
  })
}

/**
 * Simulate a live deal check from Vilnius markets
 * Returns random subset of deals with slight price variations
 * @returns {Array} active deals
 */
export function simulateDealCheck() {
  // Randomly pick 6-10 items from MARKET_DATA
  const shuffled = [...MARKET_DATA].sort(() => Math.random() - 0.5)
  const count = Math.floor(Math.random() * 5) + 6
  const selected = shuffled.slice(0, count)

  // Apply slight price variation (±5%) to feel live
  return selected.map(item => ({
    ...item,
    discountedPrice: Math.round(
      item.discountedPrice * (0.95 + Math.random() * 0.1) * 100
    ) / 100,
    discount: Math.floor(item.discount * (0.9 + Math.random() * 0.2)),
    fetchedAt: new Date().toISOString(),
  }))
}

/**
 * Format notification message in Lithuanian
 * @param {Object} notification
 * @returns {string}
 */
export function formatNotificationMessage(notification) {
  return `${notification.emoji} ${notification.productName} yra ${notification.discountPercent}% nuolaida parduotuvėje ${notification.storeName}! Kaina: €${notification.discountedPrice} (buvo €${notification.originalPrice}). Galioja: ${notification.expiresIn}.`
}

/**
 * Filter notifications by priority
 * @param {Array} notifications
 * @param {"high"|"medium"|"low"} minPriority
 * @returns {Array}
 */
export function filterByPriority(notifications, minPriority = 'medium') {
  const priorityOrder = { high: 3, medium: 2, low: 1 }
  const minLevel = priorityOrder[minPriority] || 1
  return notifications.filter(
    n => priorityOrder[n.priority] >= minLevel
  )
}