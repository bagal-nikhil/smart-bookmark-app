"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabaseClient"
import { User } from "@supabase/supabase-js"

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })
  }, [])

  if (!user) return <p>Not logged in</p>

  const logout = async () => {
  await supabase.auth.signOut()
  window.location.href = "/"
}

  return (
    <div className="text-center mt-20">
      <h2>Welcome</h2>
      <img src={user.user_metadata.avatar_url} width={80} />
      <h3>{user.user_metadata.full_name}</h3>
      <p>{user.email}</p>

      <button
  onClick={logout}
  className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
>
  Logout
</button>
    </div>
  )
}
