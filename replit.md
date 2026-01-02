# Dafenny's Dominican Style - Hair Salon Booking System

## Overview

This is a full-stack web application for a Dominican hair salon called "Dafenny's Dominican Style." The application allows customers to view services, browse a gallery, book appointments online, and provides an admin dashboard for managing appointments. Built with React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack React Query for server state, local React state for UI
- **Styling**: Tailwind CSS v4 with shadcn/ui component library (New York style)
- **Animations**: Framer Motion for page transitions and interactive elements
- **Build Tool**: Vite with custom plugins for Replit integration

**Key Pages**:
- Home, Services, About, Gallery, Contact (public)
- Booking (appointment scheduling flow)
- Admin (protected dashboard for appointment management)

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **API Pattern**: REST API with `/api` prefix
- **Authentication**: Simple token-based admin authentication using environment variable `ADMIN_PASSWORD`
- **Session Management**: In-memory token storage (tokens stored in a Set)

**Key Endpoints**:
- `POST /api/admin/login` - Admin authentication
- `POST /api/admin/logout` - Clear admin session
- `GET/POST /api/appointments` - CRUD operations for appointments (protected routes require Bearer token)

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts`
- **Migrations**: Drizzle Kit (`drizzle-kit push` for schema sync)

**Main Table**: `appointments`
- Customer info (name, email, phone)
- Appointment details (date, time, service, price)
- Status tracking (scheduled, completed, cancelled)
- Timestamps

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route pages
│   │   ├── config/       # Salon configuration (services, hours)
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database operations layer
│   └── db.ts         # Database connection
├── shared/           # Shared code (schema, types)
└── migrations/       # Database migrations
```

### Development vs Production
- **Development**: Vite dev server with HMR, Express serves API
- **Production**: Built with esbuild (server) and Vite (client), static files served from `dist/public`

## External Dependencies

### Database
- **PostgreSQL**: Required, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string (required)
- `ADMIN_PASSWORD`: Password for admin dashboard access (required for admin features)

### Third-Party Services
- **Google Fonts**: Playfair Display (serif) and Montserrat (sans-serif) loaded via CDN
- No external payment processing, email services, or analytics currently integrated

### Key NPM Dependencies
- `@tanstack/react-query`: Server state management
- `framer-motion`: Animations
- `wouter`: Client-side routing
- `date-fns`: Date manipulation
- `zod` + `drizzle-zod`: Schema validation
- Full shadcn/ui component suite (Radix UI primitives)

## Future Features (Pending)

### Multi-Stylist Booking System
**Status**: Pending - Owner reviewing design mockups
**Description**: Allow customers to choose their preferred stylist when booking appointments. Each stylist would have their own profile with photo and name, and customers can see availability specific to that stylist.

**Design Mockups Available**:
- Desktop version: `attached_assets/generated_images/multi-stylist_booking_interface_mockup.png`
- Mobile version: `attached_assets/generated_images/mobile_multi-stylist_booking_mockup.png`
- Simple horizontal layout: `attached_assets/generated_images/simple_horizontal_stylist_selection_mobile.png`
- Full calendar layout: `attached_assets/generated_images/full_calendar_stylist_booking_mobile.png`

**Implementation Options**:
1. **Admin-only management** - Salon owner manages all stylists through admin dashboard (simpler)
2. **Individual stylist logins** - Each stylist has their own account to manage schedule

**Customer Booking UI Design**:
- Horizontal row of circular stylist photos with first names
- Gold ring border on selected stylist
- Full calendar below stylist selection
- Time slots based on selected stylist's availability

**Admin Dashboard UI Design** (Reference: `attached_assets/image_1767312887937.png`, Mockup: `attached_assets/generated_images/admin_schedule_grid_view_mockup.png`):
- Grid-style schedule view showing all stylists at once
- Stylist photos in horizontal row at top
- Time slots running down the left side (10:00 AM, 11:00 AM, etc.)
- Each column represents one stylist
- Appointments shown as color-coded blocks with:
  - Time range (e.g., "10:15 - 11:00")
  - Client name
  - Service type
- Easy visual overview of entire salon's daily schedule