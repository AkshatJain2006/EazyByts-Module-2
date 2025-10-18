# Deployment Guide

## Frontend Deployment (Vercel)

### 1. Build for Production
```bash
cd frontend
npm run build
```

### 2. Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

### 3. Environment Variables
Add in Vercel dashboard:
- `REACT_APP_API_URL`: Your backend URL
- `REACT_APP_STOCK_API_KEY`: Stock API key

---

## Backend Deployment (Render/Railway)

### 1. Prepare for Deployment
```bash
cd backend
npm install --production
```

### 2. Deploy to Render
- Connect GitHub repository
- Set build command: `npm install`
- Set start command: `npm start`

### 3. Environment Variables
Set in deployment platform:
- `PORT`: 5000
- `JWT_SECRET`: Strong secret key
- `DB_HOST`: Database host
- `DB_USER`: Database username  
- `DB_PASSWORD`: Database password
- `DB_NAME`: stock_dashboard
- `STOCK_API_KEY`: Your stock API key

---

## Database Deployment

### Option 1: PlanetScale (MySQL)
1. Create account at planetscale.com
2. Create database
3. Get connection string
4. Update backend .env

### Option 2: MongoDB Atlas
1. Create account at mongodb.com/atlas
2. Create cluster
3. Get connection string
4. Update backend to use MongoDB

---

## Stock API Setup

### Finnhub.io (Recommended)
1. Sign up at finnhub.io
2. Get free API key
3. Add to environment variables
4. Update backend stock routes

### Alpha Vantage (Alternative)
1. Sign up at alphavantage.co
2. Get free API key  
3. Update API endpoints in backend

---

## Final Checklist
- [ ] Frontend builds without errors
- [ ] Backend starts successfully
- [ ] Database connection works
- [ ] Stock API integration tested
- [ ] Environment variables set
- [ ] CORS configured for production URLs
- [ ] Socket.io configured for production