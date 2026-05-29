import { useEffect, useState } from 'react'

export default function DealNotification({ notification, onBuy, onSkip, lang }) {
  const [visible, setVisible] = useState(false)
  const en = lang === 'en'

  const t = {
    newDeal: en ? '🔔 New deal on your list!' : '🔔 Nauja nuolaida jūsų sąraše!',
    high: en ? '🔥 High' : '🔥 Aukšta',
    medium: en ? '⚡ Medium' : '⚡ Vidutinė',
    expires: en ? 'Expires' : 'Baigiasi',
    saved: en ? 'Saved' : 'Sutaupote',
    skip: en ? 'Skip' : 'Praleisti',
    buy: en ? '✓ Yes, I bought it!' : '✓ Taip, nupirkau!',
    autoDismiss: en ? 'Auto-closes in 8 seconds' : 'Automatiškai užsidarys po 8 sekundžių',
  }

  useEffect(() => {
    setTimeout(() => setVisible(true), 10)
    const timer = setTimeout(() => handleSkip(), 8000)
    return () => clearTimeout(timer)
  }, [])

  const handleSkip = () => {
    setVisible(false)
    setTimeout(() => onSkip(notification.id), 300)
  }

  const handleBuy = () => {
    setVisible(false)
    setTimeout(() => onBuy(notification.dealItem), 300)
  }

  if (!notification) return null

  return (
    <>
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
          visible ? 'opacity-30' : 'opacity-0'
        }`}
        onClick={handleSkip}
      />
      <div
        className={`fixed bottom-0 left-0 right-0 flex justify-center z-50 transition-transform duration-300 ${
          visible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="w-full max-w-sm bg-white rounded-t-3xl p-6 shadow-2xl">
          <button
            onClick={handleSkip}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 text-lg"
          >
            ×
          </button>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {t.newDeal}
            </span>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
              notification.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'
            }`}>
              {notification.priority === 'high' ? t.high : t.medium}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl">
              {notification.emoji}
            </div>
            <div>
              <p className="text-base font-bold text-gray-900">{notification.productName}</p>
              <p className="text-sm text-gray-500">{notification.storeName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{t.expires}: {notification.expiresIn}</p>
            </div>
          </div>

          <div className="bg-green-50 rounded-2xl p-4 mb-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">€{notification.discountedPrice}</p>
                <p className="text-sm line-through text-gray-400">€{notification.originalPrice}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-green-600">-{notification.discountPercent}%</p>
                <p className="text-xs text-green-600 font-medium">
                  {t.saved} €{(notification.originalPrice - notification.discountedPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 py-3 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 bg-white active:scale-95 transition-all"
            >
              {t.skip}
            </button>
            <button
              onClick={handleBuy}
              className="flex-1 py-3 rounded-xl text-sm font-semibold bg-blue-600 text-white active:scale-95 transition-all"
            >
              {t.buy}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">{t.autoDismiss}</p>
        </div>
      </div>
    </>
  )
}