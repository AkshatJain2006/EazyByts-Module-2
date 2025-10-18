# Team Git Workflow

## Branches Created
- `master` - Main branch (protected)
- `frontend-bishwanath` - Bishwanath's frontend work
- `backend-akshay` - Akshay's backend work  
- `database-dev` - Database developer's work

## How Each Member Works

### Bishwanath (Frontend)
```bash
git clone https://github.com/AkshatJain2006/StockExchange-web04.git
cd StockExchange-web04
git checkout frontend-bishwanath
cd frontend
npm start
# Make changes, then:
git add .
git commit -m "Add login component"
git push origin frontend-bishwanath
```

### Akshay (Backend)
```bash
git clone https://github.com/AkshatJain2006/StockExchange-web04.git
cd StockExchange-web04
git checkout backend-akshay
cd backend
npm install && npm run dev
# Make changes, then:
git add .
git commit -m "Add auth routes"
git push origin backend-akshay
```

### Database Developer
```bash
git clone https://github.com/AkshatJain2006/StockExchange-web04.git
cd StockExchange-web04
git checkout database-dev
# Work on database files, then:
git add .
git commit -m "Update database schema"
git push origin database-dev
```

## Integration Process
1. Each member works on their branch
2. When ready, create Pull Request to `master`
3. Akshat reviews and merges
4. Others pull latest `master` to stay updated

## Daily Sync
```bash
# Pull latest changes from master
git checkout master
git pull origin master
# Merge into your branch
git checkout your-branch-name
git merge master
```