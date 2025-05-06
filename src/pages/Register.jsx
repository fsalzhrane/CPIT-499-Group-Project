import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FiMail, FiLock, FiUser } from 'react-icons/fi'
import { supabase } from '../lib/supabase'

const Register = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    userType: 'client'
  })
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    try {
      setError('')
      setLoading(true)

      // Check if email already exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('user_type')
        .eq('email', formData.email)
        .single()

      if (existingUser) {
        setError(`This email is already registered as a ${existingUser.user_type}`)
        return
      }

      await signUp(formData.email, formData.password, formData.fullName, formData.userType)
      navigate('/login')
    } catch (err) {
      if (err.message.includes('User already registered')) {
        setError('Email already registered')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen py-16 bg-neutral-50 dark:bg-neutral-800">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-500 text-white py-6 px-6">
              <h1 className="text-2xl font-bold text-center">Create an Account</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-error-50 text-error-500 rounded-md">
                  {error}
                </div>
              )}
              
              <div className="mb-4">
                <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiUser className="w-5 h-5 text-neutral-400" />
                  </div>
                  <input 
                    type="text" 
                    id="fullName"
                    name="fullName"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:text-white"
                    placeholder="Your full name" 
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiMail className="w-5 h-5 text-neutral-400" />
                  </div>
                  <input 
                    type="email" 
                    id="email"
                    name="email"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:text-white"
                    placeholder="Your email address" 
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className="w-5 h-5 text-neutral-400" />
                  </div>
                  <input 
                    type="password" 
                    id="password"
                    name="password"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:text-white"
                    placeholder="Create a password" 
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={6}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <FiLock className="w-5 h-5 text-neutral-400" />
                  </div>
                  <input 
                    type="password" 
                    id="confirmPassword"
                    name="confirmPassword"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:text-white"
                    placeholder="Confirm your password" 
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="userType" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                  I am a
                </label>
                <select
                  id="userType"
                  name="userType"
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-neutral-800 dark:text-white"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="client">Client</option>
                  <option value="lawyer">Lawyer</option>
                </select>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-primary-500 text-white py-3 px-4 rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>
              
              <div className="mt-4 text-center">
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Already have an account? <Link to="/login" className="text-primary-500 hover:text-primary-600 font-medium">Sign In</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register