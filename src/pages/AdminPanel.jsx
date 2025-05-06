import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import SectionHeading from '../components/SectionHeading'

const AdminPanel = () => {
  const { userProfile } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [lawyers, setLawyers] = useState([])
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedLawyer, setSelectedLawyer] = useState(null)
  const [editMode, setEditMode] = useState(false)

  useEffect(() => {
    if (!userProfile || userProfile.user_type !== 'admin') {
      navigate('/')
      return
    }
    
    fetchData()
  }, [userProfile, navigate])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [usersData, lawyersData, appointmentsData] = await Promise.all([
        supabase.from('users').select('*').order('created_at', { ascending: false }),
        supabase.from('lawyers').select('*, users!inner(*)').order('created_at', { ascending: false }),
        supabase.from('appointments').select(`
          *,
          users!appointments_client_id_fkey(full_name, email),
          lawyers(id, users(full_name, email))
        `).order('date_time', { ascending: false })
      ])

      if (usersData.error) throw usersData.error
      if (lawyersData.error) throw lawyersData.error
      if (appointmentsData.error) throw appointmentsData.error

      setUsers(usersData.data)
      setLawyers(lawyersData.data)
      setAppointments(appointmentsData.data)
    } catch (err) {
      console.error('Error fetching data:', err)
      setError('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)

      if (error) throw error

      setUsers(users.filter(user => user.id !== userId))
    } catch (err) {
      console.error('Error deleting user:', err)
      setError('Failed to delete user')
    }
  }

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)

      if (error) throw error

      setAppointments(appointments.filter(appointment => appointment.id !== appointmentId))
    } catch (err) {
      console.error('Error deleting appointment:', err)
      setError('Failed to delete appointment')
    }
  }

  const handleUpdateLawyer = async (lawyerId, updates) => {
    console.log('Updating lawyer:', lawyerId, 'with data:', updates);
    try {
      const { data, error } = await supabase
        .from('lawyers')
        .update(updates)
        .eq('id', lawyerId)
        .select(); // Get the updated row back

      console.log('Supabase update response:', data, error);

      if (error) throw error;

      // Use the data returned from Supabase to update local state
      // This ensures the local state matches the database state
      if (data && data.length > 0) {
        const updatedLawyerFromServer = data[0];
        setLawyers(currentLawyers =>
          currentLawyers.map(lawyer =>
            lawyer.id === lawyerId ? { ...lawyer, ...updatedLawyerFromServer, users: lawyer.users } : lawyer
          )
        );
      } else {
        // Fallback if select doesn't return data (should not happen on successful update)
        setLawyers(currentLawyers =>
          currentLawyers.map(lawyer =>
            lawyer.id === lawyerId ? { ...lawyer, ...updates, users: lawyer.users } : lawyer
          )
        );
      }
      
      // Optionally, re-fetch all data to ensure AdminPanel list is fully in sync
      // if other background processes might change lawyer data.
      // await fetchData(); // Uncomment if you suspect other changes or want to be absolutely sure

      setSelectedLawyer(null);
      setEditMode(false);
    } catch (err) {
      console.error('Error updating lawyer:', err);
      setError('Failed to update lawyer');
    }
  };

  if (!userProfile || userProfile.user_type !== 'admin') {
    return null
  }

  return (
    <div className="py-12 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Admin Panel" 
          subtitle="Manage users, lawyers, and appointments"
        />

        {loading ? (
          <div className="text-center py-8">
            <p className="text-lg text-neutral-600 dark:text-neutral-400">Loading data...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-lg text-error-500">{error}</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Users Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Users</h2>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {user.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {user.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.user_type === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.user_type === 'lawyer'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.user_type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-error-600 hover:text-error-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Lawyers Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Lawyers</h2>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Specialization
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Experience
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {lawyers.map((lawyer) => (
                      <tr key={lawyer.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {lawyer.users.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {lawyer.specialization}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {lawyer.location}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {lawyer.experience_years} years
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {lawyer.rating} ({lawyer.review_count} reviews)
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => {
                              setSelectedLawyer(lawyer)
                              setEditMode(true)
                            }}
                            className="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Appointments Section */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Appointments</h2>
              <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Lawyer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {appointment.users.full_name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {appointment.users.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {appointment.lawyers.users.full_name}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {appointment.lawyers.users.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-900 dark:text-white">
                            {new Date(appointment.date_time).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {new Date(appointment.date_time).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            appointment.status === 'confirmed' 
                              ? 'bg-success-100 text-success-800'
                              : appointment.status === 'cancelled'
                              ? 'bg-error-100 text-error-800'
                              : 'bg-warning-100 text-warning-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDeleteAppointment(appointment.id)}
                            className="text-error-600 hover:text-error-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Edit Lawyer Modal */}
        {editMode && selectedLawyer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Edit Lawyer Profile</h3>
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                handleUpdateLawyer(selectedLawyer.id, {
                  specialization: formData.get('specialization'),
                  location: formData.get('location'),
                  experience_years: parseInt(formData.get('experience_years')),
                  rating: parseFloat(formData.get('rating')),
                  review_count: parseInt(formData.get('review_count')), // Added review_count
                  bio: formData.get('bio'),
                  education: formData.get('education')
                })
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Specialization
                    </label>
                    <input
                      type="text"
                      name="specialization"
                      defaultValue={selectedLawyer.specialization}
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      defaultValue={selectedLawyer.location}
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Experience (years)
                    </label>
                    <input
                      type="number"
                      name="experience_years"
                      defaultValue={selectedLawyer.experience_years}
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Rating
                    </label>
                    <input
                      type="number"
                      name="rating"
                      defaultValue={selectedLawyer.rating}
                      step="0.1"
                      min="0"
                      max="5"
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Review Count
                    </label>
                    <input
                      type="number"
                      name="review_count"
                      defaultValue={selectedLawyer.review_count}
                      min="0"
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      defaultValue={selectedLawyer.bio}
                      rows="3"
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Education
                    </label>
                    <input
                      type="text"
                      name="education"
                      defaultValue={selectedLawyer.education}
                      className="mt-1 block w-full rounded-md border-neutral-300 dark:border-neutral-700 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    />
                  </div>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLawyer(null)
                      setEditMode(false)
                    }}
                    className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel