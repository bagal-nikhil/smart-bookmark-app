# Smart Bookmark App

## Overview
This is a simple bookmark management app built with **Next.js**, **Supabase**, and **TypeScript**. Users can sign in with Google, add, view, and delete bookmarks in real-time.

## Challenges I Faced and How I Solved Them

1. **Real-time updates with Supabase**
   - **Problem:** I wanted the bookmarks list to update automatically when changes occur, without needing a page refresh.
   - **Solution:** I used `supabase.channel` with `postgres_changes` to subscribe to changes on the bookmarks table and re-fetch the data when updates happen.

2. **Handling user authentication**
   - **Problem:** Redirecting users correctly based on authentication state was tricky, especially protecting the dashboard page.
   - **Solution:** I used `supabase.auth.getSession()` in `useEffect` to check if a user is logged in and redirect them appropriately.

3. **Validating user input**
   - **Problem:** Users could enter invalid URLs, causing errors when saving bookmarks.
   - **Solution:** I implemented URL validation using JavaScript's `URL` constructor and alerted the user if the URL is invalid.

4. **UI/UX consistency**
   - **Problem:** Making a responsive and visually appealing interface that works well on mobile and desktop.
   - **Solution:** I used Tailwind CSS for quick styling, rounded corners, hover effects, and responsive layout.

## Future Improvements
- Add bookmark categories and filtering
- Implement user profile editing
- Deploy the app to production with custom domain
