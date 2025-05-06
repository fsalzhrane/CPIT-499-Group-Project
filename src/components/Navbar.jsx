import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'
import { FiMenu, FiX, FiMoon, FiSun } from 'react-icons/fi'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { darkMode, toggleTheme } = useTheme()
  const { user, userProfile, signOut } = useAuth()

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const isLawyer = userProfile?.user_type === 'lawyer'
  const isClient = userProfile?.user_type === 'client'
  const isAdmin = userProfile?.user_type === 'admin'

  return (
    <header className="bg-white dark:bg-neutral-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-500">
            LawLink
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `text-sm font-medium ${
                  isActive ? 'text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-500'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/lawyers" 
              className={({ isActive }) => 
                `text-sm font-medium ${
                  isActive ? 'text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-500'
                }`
              }
            >
              {isLawyer ? 'Dashboard' : 'Lawyers'}
            </NavLink>
            {isClient && (
              <NavLink 
                to="/dashboard" 
                className={({ isActive }) => 
                  `text-sm font-medium ${
                    isActive ? 'text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-500'
                  }`
                }
              >
                My Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink 
                to="/admin" 
                className={({ isActive }) => 
                  `text-sm font-medium ${
                    isActive ? 'text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-500'
                  }`
                }
              >
                Admin Panel
              </NavLink>
            )}
            <NavLink 
              to="/services" 
              className={({ isActive }) => 
                `text-sm font-medium ${
                  isActive ? 'text-primary-500' : 'text-neutral-700  dark:text-neutral-300 hover:text-primary-500'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink 
              to="/chat-ai" 
              className={({ isActive }) => 
                `text-sm font-medium ${
                  isActive ? 'text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-500'
                }`
              }
            >
              Chat AI
            </NavLink>
            <NavLink 
              to="/about" 
              className={({ isActive }) => 
                `text-sm font-medium ${
                  isActive ? 'text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:text-primary-500'
                }`
              }
            >
              About
            </NavLink>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            
            {user ? (
              <button 
                onClick={handleSignOut}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="px-4 py-2 text-primary-500 border border-primary-500 rounded-md hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center space-x-4">
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              {darkMode ? <FiSun className="w-5 h-5" /> : <FiMoon className="w-5 h-5" />}
            </button>
            <button onClick={() => setIsOpen(!isOpen)} className="text-neutral-700 dark:text-neutral-300">
              {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </nav>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white dark:bg-neutral-900 shadow-md">
          <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            <NavLink 
              to="/" 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `px-4 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/lawyers" 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `px-4 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              {isLawyer ? 'Dashboard' : 'Lawyers'}
            </NavLink>
            {isClient && (
              <NavLink 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md ${
                    isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`
                }
              >
                My Dashboard
              </NavLink>
            )}
            {isAdmin && (
              <NavLink 
                to="/admin" 
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `px-4 py-2 rounded-md ${
                    isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`
                }
              >
                Admin Panel
              </NavLink>
            )}
            <NavLink 
              to="/services" 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `px-4 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink 
              to="/chat-ai" 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `px-4 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              Chat AI
            </NavLink>
            <NavLink 
              to="/about" 
              onClick={() => setIsOpen(false)}
              className={({ isActive }) => 
                `px-4 py-2 rounded-md ${
                  isActive ? 'bg-primary-50 dark:bg-primary-900 text-primary-500' : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                }`
              }
            >
              About
            </NavLink>
            
            {user ? (
              <button 
                onClick={() => {
                  handleSignOut()
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-center bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Sign Out
              </button>
            ) : (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4 flex flex-col space-y-2">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 text-center border border-primary-500 text-primary-500 rounded-md hover:bg-primary-50"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setIsOpen(false)}
                  className="w-full px-4 py-2 text-center bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar