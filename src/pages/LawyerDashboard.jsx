import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import SectionHeading from '../components/SectionHeading'

const LawyerDashboard = () => {
  const { userProfile } = useAuth()
  const [appointments, setAppointments] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const [selectedClient, setSelectedClient] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userProfile?.id) {
      fetchAppointments()
    }
  }, [userProfile])

  useEffect(() => {
    if (selectedClient) {
      fetchMessages()
    }
  }, [selectedClient])

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data: lawyerData } = await supabase
        .from('lawyers')
        .select('id')
        .eq('user_id', userProfile.id)
        .single()

      if (lawyerData) {
        const { data, error } = await supabase
          .from('appointments')
          .select(`
            *,
            client:users!appointments_client_id_fkey (
              id,
              full_name,
              email
            )
          `)
          .eq('lawyer_id', lawyerData.id)
          .order('date_time', { ascending: true })

        if (error) throw error
        setAppointments(data)
      }
    } catch (err) {
      console.error('Error fetching appointments:', err)
      setError('Failed to load appointments')
    } finally {
      setLoading(false)
    }
  }

  const fetchMessages = async () => {
    if (!selectedClient) return

    try {
      const { data, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:sender_id(full_name),
          receiver:receiver_id(full_name)
        `)
        .or(`and(sender_id.eq.${userProfile.id},receiver_id.eq.${selectedClient.id}),and(sender_id.eq.${selectedClient.id},receiver_id.eq.${userProfile.id})`)
        .order('created_at', { ascending: false })

      if (error) throw error
      setMessages(data)
    } catch (err) {
      console.error('Error fetching messages:', err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedClient) return

    try {
      const { error } = await supabase
        .from('messages')
        .insert([
          {
            sender_id: userProfile.id,
            receiver_id: selectedClient.id,
            content: newMessage
          }
        ])

      if (error) throw error
      
      setNewMessage('')
      fetchMessages()
    } catch (err) {
      console.error('Error sending message:', err)
    }
  }

  const handleUpdateStatus = async (appointmentId, newStatus) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId)

      if (error) throw error
      fetchAppointments()
    } catch (err) {
      console.error('Error updating appointment:', err)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 bg-green-100'
      case 'cancelled':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-yellow-600 bg-yellow-100'
    }
  }

  return (
    <div className="py-12 bg-white dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        {/* Appointments Section */}
        <div className="mb-12">
          <SectionHeading 
            title="My Appointments" 
            subtitle="Manage your appointments with clients"
          />

          {loading ? (
            <div className="text-center py-8">
              <p className="text-lg text-neutral-600 dark:text-neutral-400">Loading...</p>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-lg text-error-500">{error}</p>
            </div>
          ) : appointments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-lg text-neutral-600 dark:text-neutral-400">No appointments found.</p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700">
                  <thead className="bg-neutral-50 dark:bg-neutral-800">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Client
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                        Email
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
                  <tbody className="bg-white dark:bg-neutral-900 divide-y divide-neutral-200 dark:divide-neutral-700">
                    {appointments.map((appointment) => (
                      <tr key={appointment.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">
                            {appointment.client.full_name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {appointment.client.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">
                            {new Date(appointment.date_time).toLocaleString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appointment.status)}`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap space-x-2">
                          <button
                            onClick={() => setSelectedClient(appointment.client)}
                            className="text-primary-600 hover:text-primary-800"
                          >
                            Message
                          </button>
                          {appointment.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUpdateStatus(appointment.id, 'confirmed')}
                                className="text-green-600 hover:text-green-800"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                                className="text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Messages Section */}
        {selectedClient && (
          <div>
            <SectionHeading 
              title={`Messages with ${selectedClient.full_name}`}
              subtitle="Communicate with your client"
            />

            <div className="mb-6 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg">
              <form onSubmit={handleSendMessage} className="space-y-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full p-2 border border-neutral-300 dark:border-neutral-700 rounded-md"
                  rows="3"
                  placeholder="Type your message here..."
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClient(null)
                      setMessages([])
                    }}
                    className="px-4 py-2 text-neutral-600 hover:text-neutral-800"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    Send Message
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`p-4 rounded-lg ${
                    message.sender_id === userProfile.id
                      ? 'bg-primary-500 text-white ml-auto'
                      : 'bg-neutral-100 dark:bg-neutral-800'
                  } max-w-[80%]`}
                >
                  <div className="flex justify-between mb-2">
                    <span className="text-sm">
                      {message.sender.full_name}
                    </span>
                    <span className="text-sm opacity-75">
                      {new Date(message.created_at).toLocaleString()}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </div>
              ))}
              {messages.length === 0 && (
                <p className="text-center text-neutral-500 dark:text-neutral-400">
                  No messages yet
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LawyerDashboard