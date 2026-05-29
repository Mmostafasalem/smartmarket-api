import express from 'express'
import cors from 'cors'

const GROQ_API_KEY = 'YOgsk_74rWFi70p44fbH9gPog9WGdyb3FYJ2LneIkbwBYX9eOiVmlM4VO9'
const PORT = process.env.PORT || 3001

const app = express()
app.use(cors())
app.use(express.json())

// ── HELPER ──────────────────────────────────────────────
async function callGroq(system, prompt, maxTokens = 4000) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      max_tokens: maxTokens,
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: prompt },
      ],
    }),
  })
  const data = await response.json()
  const raw = data.choices?.[0]?.message?.content || ''
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

// ── BMR CALCULATION ──────────────────────────────────────
app.post('/api/bmr', (req, res) => {
  const { weight, height, age, gender, activityLevel } = req.body

  const bmr = gender === 'male'
    ? Math.round((10 * weight) + (6.25 * height) - (5 * age) + 5)
    : Math.round((10 * weight) + (6.25 * height) - (5 * age) - 161)

  const multipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
  }
  const tdee = Math.round(bmr * (multipliers[activityLevel] || 1.2))

  res.json({
    bmr,
    tdee,
    loseCalories: tdee - 350,
    maintainCalories: tdee,
    gainCalories: tdee + 350,
    macros: {
      protein: Math.round((tdee * 0.30) / 4),
      carbs: Math.round((tdee * 0.45) / 4),
      fat: Math.round((tdee * 0.25) / 9),
    }
  })
})

// ── DEALS ────────────────────────────────────────────────
app.get('/api/deals', (req, res) => {
  const deals = [
    { id: 1, name: "Siauliu vistienos krutinoele 1kg", brand: "Siauliu mesa", emoji: "🍗", store: "Maxima", originalPrice: 7.99, discountedPrice: 5.59, discount: 30, category: "protein", kcalPer100g: 165, proteinPer100g: 31, carbsPer100g: 0, fatPer100g: 3.6, weeklyQty: 1, unit: "kg", expiresIn: "today", allergens: [] },
    { id: 2, name: "Laisves kiausiniai L dydzio 10 vnt.", brand: "Laisves paukštynas", emoji: "🥚", store: "Rimi", originalPrice: 3.49, discountedPrice: 2.49, discount: 29, category: "protein", kcalPer100g: 155, proteinPer100g: 13, carbsPer100g: 1.1, fatPer100g: 11, weeklyQty: 1, unit: "pack", expiresIn: "2 days", allergens: ["eggs"] },
    { id: 3, name: "Atlantine lasisa file 300g", brand: "Marine Harvest", emoji: "🐟", store: "Maxima", originalPrice: 8.99, discountedPrice: 6.29, discount: 30, category: "protein", kcalPer100g: 208, proteinPer100g: 20, carbsPer100g: 0, fatPer100g: 13, weeklyQty: 2, unit: "pack", expiresIn: "today", allergens: ["fish"] },
    { id: 4, name: "Zemaitijos varske 9% 500g", brand: "Zemaitijos pienas", emoji: "🧀", store: "Iki", originalPrice: 3.29, discountedPrice: 2.29, discount: 30, category: "protein", kcalPer100g: 156, proteinPer100g: 17, carbsPer100g: 3.2, fatPer100g: 9, weeklyQty: 2, unit: "pack", expiresIn: "3 days", allergens: ["dairy"] },
    { id: 5, name: "Rokiskio graikiskas jogurtas 0% 400g", brand: "Rokiskio suris", emoji: "🥛", store: "Rimi", originalPrice: 2.99, discountedPrice: 1.99, discount: 33, category: "protein", kcalPer100g: 57, proteinPer100g: 10, carbsPer100g: 4, fatPer100g: 0.1, weeklyQty: 3, unit: "tub", expiresIn: "2 days", allergens: ["dairy"] },
    { id: 6, name: "Iki tuno konservai 160g", brand: "Iki", emoji: "🐡", store: "Iki", originalPrice: 1.89, discountedPrice: 1.19, discount: 37, category: "protein", kcalPer100g: 116, proteinPer100g: 26, carbsPer100g: 0, fatPer100g: 1, weeklyQty: 3, unit: "can", expiresIn: "5 days", allergens: ["fish"] },
    { id: 7, name: "Rimi aviziniai dribsniai 1kg", brand: "Rimi", emoji: "🌾", store: "Rimi", originalPrice: 2.19, discountedPrice: 1.49, discount: 32, category: "carbs", kcalPer100g: 389, proteinPer100g: 17, carbsPer100g: 66, fatPer100g: 7, weeklyQty: 1, unit: "pack", expiresIn: "7 days", allergens: [] },
    { id: 8, name: "Ryziu namai rudieji ryziai 1kg", brand: "Ryziu namai", emoji: "🍚", store: "Iki", originalPrice: 2.79, discountedPrice: 1.99, discount: 29, category: "carbs", kcalPer100g: 370, proteinPer100g: 7.9, carbsPer100g: 77, fatPer100g: 2.9, weeklyQty: 1, unit: "pack", expiresIn: "7 days", allergens: [] },
    { id: 9, name: "Bananai Ekvadoras 1kg", brand: "Fresh and Go", emoji: "🍌", store: "Norfa", originalPrice: 1.39, discountedPrice: 0.89, discount: 36, category: "carbs", kcalPer100g: 89, proteinPer100g: 1.1, carbsPer100g: 23, fatPer100g: 0.3, weeklyQty: 2, unit: "kg", expiresIn: "3 days", allergens: [] },
    { id: 10, name: "Brokoliai 500g", brand: "Lietuviska", emoji: "🥦", store: "Maxima", originalPrice: 1.99, discountedPrice: 1.29, discount: 35, category: "vegetable", kcalPer100g: 34, proteinPer100g: 2.8, carbsPer100g: 7, fatPer100g: 0.4, weeklyQty: 2, unit: "pack", expiresIn: "3 days", allergens: [] },
    { id: 11, name: "Spinatai 250g", brand: "Garden Fresh", emoji: "🥬", store: "Rimi", originalPrice: 1.89, discountedPrice: 1.29, discount: 32, category: "vegetable", kcalPer100g: 23, proteinPer100g: 2.9, carbsPer100g: 3.6, fatPer100g: 0.4, weeklyQty: 2, unit: "pack", expiresIn: "2 days", allergens: [] },
    { id: 12, name: "Avokadas 2 vnt.", brand: "Fresh and Go", emoji: "🥑", store: "Rimi", originalPrice: 2.79, discountedPrice: 1.89, discount: 32, category: "fat", kcalPer100g: 160, proteinPer100g: 2, carbsPer100g: 9, fatPer100g: 15, weeklyQty: 1, unit: "pack", expiresIn: "3 days", allergens: [] },
    { id: 13, name: "Olive de Espana alyvuogiu aliejus 500ml", brand: "Olive de Espana", emoji: "🫒", store: "Maxima", originalPrice: 7.99, discountedPrice: 5.49, discount: 31, category: "fat", kcalPer100g: 884, proteinPer100g: 0, carbsPer100g: 0, fatPer100g: 100, weeklyQty: 1, unit: "bottle", expiresIn: "7 days", allergens: [] },
    { id: 14, name: "Zemaitijos sviestas 82% 200g", brand: "Zemaitijos pienas", emoji: "🧈", store: "Iki", originalPrice: 2.99, discountedPrice: 1.99, discount: 33, category: "fat", kcalPer100g: 717, proteinPer100g: 0.6, carbsPer100g: 0.4, fatPer100g: 82, weeklyQty: 1, unit: "pack", expiresIn: "5 days", allergens: ["dairy"] },
  ]

  // Randomly vary prices slightly to simulate live data
  const shuffled = deals.sort(() => Math.random() - 0.5).slice(0, 8 + Math.floor(Math.random() * 4))
  const varied = shuffled.map(d => ({
    ...d,
    discountedPrice: Math.round(d.discountedPrice * (0.95 + Math.random() * 0.1) * 100) / 100,
    discount: Math.floor(d.discount * (0.9 + Math.random() * 0.2)),
  }))

  res.json(varied)
})

