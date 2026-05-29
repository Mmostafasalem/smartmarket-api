import { MARKET_DATA } from '../data/vilniusMarkets.js'

/**
 * Optimize basket from available deals
 * @param {Array} favoriteFoods - food IDs user favorited
 * @param {Array} activeDeals - current discounted items
 * @param {number} budget - euros
 * @param {Array} dietaryOptions - ["be gliuteno", etc]
 * @param {Array} allergies - ["pienas", etc]
 * @returns {Object}
 */
export function optimizeBasket(
  favoriteFoods,
  activeDeals,
  budget,
  dietaryOptions,
  allergies
) {
  const effectiveBudget = budget || 50

  // Filter deals to only favorites
  let candidates = activeDeals.filter(deal =>
    favoriteFoods.some(favId => {
      const marketItem = MARKET_DATA.find(m => m.id === deal.id)
      if (!marketItem) return false
      // Match by category if no direct ID match
      return deal.id === favId || marketItem.category === getFoodCategory(favId)
    })
  )

  // If no favorites match, use all active deals
  if (candidates.length === 0) candidates = [...activeDeals]

  // Filter out allergens
  if (allergies && allergies.length > 0) {
    candidates = candidates.filter(item =>
      !item.allergens?.some(a => allergies.includes(a))
    )
  }

  // Filter by dietary options
  if (dietaryOptions && dietaryOptions.length > 0) {
    candidates = candidates.filter(item =>
      dietaryOptions.every(opt => item.dietaryTags?.includes(opt))
    )
  }

  // Sort by discount % descending
  candidates.sort((a, b) => b.discount - a.discount)

  // Select best combination by category
  const selected = []
  const categories = {
    protein: 0,
    carbs: 0,
    vegetable: 0,
    fat: 0,
  }

  const minimums = {
    protein: 3,
    carbs: 2,
    vegetable: 2,
    fat: 1,
  }

  let runningCost = 0

  // First pass: fill minimums
  for (const category of Object.keys(minimums)) {
    const needed = minimums[category]
    const categoryItems = candidates.filter(
      item => item.category === category && !selected.find(s => s.id === item.id)
    )

    for (const item of categoryItems) {
      if (categories[category] >= needed) break
      const itemCost = item.discountedPrice * (item.weeklyQty || 1)
      if (runningCost + itemCost <= effectiveBudget) {
        selected.push(item)
        categories[category]++
        runningCost += itemCost
      }
    }
  }

  // Second pass: fill remaining budget
  for (const item of candidates) {
    if (selected.find(s => s.id === item.id)) continue
    const itemCost = item.discountedPrice * (item.weeklyQty || 1)
    if (runningCost + itemCost <= effectiveBudget) {
      selected.push(item)
      runningCost += itemCost
    }
  }

  // Calculate savings
  const totalOriginalCost = selected.reduce(
    (sum, item) => sum + item.originalPrice * (item.weeklyQty || 1), 0
  )
  const totalCost = selected.reduce(
    (sum, item) => sum + item.discountedPrice * (item.weeklyQty || 1), 0
  )
  const totalSavings = totalOriginalCost - totalCost
  const savingsPercent = Math.round((totalSavings / totalOriginalCost) * 100)

  // Find missing categories
  const missingCategories = Object.entries(categories)
    .filter(([cat, count]) => count < minimums[cat])
    .map(([cat]) => cat)

  return {
    recommendedItems: selected,
    totalCost: Math.round(totalCost * 100) / 100,
    totalSavings: Math.round(totalSavings * 100) / 100,
    savingsPercent,
    missingCategories,
  }
}

/**
 * Generate shopping recommendations to fill macro gaps
 * @param {Array} groceryList - already bought items
 * @param {Object} macros - { protein, carbs, fat }
 * @param {Array} marketData - full market data
 * @returns {Array}
 */
