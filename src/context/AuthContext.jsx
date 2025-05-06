import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userProfile, setUserProfile] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserProfile(session.user)
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchUserProfile(session.user)
      } else {
        setUserProfile(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (authUser) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      if (data) {
        setUserProfile(data)
      } else {
        console.error('No user profile found')
        setUserProfile(null)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
      setUserProfile(null)
    }
  }

  const signUp = async (email, password, fullName, userType = 'client') => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            user_type: userType
          }
        }
      })
      
      if (authError) throw authError

      return { 
        user: authData.user,
        message: "Registration successful. Please check your email for confirmation."
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      await fetchUserProfile(data.user)
      return data
    } catch (error) {
      throw error
    }
  }

  const signOut = async () => {
    try {
      // Delete user's chat messages before signing out
      if (userProfile?.id) {
        const { error: deleteError } = await supabase
          .from('chat_messages')
          .delete()
          .eq('user_id', userProfile.id)

        if (deleteError) throw deleteError
      }

      // Clear Dify chat session data from sessionStorage
      sessionStorage.removeItem('chatMessages');
      sessionStorage.removeItem('difyConversationId');

      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUserProfile(null)
    } catch (error) {
      console.error('Error during sign out:', error)
      throw error
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      signUp,
      signIn,
      signOut,
      loading
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}