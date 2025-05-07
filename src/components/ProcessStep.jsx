const ProcessStep = ({ icon: Icon, title, description, index }) => {
  return (
    <div 
      className="flex flex-col items-center text-center"
    >
      <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  )
}

export default ProcessStep
