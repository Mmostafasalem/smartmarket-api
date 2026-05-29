export default function DonutChart({ value, max, color = '#2563eb', size = 120, label, sublabel }) {
    const radius = 45
    const circumference = 2 * Math.PI * radius
    const progress = max > 0 ? Math.min(value / max, 1) : 0
    const strokeDashoffset = circumference - progress * circumference
  
    return (
      <div className="flex flex-col items-center">
        <div className="relative" style={{ width: size, height: size }}>
          <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className="-rotate-90"
            style={{ transform: 'rotate(-90deg)' }}
          >
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-gray-900">{value}</span>
            {sublabel && <span className="text-xs text-gray-400">{sublabel}</span>}
          </div>
        </div>
        {label && (
          <p className="text-xs text-gray-500 mt-1 font-medium">{label}</p>
        )}
      </div>
    )
  }