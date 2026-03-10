"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClientComponentClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import type { Session, User } from "@supabase/supabase-js"
import { useToast } from "@/hooks/use-toast"

type UserRole = "user" | "reviewer" | "admin" | "registrar" | "system-admin"

type UserProfile = {
  id: string
  full_name: string
  avatar_url?: string
  role: UserRole
  email: string
  phone?: string
  is_active: boolean
}

type SupabaseAuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any | null }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null }>
  signOut: () => Promise<void>
  updateProfile: (data: Partial<UserProfile>) => Promise<{ error: any | null }>
}

const SupabaseAuthContext = createContext<SupabaseAuthContextType>({
  user: null,
  profile: null,
  session: null,
  isLoading: true,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => {},
  updateProfile: async () => ({ error: null }),
})

export const useSupabaseAuth = () => useContext(SupabaseAuthContext)

export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Initialize Supabase client
  const supabase = createClientComponentClient()

  useEffect(() => {
    let mounted = true

    const getSession = async () => {
      try {
        setIsLoading(true)
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (!mounted) return

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        if (session) {
          setSession(session)
          setUser(session.user)
          await fetchUserProfile(session.user.id)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error("Error in getSession:", error)
        if (mounted) setIsLoading(false)
      }
    }

    getSession()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
        setIsLoading(false)
      }

      if (event === "SIGNED_IN" && session?.user) {
        // Redirect based on user role after profile is fetched
        const { data: userProfile } = await supabase.from("users").select("role").eq("id", session.user.id).single()

        if (userProfile && mounted) {
          redirectByRole(userProfile.role)
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching user profile:", error)
        // If user doesn't exist in our users table, create a basic profile
        if (error.code === "PGRST116") {
          await createUserProfile(userId)
        }
      } else if (data) {
        setProfile(data as UserProfile)
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createUserProfile = async (userId: string) => {
    try {
      const { data: authUser } = await supabase.auth.getUser()
      if (!authUser.user) return

      const newProfile = {
        id: userId,
        email: authUser.user.email!,
        full_name: authUser.user.user_metadata?.full_name || "",
        role: "user" as UserRole,
        is_active: true,
      }

      const { data, error } = await supabase.from("users").insert(newProfile).select().single()

      if (error) {
        console.error("Error creating user profile:", error)
      } else if (data) {
        setProfile(data as UserProfile)
      }
    } catch (error) {
      console.error("Error in createUserProfile:", error)
    }
  }

  const redirectByRole = (role: UserRole) => {
    switch (role) {
      case "system-admin":
        router.push("/system-admin/dashboard")
        break
      case "admin":
        router.push("/admin/dashboard")
        break
      case "registrar":
        router.push("/registrar/dashboard")
        break
      case "reviewer":
        router.push("/reviewer/dashboard")
        break
      default:
        router.push("/dashboard")
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        toast({
          title: "خطأ في تسجيل الدخول",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "تم تسجيل الدخول بنجاح",
          description: "مرحباً بك في النظام",
        })
      }

      return { error }
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
        },
      })

      if (error) {
        toast({
          title: "خطأ في إنشاء الحساب",
          description: error.message,
          variant: "destructive",
        })
      } else {
        toast({
          title: "تم إنشاء الحساب بنجاح",
          description: "يرجى التحقق من بريدك الإلكتروني",
        })
      }

      return { error }
    } catch (error: any) {
      toast({
        title: "خطأ في إنشاء الحساب",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      }

      setUser(null)
      setProfile(null)
      setSession(null)
      router.push("/")

      toast({
        title: "تم تسجيل الخروج",
        description: "نراك قريباً",
      })
    } catch (error: any) {
      console.error("Error in signOut:", error)
    }
  }

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return { error: new Error("Not authenticated") }

    try {
      const { error } = await supabase.from("users").update(data).eq("id", user.id)

      if (error) {
        toast({
          title: "خطأ في التحديث",
          description: error.message,
          variant: "destructive",
        })
      } else {
        setProfile((prev) => (prev ? { ...prev, ...data } : null))
        toast({
          title: "تم التحديث بنجاح",
          description: "تم حفظ التغييرات",
        })
      }

      return { error }
    } catch (error: any) {
      toast({
        title: "خطأ في التحديث",
        description: error.message,
        variant: "destructive",
      })
      return { error }
    }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    signIn,
    signUp,
    signOut,
    updateProfile,
  }

  return <SupabaseAuthContext.Provider value={value}>{children}</SupabaseAuthContext.Provider>
}