// ── MEAL PLAN ────────────────────────────────────────────
app.post('/api/meal-plan', async (req, res) => {
  const { user, bmrData, groceryList, goal, lang } = req.body
  const en = lang === 'en'

  const targetCalories = goal === 'lose'
    ? bmrData.loseCalories
    : goal === 'gain'
    ? bmrData.gainCalories
    : bmrData.maintainCalories

  const ingredients = groceryList?.length > 0
    ? groceryList.map(i => i.name).join(', ')
    : en ? 'chicken, eggs, oats, broccoli, brown rice' : 'vištiena, kiaušiniai, avižos, brokoliai, rudieji ryžiai'

  const goalText = en
    ? (goal === 'lose' ? 'lose weight' : goal === 'gain' ? 'gain muscle' : 'maintain weight')
    : (goal === 'lose' ? 'numesti svorio' : goal === 'gain' ? 'auginti raumenis' : 'išlaikyti svorį')

  const system = en
    ? 'You are a professional nutritionist. Return only valid JSON with no markdown, no backticks, no explanation.'
    : 'Tu esi profesionalus mitybos specialistas. Grąžink tik validų JSON be markdown, be backtick simbolių.'

  const prompt = en ? `
Create a 7-day meal plan for:
- Age: ${user.age}, Gender: ${user.gender === 'male' ? 'Male' : 'Female'}
- Weight: ${user.weight}kg, Height: ${user.height}cm
- Goal: ${goalText}
- Daily calories: ${targetCalories} kcal
- Macros: Protein ${bmrData.macros.protein}g, Carbs ${bmrData.macros.carbs}g, Fat ${bmrData.macros.fat}g
- Available ingredients: ${ingredients}

Rules:
- Use available ingredients as base of every meal
- Every day: breakfast, lunch, dinner, snack
- Each meal ~25-30% of daily calories
- Simple home-cooked meals
- No repeated meals on consecutive days
- Use English for all names

Return ONLY valid JSON:
{
  "pirmadienis": {
    "pusryciai": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 450 },
    "pietūs": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 580 },
    "vakariene": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 620 },
    "uzkandziai": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 200 },
    "visoKcal": 1850
  },
  "antradienis": {},
  "treciadienis": {},
  "ketvirtadienis": {},
  "pentadienis": {},
  "sestadienis": {},
  "sekmadienis": {}
}` : `
Sukurk 7 dienų mitybos planą:
- Amžius: ${user.age}, Lytis: ${user.gender === 'male' ? 'Vyras' : 'Moteris'}
- Svoris: ${user.weight}kg, Ūgis: ${user.height}cm
- Tikslas: ${goalText}
- Kalorijos: ${targetCalories} kcal
- Makroelementai: Baltymai ${bmrData.macros.protein}g, Angliavandeniai ${bmrData.macros.carbs}g, Riebalai ${bmrData.macros.fat}g
- Produktai: ${ingredients}

Grąžink TIK validų JSON:
{
  "pirmadienis": {
    "pusryciai": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 450 },
    "pietūs": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 580 },
    "vakariene": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 620 },
    "uzkandziai": { "pavadinimas": "...", "ingredientai": ["..."], "kcal": 200 },
    "visoKcal": 1850
  },
  "antradienis": {},
  "treciadienis": {},
  "ketvirtadienis": {},
  "pentadienis": {},
  "sestadienis": {},
  "sekmadienis": {}
}`

  try {
    const plan = await callGroq(system, prompt, 4000)
    res.json(plan)
  } catch (err) {
    console.error('Meal plan error:', err)
    res.status(500).json({ error: err.message })
  }
})

