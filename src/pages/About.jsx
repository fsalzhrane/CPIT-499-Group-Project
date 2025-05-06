import SectionHeading from '../components/SectionHeading'
import { FiUsers, FiLayers, FiAward } from 'react-icons/fi'

const About = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="About LawLink"
            subtitle="We're connecting legal professionals with clients across Saudi Arabia through our innovative platform."
            centered
          />
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-neutral-50 dark:bg-neutral-800">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Made By Students"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <FiUsers className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Faisal Alzahrani</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
              </p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <FiUsers className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Mohammed Ismail</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
              </p>
            </div>
            
            <div className="card p-6 flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                <FiUsers className="w-8 h-8 text-primary-500" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Emad Alzahrani</h3>
              <p className="text-neutral-600 dark:text-neutral-400">
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default About