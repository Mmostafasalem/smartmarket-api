import { useEffect, useState } from 'react'

export default function ToastNotification({ message, type = 'success', onDismiss }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Slide in
    setTimeout(() => setVisible(true), 10)

    // Auto dismiss after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onDismiss, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500',
    warning: 'bg-amber-500',
  }

  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️',
  }

  return (
    <div className="fixed top-4 left-0 right-0 flex justify-center z-50 px-4">
      <div
        className={`${colors[type]} text-white px-4 py-3 rounded-2xl shadow-lg flex items-center gap-3 max-w-sm w-full transition-all duration-300 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
        }`}
      >
        <span className="text-lg">{icons[type]}</span>
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={() => {
            setVisible(false)
            setTimeout(onDismiss, 300)
          }}
          className="text-white opacity-70 hover:opacity-100 text-lg leading-none"
        >
          ×
        </button>
      </div>
    </div>
  )
}