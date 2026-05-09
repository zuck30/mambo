# Oa - Dating App

Oa is a premium, professional dating application built with React, Supabase, and Framer Motion. It features high-fidelity animations, real-time messaging, and a robust discovery engine.

## Features

- **Professional Branding**: High-end landing page and UI using `#ff79ac` primary color.
- **Email OTP Authentication**: Secure, passwordless login using Supabase and Brevo (SMTP).
- **Discovery Engine**: Swipe right to like, left to pass, and up to super like. Distance and age-based filtering.
- **Real-time Messaging**: Instant chat with matches.
- **Onboarding**: Comprehensive multi-step flow for a personalized experience.
- **Premium Features**: Oa Gold reveals who liked you; Super Likes and Boosts for increased visibility.
- **Oa AI**: Get creative conversation starters and profile optimization tips powered by Gemini.
- **Admin Dashboard**: Comprehensive management for users, matches, and system stats.

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

### 3. Troubleshooting Email OTP (Brevo "Never Used" Issue)

If Brevo shows your SMTP key as **"Never Used"**, it means Supabase is not attempting to connect to Brevo or the connection is failing before the key is exercised.

#### Step 1: Check Supabase Logs (CRITICAL)
Go to **Authentication > Logs** in your Supabase dashboard.
- If you see **no logs** when you click "Continue" in your app, the request is being rate-limited or blocked by Supabase before it even tries to send an email.
- If you see an error like `Error sending email: 535 Authentication Failed`, your **SMTP Key** is incorrect.

#### Step 2: Verify Supabase SMTP Settings
Go to **Settings > Authentication > SMTP Settings**:
1. **Enable SMTP**: Ensure this toggle is **ON**.
2. **Sender Email**: Must be exactly `mcveigh3691@gmail.com` (Verified in Brevo).
3. **Host**: `smtp-relay.brevo.com`
4. **Port**: `587`
5. **User**: `aab538001@smtp-brevo.com`
6. **Pass**: Use a **freshly generated SMTP key** from Brevo.
   - *Note*: Ensure it is an **SMTP Key**, not an API Key.
   - *Tip*: If the long key fails, try generating the **"Short SMTP key"** variant in Brevo.

#### Step 3: Check Email Templates
Go to **Authentication > Email Templates**:
- Check "Magic Link" and "Change Email" templates.
- Ensure the **"Sender email"** in the template settings also matches your verified Brevo sender.
- Ensure `{{ .Token }}` is present in the body.

#### Step 4: Rate Limiting
Supabase has a **"Minimum interval per user"** (default 60 seconds). If you click the button twice within a minute, the second email will **never be sent**, and no error will be shown in the UI. Wait 2 minutes between tests.

#### Step 5: Frontend Verification
Ensure your code uses the correct verification type:
```javascript
// Verification must use 'magiclink' type for email OTP
const { error } = await supabase.auth.verifyOtp({
  email: email,
  token: token,
  type: 'magiclink'
});
```

### 4. AI Insights Setup (Gemini)

1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
2. Set the secret in Supabase:
   ```bash
   supabase secrets set GEMINI_API_KEY=your-api-key
   ```
3. Deploy the AI edge function:
   ```bash
   supabase functions deploy oa-ai
   ```

### 4. Admin Setup

To create your first admin account:
1. Register a normal account through the app.
2. In the Supabase SQL Editor, run:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'YOUR_USER_UUID';
   ```

### 5. Frontend Configuration

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
© 2026 Oa Group, LLC. All Rights Reserved.
