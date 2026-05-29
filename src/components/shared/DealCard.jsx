export default function DealCard({ deal, onBuy, onSkip, isBought, lang }) {
    const en = lang === 'en'
  
    const t = {
      skip: en ? 'Skip' : 'Praleisti',
      bought: en ? '✓ Bought it' : '✓ Nupirkau',
      added: en ? '✅ Added to grocery list' : '✅ Pridėta į pirkinių sąrašą',
      saved: en ? 'Saved' : 'Sutaupote',
      expires: en ? 'Expires' : 'Baigiasi',
      kcal: 'kcal',
      protein: en ? 'P' : 'B',
      carbs: en ? 'C' : 'A',
    }
  
    const categoryColors = {
      protein: 'bg-red-50',
      carbs: 'bg-amber-50',
      vegetable: 'bg-green-50',
      fat: 'bg-yellow-50',
    }
  
    return (
      <div className={`w-full rounded-2xl p-4 border transition-all ${
        isBought ? 'bg-green-50 border-green-200' : 'bg-white border-gray-100'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            categoryColors[deal.category] || 'bg-gray-50'
          }`}>
            {deal.emoji}
          </div>
  
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 leading-tight">{deal.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {deal.store} · {t.expires}: {deal.expiresIn}
                </p>
              </div>
              <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
                -{deal.discount}%
              </span>
            </div>
  
            <div className="flex items-center gap-2 mt-2">
              <span className="text-lg font-bold text-gray-900">€{deal.discountedPrice}</span>
              <span className="text-sm line-through text-gray-400">€{deal.originalPrice}</span>
              <span className="text-xs text-green-600 font-medium">
                {t.saved} €{(deal.originalPrice - deal.discountedPrice).toFixed(2)}
              </span>
            </div>
  
            <div className="flex gap-2 mt-1">
              <span className="text-xs text-gray-400">{deal.kcalPer100g} {t.kcal}</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{t.protein}: {deal.proteinPer100g}g</span>
              <span className="text-xs text-gray-400">·</span>
              <span className="text-xs text-gray-400">{t.carbs}: {deal.carbsPer100g}g</span>
            </div>
          </div>
        </div>
  
        {!isBought ? (
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => onSkip(deal)}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 bg-white active:scale-95 transition-all"
            >
              {t.skip}
            </button>
            <button
              onClick={() => onBuy(deal)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-blue-600 text-white active:scale-95 transition-all"
            >
              {t.bought}
            </button>
          </div>
        ) : (
          <div className="mt-3 py-2.5 rounded-xl text-sm font-medium text-center bg-green-100 text-green-700">
            {t.added}
          </div>
        )}
      </div>
    )
  }