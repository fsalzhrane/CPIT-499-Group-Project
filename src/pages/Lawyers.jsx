import { useState, useEffect } from 'react'
import { FiSearch, FiMapPin } from 'react-icons/fi'
import LawyerCard from '../components/LawyerCard'
import SectionHeading from '../components/SectionHeading'
import { supabase } from '../lib/supabase'

const Lawyers = () => {
  const [lawyers, setLawyers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpecialization, setSelectedSpecialization] = useState('All specializations')
  const [selectedLocation, setSelectedLocation] = useState('All locations')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    fetchLawyers()
  }, [])
  
  const fetchLawyers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('lawyers')
        .select(`
          id,
          user_id,
          specialization,
          location,
          experience_years,
          bio,
          education,
          languages,
          rating,
          review_count,
          users!inner (
            id,
            full_name,
            email
          )
        `)
        .eq('users.user_type', 'lawyer')
      
      if (error) throw error
      
      const formattedLawyers = data.map(lawyer => ({
        ...lawyer,
        full_name: lawyer.users?.full_name
      }))
      
      setLawyers(formattedLawyers)
    } catch (err) {
      console.error('Error fetching lawyers:', err)
      setError('Failed to load lawyers. Please try again later.')
    } finally {
      setLoading(false)
    }
  }
  
  const specializations = ['All specializations', ...new Set(lawyers.map(lawyer => lawyer.specialization))]
  const locations = ['All locations', ...new Set(lawyers.map(lawyer => lawyer.location))]
  
  const filteredLawyers = lawyers.filter(lawyer => {
    const matchesSearch = searchTerm === '' || 
      lawyer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      lawyer.specialization.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesSpecialization = selectedSpecialization === 'All specializations' || 
      lawyer.specialization === selectedSpecialization
    
    const matchesLocation = selectedLocation === 'All locations' || 
      lawyer.location === selectedLocation
    
    return matchesSearch && matchesSpecialization && matchesLocation
  })

  return (
    <div>
      <section className="py-12 bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4">
          <SectionHeading title="Find a Lawyer" />
          
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Search
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiSearch className="w-5 h-5 text-neutral-400" />
                  </div>
                  <input 
                    type="text" 
                    id="search"
                    className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                    placeholder="Search by name or specialization" 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="specialization" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Specialization
                </label>
                <select 
                  id="specialization" 
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                >
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Location
                </label>
                <select 
                  id="location" 
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-700 dark:text-white"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-lg text-neutral-600 dark:text-neutral-400">Loading lawyers...</p>
              </div>
            ) : error ? (
              <div className="col-span-3 text-center py-8">
                <p className="text-lg text-error-500">{error}</p>
              </div>
            ) : filteredLawyers.length > 0 ? (
              filteredLawyers.map((lawyer) => (
                <LawyerCard key={lawyer.id} lawyer={lawyer} />
              ))
            ) : (
              <div className="col-span-3 text-center py-8">
                <p className="text-lg text-neutral-600 dark:text-neutral-400">No lawyers found matching your criteria.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Lawyers