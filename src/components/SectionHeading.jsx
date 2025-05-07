const SectionHeading = ({ title, subtitle, centered = false }) => {
  return (
    <div 
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl font-bold mb-4">{title}</h2>
      {subtitle && <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">{subtitle}</p>}
    </div>
  )
}

export default SectionHeading
