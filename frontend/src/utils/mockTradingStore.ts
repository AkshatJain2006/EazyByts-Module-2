interface Holding {
  symbol: string;
  quantity: number;
  averagePrice: number;
}

interface Trade {
  id: string;
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: string;
  total: number;
}

class MockTradingStore {
  private balance: number = 5000000;
  private holdings: Holding[] = [];
  private trades: Trade[] = [];

  getBalance(): number {
    return this.balance;
  }

  getHoldings(): Holding[] {
    return this.holdings;
  }

  getTrades(): Trade[] {
    return this.trades;
  }

  buyStock(symbol: string, quantity: number, price: number): boolean {
    const totalCost = quantity * price;
    
    if (totalCost > this.balance) {
      return false;
    }

    this.balance -= totalCost;
    
    const existingHolding = this.holdings.find(h => h.symbol === symbol);
    if (existingHolding) {
      const totalShares = existingHolding.quantity + quantity;
      const totalValue = (existingHolding.quantity * existingHolding.averagePrice) + totalCost;
      existingHolding.averagePrice = totalValue / totalShares;
      existingHolding.quantity = totalShares;
    } else {
      this.holdings.push({
        symbol,
        quantity,
        averagePrice: price
      });
    }

    this.trades.unshift({
      id: Date.now().toString(),
      symbol,
      action: 'buy',
      quantity,
      price,
      timestamp: new Date().toISOString(),
      total: totalCost
    });

    return true;
  }

  sellStock(symbol: string, quantity: number, price: number): boolean {
    const holding = this.holdings.find(h => h.symbol === symbol);
    
    if (!holding || holding.quantity < quantity) {
      return false;
    }

    const totalValue = quantity * price;
    this.balance += totalValue;
    
    holding.quantity -= quantity;
    
    if (holding.quantity === 0) {
      this.holdings = this.holdings.filter(h => h.symbol !== symbol);
    }

    this.trades.unshift({
      id: Date.now().toString(),
      symbol,
      action: 'sell',
      quantity,
      price,
      timestamp: new Date().toISOString(),
      total: totalValue
    });

    return true;
  }
}

export const mockTradingStore = new MockTradingStore();