import { Link } from 'react-router-dom'
import { FiSearch, FiCalendar, FiBriefcase } from 'react-icons/fi'
import ProcessStep from '../components/ProcessStep'
import SectionHeading from '../components/SectionHeading'

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find the Right Legal Expert for Your Needs
            </h1>
            <p className="text-xl mb-10">
              Connect with qualified lawyers and book appointments online or in person
            </p>
            
            <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg">
              <div className="flex flex-col md:flex-row">
                <div className="flex-grow mb-3 md:mb-0 md:mr-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <FiSearch className="w-5 h-5 text-neutral-400" />
                    </div>
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-3 border-0 rounded-md focus:ring-2 focus:ring-primary-500 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-white"
                      placeholder="Search by practice area or location..." 
                    />
                  </div>
                </div>
                <Link 
                  to="/lawyers"
                  className="btn btn-primary py-3 px-6"
                >
                  Find Lawyers
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="How LawLink Works"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <ProcessStep
              icon={FiSearch}
              title="Find a Lawyer"
              description="Search through our database of qualified lawyers by practice area, location, or ratings to find the perfect match for your legal needs."
              index={0}
            />
            <ProcessStep
              icon={FiCalendar}
              title="Book Appointment"
              description="Schedule an appointment with your chosen lawyer, either in person at their office or virtually through our secure online platform."
              index={1}
            />
            <ProcessStep
              icon={FiBriefcase}
              title="Get Legal Help"
              description="Meet with your lawyer to discuss your case and get the expert legal advice and representation you need to resolve your issues."
              index={2}
            />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home