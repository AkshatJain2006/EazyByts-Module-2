import pool from '../config/database.js';

// Get user's portfolio
export const getPortfolio = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming JWT middleware sets req.user
    
    const [rows] = await pool.query(`
      SELECT 
        p.stock_symbol,
        p.quantity,
        p.avg_price,
        (p.quantity * p.avg_price) as total_value
      FROM portfolio p 
      WHERE p.user_id = ?
    `, [userId]);
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Portfolio fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch portfolio' });
  }
};

// Get user's balance
export const getBalance = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const [rows] = await pool.query('SELECT balance FROM users WHERE id = ?', [userId]);
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, balance: rows[0].balance });
  } catch (error) {
    console.error('Balance fetch error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch balance' });
  }
};