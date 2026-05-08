# Oa - Dating App

A professional Tinder clone built with React, Supabase, and Framer Motion.

## Features

- **Phone Auth**: Secure login with OTP.
- **Onboarding**: Multi-step flow to set up your profile.
- **Discover**: Swipe through profiles with distance and age filtering.
- **Matches**: Instant notification when you both like each other.
- **Real-time Chat**: Message your matches instantly.
- **Premium Features**: Gold subscription, Super Likes, and Boosts.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
- **Backend**: Supabase (Auth, Database, Storage, Real-time)
- **State Management**: Zustand
- **Routing**: React Router

## Getting Started

1. Clone the repo
2. Install dependencies: `npm install`
3. Set up environment variables in `.env.local`:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
4. Run migrations from `docs/oa-schema.sql` in your Supabase SQL Editor.
5. Start development server: `npm run dev`