export function generateShoppingRecommendations(groceryList, macros, marketData) {
  const data = marketData || MARKET_DATA
  const boughtIds = groceryList.map(i => i.id)

  // Find what categories are missing from grocery list
  const boughtCategories = new Set(groceryList.map(i => i.category))
  const allCategories = ['protein', 'carbs', 'vegetable', 'fat']
  const missingCategories = allCategories.filter(c => !boughtCategories.has(c))

  // Get recommendations for missing categories first
  const recommendations = []

  for (const category of missingCategories) {
    const item = data
      .filter(i => i.category === category && !boughtIds.includes(i.id))
      .sort((a, b) => b.discount - a.discount)[0]
    if (item) recommendations.push(item)
  }

  // Fill up to 5 recommendations with highest discount items
  const remaining = data
    .filter(i => !boughtIds.includes(i.id) && !recommendations.find(r => r.id === i.id))
    .sort((a, b) => b.discount - a.discount)

  for (const item of remaining) {
    if (recommendations.length >= 5) break
    recommendations.push(item)
  }

  return recommendations.slice(0, 5)
}

/**
 * Format grocery list grouped by store
 * @param {Array} groceryList
 * @returns {Object}
 */
export function formatShoppingList(groceryList) {
  if (!groceryList || groceryList.length === 0) {
    return {
      stores: [],
      grandTotal: 0,
      totalSavings: 0,
      savingsPercent: 0,
      plainText: 'Pirkinių sąrašas tuščias.',
    }
  }

  // Group by store
  const storeMap = {}

  groceryList.forEach(item => {
    const store = item.store || 'Kita'
    if (!storeMap[store]) storeMap[store] = []
    storeMap[store].push({
      name: item.name,
      emoji: item.emoji,
      qty: item.weeklyQty || 1,
      unit: item.unit || 'vnt.',
      price: item.discountedPrice,
      totalPrice: Math.round(item.discountedPrice * (item.weeklyQty || 1) * 100) / 100,
    })
  })

  const stores = Object.entries(storeMap).map(([name, items]) => ({
    name,
    items,
    storeTotal: Math.round(
      items.reduce((sum, i) => sum + i.totalPrice, 0) * 100
    ) / 100,
  }))

  const grandTotal = Math.round(
    stores.reduce((sum, s) => sum + s.storeTotal, 0) * 100
  ) / 100

  const totalOriginal = groceryList.reduce(
    (sum, item) => sum + item.originalPrice * (item.weeklyQty || 1), 0
  )
  const totalSavings = Math.round((totalOriginal - grandTotal) * 100) / 100
  const savingsPercent = Math.round((totalSavings / totalOriginal) * 100)

  // Build plain text list
  let plainText = '🛒 PIRKINIŲ SĄRAŠAS — SmartMarket\n'
  plainText += '─'.repeat(35) + '\n\n'

  stores.forEach(store => {
    plainText += `📍 ${store.name.toUpperCase()}\n`
    store.items.forEach(item => {
      plainText += `☐ ${item.emoji} ${item.name} x${item.qty} ${item.unit} — €${item.totalPrice.toFixed(2)}\n`
    })
    plainText += `Viso: €${store.storeTotal.toFixed(2)}\n\n`
  })

  plainText += '─'.repeat(35) + '\n'
  plainText += `💰 Bendra suma: €${grandTotal.toFixed(2)}\n`
  plainText += `✅ Sutaupyta: €${totalSavings.toFixed(2)} (${savingsPercent}%)\n`

  return {
    stores,
    grandTotal,
    totalSavings,
    savingsPercent,
    plainText,
  }
}

/**
 * Helper: get category from food ID
 */
function getFoodCategory(foodId) {
  const categoryMap = {
    101: 'protein', 102: 'protein', 103: 'protein', 104: 'protein',
    105: 'protein', 106: 'protein', 107: 'protein', 108: 'protein',
    109: 'carbs', 110: 'carbs', 111: 'carbs', 112: 'carbs',
    113: 'carbs', 114: 'carbs', 115: 'vegetable', 116: 'vegetable',
    117: 'vegetable', 118: 'vegetable', 119: 'fat', 120: 'fat',
    121: 'fat', 122: 'fat', 123: 'carbs', 124: 'vegetable',
  }
  return categoryMap[foodId] || 'other'
}