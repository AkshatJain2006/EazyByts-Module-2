# API Endpoints

## Auth
- `POST /auth/login` - { email, password }
- `POST /auth/signup` - { name, email, password }

## Stocks  
- `GET /stocks/live` - Get live stock data
- `GET /stocks/:symbol` - Get specific stock

## Portfolio
- `GET /portfolio` - Get user holdings

## Trading
- `POST /trade/buy` - { symbol, quantity }
- `POST /trade/sell` - { symbol, quantity }