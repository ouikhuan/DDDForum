# Code-First

> This is where you'll write your code-first implementation of the User Story from DDDForum. You can [see the assignment page for more details](https://www.essentialist.dev/products/the-software-essentialist/categories/2153149734/posts/2168948146).

## Database Setup

This project uses PostgreSQL with Prisma as the ORM. Follow these steps to set up the database:

### Prerequisites

- PostgreSQL installed and running on your system
- Node.js and npm installed

### Steps

1. **Create a PostgreSQL database**

   You can create a database using the PostgreSQL command line:
   ```bash
   createdb dddforum
   ```
   
   Or using the PostgreSQL interactive terminal (`psql`):
   ```sql
   CREATE DATABASE dddforum;
   ```

2. **Set up environment variables**

   Create a `.env` file in the root directory of the project and add your database connection string:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/dddforum?schema=public"
   ```
   
   Replace `username`, `password`, and `dddforum` with your actual PostgreSQL credentials and database name.

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Run database migrations**

   This will apply all the database schema changes:
   ```bash
   npx prisma migrate deploy
   ```
   
   Or if you're in development and want to apply pending migrations:
   ```bash
   npx prisma migrate dev
   ```

5. **Generate Prisma Client**

   Generate the Prisma Client (this is usually done automatically, but you can run it manually if needed):
   ```bash
   npx prisma generate
   ```

### Verifying the Setup

You can verify that your database is set up correctly by running:
```bash
npx prisma studio
```

This will open Prisma Studio in your browser, where you can view and manage your database data.