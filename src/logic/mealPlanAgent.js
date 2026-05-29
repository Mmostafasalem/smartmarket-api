export function buildMealPlanPrompt(userProfile, bmrProfile, groceryList, goal, lang) {
    const en = lang === 'en'
    const targetCalories =
      goal === 'lose'
        ? bmrProfile.loseCalories
        : goal === 'gain'
        ? bmrProfile.gainCalories
        : bmrProfile.maintainCalories
  
    const macros = bmrProfile.macros
    const ingredientList = groceryList.length > 0
      ? groceryList.map(i => i.name).join(', ')
      : en ? 'chicken, eggs, oats, broccoli, brown rice' : 'vištiena, kiaušiniai, avižos, brokoliai, rudieji ryžiai'
  
    const goalText = en
      ? (goal === 'lose' ? 'lose weight' : goal === 'gain' ? 'gain muscle' : 'maintain weight')
      : (goal === 'lose' ? 'numesti svorio' : goal === 'gain' ? 'auginti raumenis' : 'išlaikyti svorį')
  
    const dietInfo = userProfile.dietaryOptions?.length > 0
      ? (en ? `Dietary restrictions: ${userProfile.dietaryOptions.join(', ')}.` : `Mitybos apribojimai: ${userProfile.dietaryOptions.join(', ')}.`)
      : ''
  
    const allergyInfo = userProfile.allergies?.length > 0
      ? (en ? `Allergies: ${userProfile.allergies.join(', ')}.` : `Alergijos: ${userProfile.allergies.join(', ')}.`)
      : ''
  
    if (en) {
      return `
  Create a 7-day meal plan for this person:
  - Age: ${userProfile.age} years
  - Gender: ${userProfile.gender === 'male' ? 'Male' : 'Female'}
  - Weight: ${userProfile.weight}kg, Height: ${userProfile.height}cm
  - Goal: ${goalText}
  - Daily calorie target: ${targetCalories} kcal
  - Daily macros: Protein ${macros.protein}g, Carbs ${macros.carbs}g, Fat ${macros.fat}g
  - Available ingredients from store: ${ingredientList}
  ${dietInfo}
  ${allergyInfo}
  
  Rules:
  - Use available ingredients as the base of every meal
  - Every day must have breakfast, lunch, dinner, and one snack
  - Each meal should be about 25-30% of daily calories
  - Keep meals simple and realistic to cook at home
  - Do not repeat the same meal on consecutive days
  - Use English for all meal and ingredient names
  
  Return ONLY a valid JSON object with no markdown, no explanation, no backticks:
  {
    "pirmadienis": {
      "pusryciai": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 450 },
      "pietūs": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 580 },
      "vakariene": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 620 },
      "uzkandziai": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 200 },
      "visoKcal": 1850
    },
    "antradienis": {},
    "treciadienis": {},
    "ketvirtadienis": {},
    "pentadienis": {},
    "sestadienis": {},
    "sekmadienis": {}
  }
  `
    }
  
    return `
  Sukurk 7 dienų mitybos planą šiam žmogui:
  - Amžius: ${userProfile.age} metai
  - Lytis: ${userProfile.gender === 'male' ? 'Vyras' : 'Moteris'}
  - Svoris: ${userProfile.weight}kg, Ūgis: ${userProfile.height}cm
  - Tikslas: ${goalText}
  - Kasdienė kalorijų norma: ${targetCalories} kcal
  - Makroelementai per dieną: Baltymai ${macros.protein}g, Angliavandeniai ${macros.carbs}g, Riebalai ${macros.fat}g
  - Turimi produktai iš parduotuvės: ${ingredientList}
  ${dietInfo}
  ${allergyInfo}
  
  Taisyklės:
  - Naudok turimus produktus kaip pagrindą kiekvienam patiekalui
  - Kiekvienai dienai turi būti: pusryčiai, pietūs, vakarienė ir užkandis
  - Kiekvienas patiekalas turi sudaryti apie 25-30% dienos kalorijų
  - Patiekalai turi būti paprasti ir realūs namie gaminti
  - Nevartok tų pačių patiekalų iš eilės dvi dienas
  - Naudok lietuviškus produktų pavadinimus
  
  Grąžink TIK validų JSON objektą be markdown, be paaiškinimų, be backtick simbolių:
  {
    "pirmadienis": {
      "pusryciai": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 450 },
      "pietūs": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 580 },
      "vakariene": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 620 },
      "uzkandziai": { "pavadinimas": "...", "ingredientai": ["...", "..."], "kcal": 200 },
      "visoKcal": 1850
    },
    "antradienis": {},
    "treciadienis": {},
    "ketvirtadienis": {},
    "pentadienis": {},
    "sestadienis": {},
    "sekmadienis": {}
  }
  `
  }
  
  export async function generateMealPlan(userProfile, bmrProfile, groceryList, goal, lang) {
    const prompt = buildMealPlanPrompt(userProfile, bmrProfile, groceryList, goal, lang)
  
    const response = await fetch('http://localhost:3001/api/anthropic/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4000,
        system: lang === 'en'
          ? 'You are a professional nutritionist and meal planner. Return only valid JSON with no markdown, no backticks, no explanations.'
          : 'Tu esi profesionalus mitybos specialistas ir patiekalų planuotojas. Grąžink tik validų JSON be markdown, be backtick simbolių, be jokių paaiškinimų.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  
    if (!response.ok) {
      throw new Error(lang === 'en' ? `API error: ${response.status}` : `API klaida: ${response.status}`)
    }
  
    const data = await response.json()
    const raw = data.content[0].text
    const clean = raw.replace(/```json|```/g, '').trim()
  
    try {
      return JSON.parse(clean)
    } catch (e) {
      throw new Error(lang === 'en' ? 'Failed to parse meal plan. Please try again.' : 'Nepavyko apdoroti mitybos plano. Bandyk dar kartą.')
    }
  }
  
  export async function generateGapFillers(currentMealPlan, targetCalories, macros, lang) {
    const en = lang === 'en'
  
    const prompt = en ? `
  Daily calorie target: ${targetCalories} kcal.
  Macros: Protein ${macros.protein}g, Carbs ${macros.carbs}g, Fat ${macros.fat}g.
  
  Suggest 3 simple snacks or mini meals to help reach the daily target.
  Return ONLY a valid JSON array:
  [
    {
      "pavadinimas": "...",
      "aprasymas": "...",
      "kcal": 150,
      "baltymai": 10,
      "angliavandeniai": 15,
      "riebalai": 5,
      "isGroceryList": false
    }
  ]
  ` : `
  Mitybos plano kasdienė kalorijų norma: ${targetCalories} kcal.
  Makroelementai: Baltymai ${macros.protein}g, Angliavandeniai ${macros.carbs}g, Riebalai ${macros.fat}g.
  
  Pasiūlyk 3 paprastus užkandžius ar mini patiekalus kurie padėtų pasiekti dienos tikslą.
  Grąžink TIK validų JSON masyvą:
  [
    {
      "pavadinimas": "...",
      "aprasymas": "...",
      "kcal": 150,
      "baltymai": 10,
      "angliavandeniai": 15,
      "riebalai": 5,
      "isGroceryList": false
    }
  ]
  `
  
    const response = await fetch('http://localhost:3001/api/anthropic/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: en
          ? 'You are a nutritionist. Return only valid JSON with no markdown.'
          : 'Tu esi mitybos specialistas. Grąžink tik validų JSON be markdown ir paaiškinimų.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  
    if (!response.ok) throw new Error(`API error: ${response.status}`)
  
    const data = await response.json()
    const raw = data.content[0].text
    const clean = raw.replace(/```json|```/g, '').trim()
  
    try {
      return JSON.parse(clean)
    } catch (e) {
      return []
    }
  }
  
  export async function generateShoppingAdvice(groceryList, goal, macros, lang) {
    const en = lang === 'en'
    const boughtItems = groceryList.map(i => i.name).join(', ') || (en ? 'nothing bought yet' : 'nieko nepirkta')
  
    const goalText = en
      ? (goal === 'lose' ? 'lose weight' : goal === 'gain' ? 'gain muscle' : 'maintain weight')
      : (goal === 'lose' ? 'numesti svorio' : goal === 'gain' ? 'auginti raumenis' : 'išlaikyti svorį')
  
    const prompt = en ? `
  The user wants to ${goalText}.
  Daily macros: Protein ${macros.protein}g, Carbs ${macros.carbs}g, Fat ${macros.fat}g.
  Already bought this week: ${boughtItems}.
  
  Suggest 4 additional items to buy this week to reach the goal.
  Return ONLY a valid JSON array:
  [
    {
      "produktas": "...",
      "priezastis": "...",
      "apytiksleCena": "€2.50",
      "kurPirkti": "Maxima",
      "makroNauda": "Fills protein gap"
    }
  ]
  ` : `
  Vartotojas nori ${goalText}.
  Makroelementai per dieną: Baltymai ${macros.protein}g, Angliavandeniai ${macros.carbs}g, Riebalai ${macros.fat}g.
  Šią savaitę jau nupirkta: ${boughtItems}.
  
  Pasiūlyk 4 papildomus produktus kuriuos reikėtų nusipirkti šią savaitę tikslui pasiekti.
  Grąžink TIK validų JSON masyvą:
  [
    {
      "produktas": "...",
      "priezastis": "...",
      "apytiksleCena": "€2.50",
      "kurPirkti": "Maxima",
      "makroNauda": "Papildo baltymų trūkumą"
    }
  ]
  `
  
    const response = await fetch('http://localhost:3001/api/anthropic/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: en
          ? 'You are a nutritionist. Return only valid JSON with no markdown.'
          : 'Tu esi mitybos specialistas. Grąžink tik validų JSON be markdown ir paaiškinimų.',
        messages: [{ role: 'user', content: prompt }],
      }),
    })
  
    if (!response.ok) throw new Error(`API error: ${response.status}`)
  
    const data = await response.json()
    const raw = data.content[0].text
    const clean = raw.replace(/```json|```/g, '').trim()
  
    try {
      return JSON.parse(clean)
    } catch (e) {
      return []
    }
  }