// ── GAP FILLERS ──────────────────────────────────────────
app.post('/api/gap-fillers', async (req, res) => {
  const { targetCalories, macros, lang } = req.body
  const en = lang === 'en'

  const system = en
    ? 'You are a nutritionist. Return only valid JSON array with no markdown.'
    : 'Tu esi mitybos specialistas. Grąžink tik validų JSON masyvą be markdown.'

  const prompt = en ? `
Daily target: ${targetCalories} kcal.
Macros: Protein ${macros.protein}g, Carbs ${macros.carbs}g, Fat ${macros.fat}g.
Suggest 3 simple snacks to help reach the daily target.
Return ONLY a JSON array:
[{ "pavadinimas": "...", "aprasymas": "...", "kcal": 150, "baltymai": 10, "angliavandeniai": 15, "riebalai": 5 }]
` : `
Norma: ${targetCalories} kcal. Baltymai ${macros.protein}g, Angliavandeniai ${macros.carbs}g, Riebalai ${macros.fat}g.
Pasiūlyk 3 užkandžius.
Grąžink TIK JSON masyvą:
[{ "pavadinimas": "...", "aprasymas": "...", "kcal": 150, "baltymai": 10, "angliavandeniai": 15, "riebalai": 5 }]
`

  try {
    const fillers = await callGroq(system, prompt, 1000)
    res.json(fillers)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── SHOPPING ADVICE ──────────────────────────────────────
app.post('/api/shopping-advice', async (req, res) => {
  const { groceryList, goal, macros, lang } = req.body
  const en = lang === 'en'
  const bought = groceryList?.map(i => i.name).join(', ') || (en ? 'nothing yet' : 'nieko')
  const goalText = en
    ? (goal === 'lose' ? 'lose weight' : goal === 'gain' ? 'gain muscle' : 'maintain weight')
    : (goal === 'lose' ? 'numesti svorio' : goal === 'gain' ? 'auginti raumenis' : 'išlaikyti svorį')

  const system = en
    ? 'You are a nutritionist. Return only valid JSON array with no markdown.'
    : 'Tu esi mitybos specialistas. Grąžink tik validų JSON masyvą be markdown.'

  const prompt = en ? `
Goal: ${goalText}. Macros: P${macros.protein}g C${macros.carbs}g F${macros.fat}g.
Already bought: ${bought}.
Suggest 4 items to buy this week.
Return ONLY JSON array:
[{ "produktas": "...", "priezastis": "...", "apytiksleCena": "€2.50", "kurPirkti": "Maxima", "makroNauda": "..." }]
` : `
Tikslas: ${goalText}. Baltymai ${macros.protein}g, Angliavandeniai ${macros.carbs}g, Riebalai ${macros.fat}g.
Jau nupirkta: ${bought}.
Pasiūlyk 4 produktus.
Grąžink TIK JSON masyvą:
[{ "produktas": "...", "priezastis": "...", "apytiksleCena": "€2.50", "kurPirkti": "Maxima", "makroNauda": "..." }]
`

  try {
    const advice = await callGroq(system, prompt, 1000)
    res.json(advice)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── HEALTH CHECK ─────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0', service: 'SmartMarket API' })
})

app.listen(PORT, () => {
  console.log(`SmartMarket API running on http://localhost:${PORT}`)
})