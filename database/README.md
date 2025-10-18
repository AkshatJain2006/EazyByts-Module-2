# Database Setup Guide

## MySQL Installation & Setup

### 1. Install MySQL
- Download MySQL from: https://dev.mysql.com/downloads/mysql/
- Install MySQL Workbench for GUI management

### 2. Create Database
```sql
-- Run the schema.sql file to create tables
mysql -u root -p < schema.sql
```

### 3. Database Configuration
Update the `.env` file in backend directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=stock_dashboard
```

### 4. Test Connection
```bash
cd ../backend
npm install
node -e "const mysql = require('mysql2'); const conn = mysql.createConnection({host:'localhost',user:'root',password:'your_password',database:'stock_dashboard'}); conn.connect(err => console.log(err ? 'Error: ' + err.message : 'Connected to MySQL'));"
```

## Database Structure

### Tables:
- **users**: User accounts and balance
- **portfolio**: User stock holdings
- **transactions**: Buy/sell transaction history
- **notifications**: User notifications (optional)

### Sample Data
```sql
-- Insert test user
INSERT INTO users (name, email, password, balance) 
VALUES ('Test User', 'test@example.com', '$2a$10$hashedpassword', 10000.00);
```

## Alternative: MongoDB Atlas
If team prefers MongoDB, update backend to use MongoDB with these collections:
- users
- portfolio  
- transactions
- notifications