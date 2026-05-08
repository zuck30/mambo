# Oa - Dating App

Oa is a premium, professional dating application built with React, Supabase, and Framer Motion. It features high-fidelity animations, real-time messaging, and a robust discovery engine.

## Features

- **Professional Branding**: High-end landing page and UI using `#ff79ac` primary color.
- **Email OTP Authentication**: Secure, passwordless login using Supabase and Brevo (SMTP).
- **Discovery Engine**: Swipe right to like, left to pass, and up to super like. Distance and age-based filtering.
- **Real-time Messaging**: Instant chat with matches.
- **Onboarding**: Comprehensive multi-step flow for a personalized experience.
- **Premium Features**: Oa Gold reveals who liked you; Super Likes and Boosts for increased visibility.

## Prerequisites

- Node.js (v18 or higher)
- Supabase Account
- Brevo Account (for Email OTP)

## Setup Instructions

### 1. Supabase Backend

1. Create a new Supabase project.
2. Run the SQL schema found in `docs/oa-schema.sql` in the Supabase SQL Editor.
3. Enable **Email Auth** in Authentication > Providers.
4. Disable "Confirm Email" if you want instant OTP access, or configure it as per your security needs.

### 2. Brevo (SMTP) Setup

To send professional OTP emails, configure Supabase to use Brevo's SMTP server:

1. In Brevo, go to **SMTP & API** and generate a new SMTP key.
2. In Supabase, go to **Settings > Authentication > SMTP Settings**.
3. Enable SMTP and fill in the following:
   - **Sender email**: Your verified Brevo sender.
   - **Host**: `smtp-relay.brevo.com`
   - **Port**: `587`
   - **User**: Your Brevo login email.
   - **Pass**: Your generated SMTP key.

### 3. Frontend Configuration

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env.local` file in the root:
   ```env
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

### 4. Running the App

- **Development**:
  ```bash
  npm run dev
  ```
- **Build**:
  ```bash
  npm run build
  ```

## Project Structure

- `src/pages`: Main routes including Landing, Login, Onboarding, and Home.
- `src/components/home`: Discover cards and settings modals.
- `src/hooks`: Custom hooks for Auth and Realtime.
- `docs/oa-schema.sql`: Database schema and RLS policies.

## Commands Reference

| Command | Description |
|---------|-------------|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Builds the app for production |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs ESLint for code quality |

---
© 2024 Oa Group, LLC. All Rights Reserved.
