import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_raksha_key_change_me';

export default function authorize(req, res, next) {
  // Get token from header (Format: "Bearer <token>")
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'Access denied. No token provided.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // payload: { id: user.id }
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
}
