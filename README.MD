# Supabase CLI (v1)

[![Coverage Status](https://coveralls.io/repos/github/supabase/cli/badge.svg?branch=main)](https://coveralls.io/github/supabase/cli?branch=main) [![Bitbucket Pipelines](https://img.shields.io/bitbucket/pipelines/supabase-cli/setup-cli/master?style=flat-square&label=Bitbucket%20Canary)](https://bitbucket.org/supabase-cli/setup-cli/pipelines) [![Gitlab Pipeline Status](https://img.shields.io/gitlab/pipeline-status/sweatybridge%2Fsetup-cli?label=Gitlab%20Canary)
](https://gitlab.com/sweatybridge/setup-cli/-/pipelines)

[Supabase](https://supabase.io) is an open source Firebase alternative. We're building the features of Firebase using enterprise-grade open source tools.

This repository contains all the functionality for Supabase CLI.

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [AI Insights Setup](#-ai-insights-setup)
- [Database Setup](#-database-setup)
- [Project Structure](#-project-structure)
- [Modules](#-modules)
- [Role Permissions](#-role-permissions)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## Getting started

### Install the CLI

Available via [NPM](https://www.npmjs.com) as dev dependency. To install:

```bash
npm i supabase --save-dev
```

To install the beta release channel:

```bash
npm i supabase@beta --save-dev
```

When installing with yarn 4, you need to disable experimental fetch with the following nodejs config.

```
NODE_OPTIONS=--no-experimental-fetch yarn add supabase
```

> **Note**
For Bun versions below v1.0.17, you must add `supabase` as a [trusted dependency](https://bun.sh/guides/install/trusted) before running `bun add -D supabase`.

<details>
  <summary><b>macOS</b></summary>

  Available via [Homebrew](https://brew.sh). To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To install the beta release channel:
  
  ```sh
  brew install supabase/tap/supabase-beta
  brew link --overwrite supabase-beta
  ```
  
  To upgrade:

  ```sh
  brew upgrade supabase
  ```
</details>

<details>
  <summary><b>Windows</b></summary>

  Available via [Scoop](https://scoop.sh). To install:

  ```powershell
  scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
  scoop install supabase
  ```

  To upgrade:

  ```powershell
  scoop update supabase
  ```
</details>

<details>
  <summary><b>Linux</b></summary>

  Available via [Homebrew](https://brew.sh) and Linux packages.

  #### via Homebrew

  To install:

  ```sh
  brew install supabase/tap/supabase
  ```

  To upgrade:

  ```sh
  brew upgrade supabase
  ```

  #### via Linux packages

  Linux packages are provided in [Releases](https://github.com/supabase/cli/releases). To install, download the `.apk`/`.deb`/`.rpm`/`.pkg.tar.zst` file depending on your package manager and run the respective commands.

  ```sh
  sudo apk add --allow-untrusted <...>.apk
  ```

  ```sh
  sudo dpkg -i <...>.deb
  ```

  ```sh
  sudo rpm -i <...>.rpm
  ```

  ```sh
  sudo pacman -U <...>.pkg.tar.zst
  ```
</details>

<details>
  <summary><b>Other Platforms</b></summary>

  You can also install the CLI via [go modules](https://go.dev/ref/mod#go-install) without the help of package managers.

  ```sh
  go install github.com/supabase/cli@latest
  ```

  Add a symlink to the binary in `$PATH` for easier access:

  ```sh
  ln -s "$(go env GOPATH)/bin/cli" /usr/bin/supabase
  ```

  This works on other non-standard Linux distros.
</details>

<details>
  <summary><b>Community Maintained Packages</b></summary>

  Available via [pkgx](https://pkgx.sh/). Package script [here](https://github.com/pkgxdev/pantry/blob/main/projects/supabase.com/cli/package.yml).
  To install in your working directory:

  ```bash
  pkgx install supabase
  ```

  Available via [Nixpkgs](https://nixos.org/). Package script [here](https://github.com/NixOS/nixpkgs/blob/master/pkgs/development/tools/supabase-cli/default.nix).
</details>

### Run the CLI

```bash
supabase bootstrap
```

Or using npx:

```bash
npx supabase bootstrap
```

The bootstrap command will guide you through the process of setting up a Supabase project using one of the [starter](https://github.com/supabase-community/supabase-samples/blob/main/samples.json) templates.

## Docs

Command & config reference can be found [here](https://supabase.com/docs/reference/cli/about).

## Breaking changes

We follow semantic versioning for changes that directly impact CLI commands, flags, and configurations.

However, due to dependencies on other service images, we cannot guarantee that schema migrations, seed.sql, and generated types will always work for the same CLI major version. If you need such guarantees, we encourage you to pin a specific version of CLI in package.json.

## Developing

To run from source:

```sh
# Go >= 1.22
go run . help
```

Visit `http://localhost:5173` in your browser.

### 7. Create your first admin account

1. Go to **Supabase Dashboard → Authentication → Users**
2. Click **Add User**, enter your email and password
3. In **SQL Editor**, run:

```sql
INSERT INTO profiles (id, full_name, role)
VALUES ('<your-user-uuid>', 'Admin User', 'admin');
```

4. Log in at `http://localhost:5173/login`

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

Find these values in your Supabase project under:
**Settings → API → Project URL** and **Project API Keys → anon public**

---

## 🧠 AI Insights Setup

The GariDesk AI Insights feature requires a Gemini API key and the deployment of a Supabase Edge Function.

### 1. Get Gemini API Key
Obtain an API key from the [Google AI Studio](https://aistudio.google.com/).

### 2. Set Supabase Secrets
Set the following secrets in your Supabase project:

```bash
supabase secrets set GEMINI_API_KEY=your-gemini-api-key
```

### 3. Deploy Edge Function
Deploy the `garidesk-ai` function:

```bash
supabase functions deploy garidesk-ai
```

---

## 🗄 Database Setup

The full PostgreSQL schema is located at [`/docs/schema.sql`](./docs/schema.sql).

It includes the following tables:

| Table | Description |
|-------|-------------|
| `profiles` | Extended user profiles with roles |
| `branches` | Business branch locations |
| `customers` | Customer registry |
| `cars` | Car registry linked to customers |
| `services` | Service catalog with pricing |
| `jobs` | Job/order records (the queue) |
| `job_services` | Services selected per job |
| `payments` | Payment records with method + status |
| `expenses` | Business expense tracking |
| `inventory_items` | Stock items registry |
| `inventory_movements` | Stock in/out history log |

### Key Database Features

- **Row Level Security (RLS)** enabled on all tables
- **Auto-generated job numbers** — format: `KAZI-YYYYMMDD-001`
- **Auto-generated receipt numbers** — format: `RISITI-YYYYMMDD-XXXXXX`
- **Trigger** to auto-update customer `total_visits` and `total_spent` on payment
- **Supabase Realtime** enabled on the `jobs` table for live queue updates


## 🧩 Modules

### Module 1 — Authentication
Supabase email/password auth with persistent sessions. Role-based route guards ensure staff only see pages relevant to their role.

### Module 2 — Dashboard
Live stats (today's revenue, active queue count, new customers), revenue charts, service popularity pie chart, quick action buttons, and a real-time queue preview.

### Module 3 — Live Queue
Kanban-style board updating in real-time via Supabase Realtime. New jobs appear instantly on all connected devices. Staff can start, complete, and manage jobs directly from this view.

### Module 4 — Customer Management
Search and manage the full customer database. Each customer has a detail page showing their loyalty tier, car list (with hologram cards), service history, and payment history.

### Module 5 — Car Management
Register cars with full specs. The **HologramCarCard** renders a 3D animated display card fetching the car image by make/model/year — a visually distinctive feature built with CSS 3D transforms, animated glow rings, and glassmorphism.

### Module 6 — Services
Full CRUD for the service catalog. Services are organized by category and can be toggled active/inactive. Default services are seeded on setup.

### Module 7 — Payments & Finance
Complete payment workflow triggered when a job is completed. Supports Cash, M-Pesa, Card, and Bank Transfer. Auto-generates printable and WhatsApp-shareable receipts.

### Module 8 — Inventory
Track supplies with stock level alerts. Log stock in/out movements. Color-coded status indicators show at a glance what needs restocking.

### Module 9 — Reports & Analytics
Multi-period analytics with filterable date ranges. Revenue trends, service rankings, customer insights, staff performance, and income vs. expense comparisons — all exportable.

### Module 10 — Staff Management
Admin creates and manages staff accounts. Each staff member has a role, activity status, and a performance record tied to their completed jobs. Admins can also set and track staff salaries and delete staff members.

### Module 11 — Settings
Business profile, currency selector, tax configuration, receipt customization, branch management, and user profile editing.

---

## 🔒 Role Permissions

| Feature | Admin | Manager | Secretary | Staff |
|---------|:-----:|:-------:|:---------:|:-----:|
| Dashboard | ✅ | ✅ | ✅ | ❌ |
| View Queue | ✅ | ✅ | ✅ | ✅ |
| Manage Jobs | ✅ | ✅ | ✅ | ✅ |
| Customers CRUD | ✅ | ✅ | ✅ | ✅ |
| Cars CRUD | ✅ | ✅ | ✅ | ✅ |
| Record Payments | ✅ | ✅ | ✅ | ✅ |
| Services CRUD | ✅ | ✅ | ✅ | ❌ |
| Inventory Management | ✅ | ✅ | ✅ | ❌ |
| View Reports | ✅ | ✅ | ❌ | ❌ |
| Staff Management | ✅ | ❌ | ✅ | ❌ |
| System Settings | ✅ | ❌ | ❌ | ❌ |
| Delete Records | ✅ | ❌ | ❌ | ❌ |

### How to Create a Secretary Account
1. Log in to the system as an **Admin**.
2. Navigate to the **Team** section from the sidebar.
3. Click the **Add Team Member** button.
4. Fill in the required personal information (Full Name, NIDA, Phone).
5. In the **Access Level** section, select **Secretary**.
6. Set the salary for the secretary.
7. Click **Create Staff Account**.
8. The secretary will receive instructions to set their password and log in.

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Set your environment variables in the Vercel dashboard under **Project → Settings → Environment Variables**.

### Deploy to Netlify

```bash
npm run build
```

Then drag the `dist/` folder into [netlify.com/drop](https://netlify.com/drop), or connect your GitHub repo and set:

- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Environment variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

### Build for Production

```bash
npm run build
npm run preview    # Preview the production build locally
```

---

## 🗺 Roadmap

- [ ] M-Pesa STK Push auto-confirmation
- [ ] Multi-branch centralized reporting
- [ ] Customer loyalty program with points
- [ ] Booking / appointment scheduling
- [ ] Offline support with PWA + background sync
