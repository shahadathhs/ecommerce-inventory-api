# Ecommerce Inventory API

A backend API for managing categories, products, and inventory with file upload support.

## 📌 Overview
This is a simple **Ecommerce Inventory Management API** built with **NestJS** and **Prisma ORM**.  
It supports **Category & Product CRUD operations**, product filtering (by category, price, pagination), and **file upload to Supabase storage**.

### 🔗 Live URL & Swagger API Docs
👉 [https://ecommerce-inventory-api-irhk.onrender.com/api/docs](https://ecommerce-inventory-api-irhk.onrender.com/api/docs)

### 🗂 Database ERD
- ERD Diagram: [View Online](https://dbdiagram.io/d/Ecommerce-Inventory-API-68ce5342960f6d821a025460)  
- Diagram Image: available inside the **`/db`** folder at the root of the project

---

## ⚡ Tech Stack

- **[NestJS](https://nestjs.com/)** — backend framework
- **[PostgreSQL](https://www.postgresql.org/)** with **[Prisma ORM](https://www.prisma.io/)**
- **[Neon](https://neon.tech/)** — Postgres database hosting
- **[Supabase Storage](https://supabase.com/storage)** — file upload & management (via Multer)
- **[Swagger](https://swagger.io/)** — API documentation

## ⚙️ Environment Setup

Create a `.env` file in the root directory using `.env.example` as a reference:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"

JWT_SECRET="super-secret-key"
ACCESS_TOKEN_EXPIRES_IN="7d"

NODE_ENV=development
PORT=4000

SUPABASE_URL="https://xyz.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="service-role-key-with-permissions"

# Ensure the Supabase Storage has a bucket named "product"
# You can create one from Supabase Dashboard → Storage → Create Bucket
```

---

## Running Locally

1. **Clone the repo**

   ```bash
   git clone https://github.com/shahadathhs/ecommerce-inventory-api.git
   cd ecommerce-inventory-api
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Generate Prisma client & run migrations**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

4. **Start the server**

   ```bash
   pnpm dev
   ```

5. **Open Swagger docs**

   ```
   http://localhost:4000/api/docs
   ```

## 🌐 Deployment

* Backend is hosted on **Render**
* Database is hosted on **Neon**
* File uploads are stored on **Supabase Storage**

## 📁 Project Structure

```
src/
 ├── modules/
 │   ├── category/      # Category management (CRUD)
 │   ├── product/       # Product management (CRUD + filters)
 │   ├── auth/          # Authentication (Login, Register, refresh etc)
 ├── common/            # Shared utils, decorators, guards, interceptors
 ├── lib/
 │   ├── prisma/        # Prisma service & migrations
 │   ├── file/          # Supabase file upload service
 └── main.ts            # App entrypoint
```

## ✨ Features

* Category CRUD (unique name, slug auto-generated)
* Product CRUD with filters (category, price range, pagination)
* Supabase file upload (with delete handling)
* Swagger API documentation
* Repository pattern architecture
