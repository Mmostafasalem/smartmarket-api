import { useState } from 'react'
import DealCard from '../shared/DealCard.jsx'
import ToastNotification from '../shared/ToastNotification.jsx'
import { useMarketDeals } from '../../hooks/useMarketDeals.js'

export default function Deals({ lang }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [toast, setToast] = useState(null)
  const en = lang === 'en'

  const t = {
    title: en ? "Today's Deals" : 'Nuolaidos',
    updated: en ? 'Updated' : 'Atnaujinta',
    refresh: en ? '🔄 Refresh' : '🔄 Atnaujinti',
    activeDeals: en ? 'Active deals' : 'Aktyvios nuolaidos',
    myItems: en ? 'My items' : 'Mano produktai',
    bought: en ? 'Bought' : 'Nupirkta',
    filters: {
      all: en ? 'All' : 'Visos',
      mine: en ? 'My items' : 'Mano produktai',
    },
    loading: en ? 'Loading deals...' : 'Kraunamos nuolaidos...',
    noDeals: en ? 'No deals found' : 'Nuolaidų nerasta',
    noDealsDesc: (f) => f === 'mine'
      ? (en ? 'No deals on your favorite items today' : 'Jūsų mėgstamiems produktams šiandien nuolaidų nėra')
      : (en ? 'No deals for this store today' : 'Šiai parduotuvei šiandien nuolaidų nėra'),
    added: (emoji) => en ? `${emoji} Added to grocery list!` : `${emoji} Pridėta į pirkinių sąrašą!`,
    skipped: en ? 'Deal skipped' : 'Nuolaida praleista',
  }

  const stores = ['all', 'mine', 'Maxima', 'Rimi', 'Iki', 'Norfa', 'Lidl']
  const storeLabels = { all: t.filters.all, mine: t.filters.mine }

  const {
    activeDeals,
    matchedDeals,
    groceryList,
    isLoading,
    lastUpdated,
    refreshDeals,
    markAsBought,
    skipDeal,
    getDealsByStore,
  } = useMarketDeals()

  const getFilteredDeals = () => {
    if (activeFilter === 'mine') return matchedDeals
    if (activeFilter === 'all') return activeDeals
    return getDealsByStore(activeFilter)
  }

  const filteredDeals = getFilteredDeals()

  const handleBuy = (deal) => {
    markAsBought(deal)
    setToast({ message: t.added(deal.emoji), type: 'success' })
  }

  const handleSkip = (deal) => {
    skipDeal(deal.id)
    setToast({ message: t.skipped, type: 'info' })
  }

  return (
    <div className="flex flex-col gap-4 pb-24">

      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">{t.title}</h1>
          {lastUpdated && (
            <p className="text-xs text-gray-400 mt-0.5">
              {t.updated}: {lastUpdated.toLocaleTimeString(en ? 'en-GB' : 'lt-LT')}
            </p>
          )}
        </div>
        <button
          onClick={refreshDeals}
          disabled={isLoading}
          className={`text-xs font-medium px-3 py-2 rounded-xl border border-gray-200 bg-white transition-all ${
            isLoading ? 'opacity-50' : 'active:scale-95'
          }`}
        >
          {isLoading ? '⏳' : t.refresh}
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 bg-blue-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-blue-600">{activeDeals.length}</p>
          <p className="text-xs text-blue-500">{t.activeDeals}</p>
        </div>
        <div className="flex-1 bg-green-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-green-600">{matchedDeals.length}</p>
          <p className="text-xs text-green-500">{t.myItems}</p>
        </div>
        <div className="flex-1 bg-amber-50 rounded-2xl p-3 text-center">
          <p className="text-xl font-bold text-amber-600">{groceryList.length}</p>
          <p className="text-xs text-amber-500">{t.bought}</p>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {stores.map(store => (
          <button
            key={store}
            onClick={() => setActiveFilter(store)}
            className={`flex-shrink-0 px-3 py-2 rounded-full text-xs font-medium border transition-all ${
              activeFilter === store
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200'
            }`}
          >
            {storeLabels[store] || store}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-sm text-gray-500">{t.loading}</p>
        </div>
      ) : filteredDeals.length === 0 ? (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 text-center">
          <p className="text-3xl mb-2">🔍</p>
          <p className="text-sm font-medium text-gray-700">{t.noDeals}</p>
          <p className="text-xs text-gray-400 mt-1">{t.noDealsDesc(activeFilter)}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredDeals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              onBuy={handleBuy}
              onSkip={handleSkip}
              isBought={groceryList.some(i => i.id === deal.id)}
              lang={lang}
            />
          ))}
        </div>
      )}
    </div>
  )
}