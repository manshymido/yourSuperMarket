# YourSuperMarket - Online Grocery Delivery Platform

A modern full-stack e-commerce platform for supermarket delivery in Egypt, built with NestJS (backend) and Next.js 14+ (frontend).

## Features

- **User Authentication**: JWT with refresh tokens, registration, login, password reset
- **Product Catalog**: Categories, products with images (Cloudinary), search and filtering
- **Shopping Cart**: Add/remove items, quantity management, cart persistence
- **Order Management**: Order creation, status workflow, order history, real-time tracking
- **Payment Integration**: Paymob payment gateway and cash on delivery
- **Delivery System**: Governorate-based zones, driver assignment, real-time tracking
- **Reviews & Ratings**: Product reviews with moderation
- **Inventory Management**: Stock tracking, low stock alerts
- **Notifications**: Email notifications (Nodemailer) and in-app notifications
- **Admin Panel**: Dashboard, product/order/user management, analytics
- **Driver Dashboard**: Available deliveries, accept/complete deliveries, delivery history
- **Real-time Updates**: WebSocket (Socket.io) for order tracking with polling fallback

## Tech Stack

### Backend
- **NestJS** (latest) - Modern Node.js framework with TypeScript
- **PostgreSQL** - Relational database with Prisma ORM
- **JWT with Refresh Tokens** - Authentication strategy
- **Socket.io** - Real-time communication
- **Cloudinary** - Image storage and optimization
- **Paymob** - Payment gateway integration
- **Nodemailer** - Email notifications

### Frontend
- **Next.js 14+** (App Router) - React framework with SSR/SSG
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first styling
- **Shadcn/ui** - Modern component library
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Client state management
- **Socket.io Client** - Real-time updates
- **React Hook Form** - Form handling

## Project Structure

```
yourSuperMarket/
├── backend/                 # NestJS application
│   ├── src/
│   │   ├── auth/           # Authentication module
│   │   ├── users/           # User management
│   │   ├── products/       # Product catalog
│   │   ├── categories/     # Category management
│   │   ├── cart/           # Shopping cart
│   │   ├── orders/         # Order management
│   │   ├── delivery/       # Delivery & tracking
│   │   ├── payments/       # Payment processing
│   │   ├── reviews/        # Reviews & ratings
│   │   ├── inventory/      # Inventory management
│   │   ├── admin/          # Admin panel APIs
│   │   ├── notifications/  # Notification service
│   │   ├── governorates/   # Delivery areas (Egypt)
│   │   └── gateway/        # WebSocket gateway
│   └── prisma/             # Database schema & migrations
│
├── frontend/                # Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   ├── components/     # React components
│   │   ├── lib/            # Utilities & configs
│   │   └── types/          # TypeScript types
│
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for image storage)
- Paymob account (for payments)
- Email service credentials (for notifications)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` and `JWT_REFRESH_SECRET` - JWT secrets
- `CLOUDINARY_*` - Cloudinary credentials
- `PAYMOB_*` - Paymob API credentials
- `EMAIL_*` - Email service credentials

4. Generate Prisma client:
```bash
npx prisma generate
```

5. Run database migrations:
```bash
npx prisma migrate dev
```

6. Start the development server:
```bash
npm run start:dev
```

The backend will be available at `http://localhost:3000/api`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` and configure:
- `NEXT_PUBLIC_API_URL` - Backend API URL (default: `http://localhost:3000/api`)

4. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - User logout

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `GET /api/products/slug/:slug` - Get product by slug

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order details

### Admin
- `GET /api/admin/dashboard` - Get dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/orders` - Get all orders

### Driver
- `GET /api/delivery/available` - Get available deliveries
- `POST /api/delivery/:id/accept` - Accept delivery
- `PUT /api/delivery/:id/status` - Update delivery status
- `GET /api/delivery/driver/my-deliveries` - Get driver's deliveries

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User** - Customers, admins, and drivers
- **Product** - Product catalog with images
- **Category** - Product categories with hierarchy
- **Cart & CartItem** - Shopping cart
- **Order & OrderItem** - Orders and order items
- **Payment** - Payment records
- **Delivery** - Delivery tracking
- **Review** - Product reviews
- **Inventory** - Stock management
- **Notification** - In-app notifications
- **Governorate** - Delivery zones in Egypt

## Development

### Running Migrations

```bash
cd backend
npx prisma migrate dev
```

### Generating Prisma Client

```bash
cd backend
npx prisma generate
```

### Viewing Database

```bash
cd backend
npx prisma studio
```

## Production Deployment

1. Build the backend:
```bash
cd backend
npm run build
npm run start:prod
```

2. Build the frontend:
```bash
cd frontend
npm run build
npm start
```

## License

Apache License 2.0

## Support

For issues and questions, please open an issue on the repository.
