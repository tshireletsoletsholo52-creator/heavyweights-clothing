# Clothing Store — Backend Setup

## 1. Install dependencies
```
npm install
```

## 2. Set up your environment
Copy `.env.example` to `.env` and paste in your real Neon connection string:
```
cp .env.example .env
```

## 3. Push the schema to your database
This reads `prisma/schema.prisma` and creates the actual tables in Neon:
```
npx prisma migrate dev --name init
```
This will:
- Create the tables (Product, Variant, Customer, Order, OrderItem, RestockSubscriber)
- Generate the Prisma Client so you can query the DB from code

## 4. Verify it worked
```
npx prisma studio
```
This opens a browser-based GUI where you can see your (empty) tables. If you see them, the database is wired up correctly.

## 5. Run the server
```
npm run dev
```
Visit `http://localhost:4000/api/health` — you should see `{"status":"ok"}`.

## Next steps
- Seed some fake products so we have data to build pages against
- Build `GET /api/products` route
- Start on the product listing page
