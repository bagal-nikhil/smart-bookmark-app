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
        redirectTo: `${window.location.origin}/dashboard`,
      },
    })
  }

  return (
  <div className="h-screen flex items-center justify-center bg-black">
    <div className="bg-white rounded-2xl shadow-2xl p-10 flex flex-col items-center w-80">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">
        Smart Bookmark
      </h1>

      <p className="text-black mb-6 text-center">
        Sign in with Google to save your bookmarks securely
      </p>

      <button
        onClick={login}
        className="flex items-center justify-center w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition-all duration-200 shadow-md"
      >
       <img
  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/google.svg"
  alt="Google"
  className="w-6 h-6 mr-3"
/>
        Login with Google
      </button>
    </div>
  </div>
)
}
