import ServiceCard from '../components/ServiceCard'
import SectionHeading from '../components/SectionHeading'
import services from '../data/services'

const Services = () => {
  return (
    <div>
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Our Services" 
            subtitle="LawLink offers a range of legal services to meet your needs, connecting you with qualified lawyers specializing in various areas of law."
            centered
          />
          
          <div className="mt-16">
            <SectionHeading
              title="Legal Practice Areas"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {services.map((service) => (
                <ServiceCard 
                  key={service.id}
                  title={service.title}
                  description={service.description}
                  icon={service.icon}
                  color={service.color}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services