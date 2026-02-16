"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/libs/supabaseClient"
import { User } from "@supabase/supabase-js"

type Bookmark = {
  id: string
  title: string
  url: string
  user_id: string
  created_at: string
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [title, setTitle] = useState("")
  const [url, setUrl] = useState("")
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [loading, setLoading] = useState(true)

 useEffect(() => {
  let channel: any

  const setup = async () => {
    const { data } = await supabase.auth.getSession()
    const currentUser = data.session?.user ?? null

    if (!currentUser) {
      window.location.href = "/"
      return
    }

    setUser(currentUser)
    setLoading(false)
    fetchBookmarks(currentUser.id)

    channel = supabase
      .channel("bookmarks-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
        },
        () => {
          fetchBookmarks(currentUser.id)
        }
      )
      .subscribe()
  }

  setup()

  return () => {
    if (channel) supabase.removeChannel(channel)
  }
}, [])

  const fetchBookmarks = async (userId: string) => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (data) setBookmarks(data)
  }

  const addBookmark = async () => {
    if (!user || !title || !url) return

    try {
      new URL(url)
    } catch {
      alert("Invalid URL")
      return
    }

    await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: user.id,
      },
    ])

    setTitle("")
    setUrl("")
  }

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (loading) return <p className="text-center mt-20">Loading...</p>

 return (
  <div className="flex justify-center mt-12 px-4">
    <div className="bg-white shadow-2xl rounded-2xl w-full max-w-xl p-8">

      <div className="text-center mb-10">
        <div className="mx-auto w-24 h-24 rounded-full overflow-hidden shadow-lg">
          <img
            src={user?.user_metadata.avatar_url}
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>
        <h2 className="text-2xl font-bold text-black mt-4">{user?.user_metadata.full_name}</h2>
        <p className="text-gray-500">{user?.email}</p>

        <button
          onClick={logout}
          className="mt-4 text-sm text-red-500 hover:text-red-700 underline transition"
        >
          Logout
        </button>
      </div>

      {/* ADD BOOKMARK */}
      <div className="mb-8 space-y-4">
        <input
          className="border rounded-2xl border-black p-3 text-black w-full focus:ring-2 focus:ring-oklch(14.5% 0 0) outline-none transition"
          placeholder="Bookmark Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          className="border rounded-2xl border-black text-black p-3 w-full focus:ring-2 focus:ring-oklch(14.5% 0 0) outline-none transition"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />

        <button
          onClick={addBookmark}
          disabled={!title || !url}
          className="w-full bg-blue-700 text-white py-3 rounded-2xl hover:bg-blue-800 transition disabled:opacity-50"
        >
          Add Bookmark
        </button>
      </div>

      <div className="space-y-4">
        {bookmarks.length === 0 && (
          <p className="text-center text-gray-400 italic">No bookmarks yet</p>
        )}

        {bookmarks.map((b) => (
          <div
            key={b.id}
            className="bg-gradient-to-r from-purple-50 to-pink-50 border rounded-2xl p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
          >
            <div>
              <p className="font-semibold text-lg text-gray-800">{b.title}</p>
              <a
                href={b.url}
                target="_blank"
                className="text-blue-600 text-sm hover:underline"
              >
                {b.url}
              </a>
            </div>

            <button
              onClick={() => deleteBookmark(b.id)}
              className="text-red-500 hover:text-red-700 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  </div>
)
}
