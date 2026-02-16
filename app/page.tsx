"use client"

import { useEffect } from "react"
import { supabase } from "@/libs/supabaseClient"

export default function Home() {

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (data.session) {
        window.location.href = "/dashboard"
      }
    }
    check()
  }, [])

  const login = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:3000/dashboard",
      },
    })
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={login}
        className="bg-black text-white px-6 py-3 rounded"
      >
        Login with Google
      </button>
    </div>
  )
}
