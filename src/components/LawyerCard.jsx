import { useState } from 'react'
import { FiMapPin, FiStar, FiCalendar } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'

const LawyerCard = ({ lawyer }) => {
  const { userProfile } = useAuth()
  const [showBooking, setShowBooking] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    id,
    full_name,
    specialization,
    location,
    experience_years,
    rating,
    review_count,
  } = lawyer

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!userProfile?.id) {
      setError('Please sign in to book an appointment')
      return
    }

    if (!bookingDate || !bookingTime) {
      setError('Please select both date and time')
      return
    }

    try {
      setLoading(true)
      setError('')
      setSuccess(false) // Reset success state

      const dateTime = new Date(`${bookingDate}T${bookingTime}`)
      const isoDateTime = dateTime.toISOString()

      // Check for existing appointments
      const { data: existingAppointments, error: existingError } = await supabase
        .from('appointments')
        .select('id')
        .eq('lawyer_id', id)
        .eq('date_time', isoDateTime)
        .eq('status', 'confirmed') // Optionally, only check for confirmed appointments

      if (existingError) {
        console.error('Error checking existing appointments:', existingError)
        // Decide if this error should be shown to the user or just logged
        // For now, let's allow booking to proceed if checking fails,
        // or you could throw existingError to stop the process.
      }

      if (existingAppointments && existingAppointments.length > 0) {
        setError('This time slot is already booked. Please choose another time.')
        setLoading(false)
        return
      }

      const { error: appointmentError } = await supabase
        .from('appointments')
        .insert([
          {
            client_id: userProfile.id,
            lawyer_id: id,
            date_time: isoDateTime,
            status: 'pending'
          }
        ])

      if (appointmentError) throw appointmentError

      setSuccess(true)
      setShowBooking(false)
      setBookingDate('')
      setBookingTime('')
    } catch (err) {
      setError('Failed to book appointment. Please try again.')
      console.error('Booking error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card p-6">
      <div className="flex flex-col">
        <h3 className="text-xl font-semibold">{full_name}</h3>
        <p className="text-primary-500 font-medium">{specialization}</p>
        
        <div className="flex items-center mt-2 text-neutral-600 dark:text-neutral-400">
          <FiMapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-neutral-700 dark:text-neutral-300">
            <span className="font-medium">Experience:</span> {experience_years} years
          </p>
        </div>
        
        <div className="flex items-center mt-2">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <FiStar 
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-accent-500 fill-accent-500' : 'text-neutral-300 dark:text-neutral-600'}`}
              />
            ))}
          </div>
          <span className="ml-2 text-sm font-medium">{rating}</span>
          <span className="ml-1 text-sm text-neutral-500 dark:text-neutral-400">({review_count} reviews)</span>
        </div>
        
        <div className="mt-6">
          {success ? (
            <div className="text-success-500 text-center p-2 bg-success-50 rounded-md">
              Appointment booked successfully!
            </div>
          ) : showBooking ? (
            <form onSubmit={handleBooking} className="space-y-4">
              {error && (
                <div className="text-error-500 text-sm bg-error-50 p-2 rounded-md">
                  {error}
                </div>
              )}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  id="time"
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  required
                />
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                  type="button"
                  className="flex-1 btn btn-secondary"
                  onClick={() => setShowBooking(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={() => setShowBooking(true)}
              className="btn btn-primary w-full"
            >
              <FiCalendar className="w-4 h-4 mr-2" />
              Book Appointment
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default LawyerCard