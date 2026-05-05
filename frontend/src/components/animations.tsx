import CountUp from 'react-countup'
import { motion } from 'framer-motion'

type NumberProps = { 
  value: number 
  label?: string
  duration?: number
  suffix?: string 
}

export function AnimatedNumber({ value, label, duration = 10, suffix = '' }: NumberProps) {
  return (
    <div style={{ textAlign: 'center', minWidth: 120 }}>
      <div style={{ fontSize: 28, fontWeight: 700 }}>
        <CountUp end={value} duration={duration} separator="," />{suffix}
      </div>
      {label && <div style={{ fontSize: 12, color: '#666' }}>{label}</div>}
    </div>
  )
}