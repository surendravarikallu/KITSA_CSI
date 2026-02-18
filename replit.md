# CSI Student Chapter Management Platform

## Overview

This is a full-stack web application for managing a CSI (Computer Society of India) Student Chapter. It replaces static websites with a dynamic, role-based platform that handles member registration, event management, gallery, team showcases, and an admin dashboard. The platform features a blue-and-white CSI-branded design with public-facing pages (Home, About, Team, Why Us, Events, Gallery, Membership) and protected admin functionality.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React with TypeScript, built using Vite
- **Routing**: Wouter (lightweight client-side router, not React Router)
- **State Management / Data Fetching**: TanStack React Query for server state, with custom hooks (`use-auth`, `use-events`, `use-admin`) wrapping fetch calls
- **Forms**: React Hook Form with Zod resolvers for validation
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with TailwindCSS
- **Animations**: Framer Motion for page transitions and interactions
- **Styling**: TailwindCSS with CSS variables for theming; custom CSI blue/white color scheme defined in `client/src/index.css`; fonts are Inter (body) and Outfit (display headings)
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Runtime**: Node.js with Express, written in TypeScript
- **Entry point**: `server/index.ts` creates an HTTP server with Express
- **Security**: Helmet middleware, express-rate-limit (100 requests per 15 minutes), bcrypt-style password hashing using Node's built-in `scrypt`
- **Authentication**: Passport.js with Local Strategy, session-based auth stored in PostgreSQL via `connect-pg-simple`. Sessions use HTTP-only cookies. The `email` field serves as the username for login.
- **API Design**: RESTful endpoints under `/api/`. Route definitions are centralized in `shared/routes.ts` with Zod schemas for input validation and type-safe response contracts.
- **Database**: PostgreSQL with Drizzle ORM. Schema defined in `shared/schema.ts`. Database migrations managed with `drizzle-kit push`.
- **Storage Layer**: `server/storage.ts` implements an `IStorage` interface with methods for users, events, registrations, gallery, and contacts. Uses Drizzle query builder against PostgreSQL.
- **Seeding**: `server/seed.ts` creates default admin and student users plus sample events on first run (when no users exist).

### Shared Code (`shared/`)
- `schema.ts`: Drizzle table definitions (users, events, registrations, gallery, contacts) with Zod insert schemas generated via `drizzle-zod`
- `routes.ts`: Centralized API route definitions with paths, HTTP methods, and Zod validation schemas. Used by both client and server for type safety.

### Database Schema
- **users**: id, name, rollNumber, email, password, role (super_admin/admin/core_team/member/user), membershipStatus (active/inactive/pending), timestamps
- **events**: id, title, description, date, venue, capacity, createdBy (FK to users), status (upcoming/completed/cancelled), createdAt
- **registrations**: id, userId (FK), eventId (FK), attended, status (registered/waitlist/cancelled), registeredAt
- **gallery**: id, imageUrl, caption, eventId (optional FK), uploadedBy (FK), createdAt
- **contacts**: id, and other contact message fields (name, email, message, etc.)

### User Roles & Access Control
Five roles in hierarchical order: super_admin, admin, core_team, member, user. The admin dashboard (`/admin`) is protected and only accessible to admin and super_admin roles. New users register with role "user" and membershipStatus "pending", requiring admin approval to become "active" members.

### Build Process
- **Development**: `tsx server/index.ts` runs the server; Vite dev server is set up as middleware with HMR
- **Production Build**: `script/build.ts` runs Vite build for the client (output to `dist/public`) and esbuild for the server (output to `dist/index.cjs`). Certain server dependencies are bundled to reduce cold start times.
- **Database Push**: `npm run db:push` uses drizzle-kit to push schema changes to PostgreSQL

### Key Pages
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | Home | Hero section, feature highlights, upcoming events |
| `/about` | About | CSI overview, mission/vision, faculty message, milestones |
| `/team` | Team | Managing team member cards with photos |
| `/why-us` | WhyUs | Benefits of joining CSI as feature cards |
| `/events` | Events | Searchable/filterable event listing |
| `/gallery` | GalleryPage | Categorized image grid with lightbox |
| `/membership` | Membership | Pricing and membership process |
| `/login` | Login | Session-based authentication |
| `/register` | Register | New user registration |
| `/admin` | Dashboard | Protected admin panel with stats and user management |

## External Dependencies

### Database
- **PostgreSQL**: Primary data store, connected via `DATABASE_URL` environment variable. Used for both application data (Drizzle ORM) and session storage (`connect-pg-simple`).

### Key npm Packages
- **drizzle-orm** + **drizzle-kit**: ORM and migration tooling for PostgreSQL
- **express** + **express-session** + **passport** + **passport-local**: Server framework and authentication
- **connect-pg-simple**: PostgreSQL-backed session store
- **@tanstack/react-query**: Client-side server state management
- **shadcn/ui components**: Full suite of Radix UI-based components (dialog, dropdown, tabs, toast, etc.)
- **framer-motion**: Animation library for page transitions
- **react-hook-form** + **@hookform/resolvers**: Form management with Zod validation
- **recharts**: Data visualization for admin dashboard charts
- **date-fns**: Date formatting
- **helmet**: HTTP security headers
- **express-rate-limit**: API rate limiting
- **zod**: Schema validation (shared between client and server)

### Environment Variables
- `DATABASE_URL` (required): PostgreSQL connection string
- `SESSION_SECRET` (optional): Session encryption secret, defaults to "csi_chapter_secret"

### External Services
- **Unsplash**: Used for placeholder/prototype images (hardcoded URLs, no API key needed)
- **Google Fonts**: Inter and Outfit fonts loaded via CDN