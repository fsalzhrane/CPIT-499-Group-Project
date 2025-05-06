// import { motion } from 'framer-motion'

const ServiceCard = ({ title, description, icon: Icon, color }) => {
  const bgColorClass = `bg-${color}-50 dark:bg-${color}-900/20`
  const textColorClass = `text-${color}-500`

  return (
    <div 
      className="card p-6 h-full"
    >
      <div className={`w-12 h-12 rounded-full ${bgColorClass} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${textColorClass}`} />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  )
}

export default ServiceCard