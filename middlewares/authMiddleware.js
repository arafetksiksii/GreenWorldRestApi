
import jwt from 'jsonwebtoken';

export const authenticateUser = (req, res, next) => {
  const token = req.header('Authorization');
  console.log('Received Token:', token); // dbug

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, 'your-secret-key'); // Replace 'your-secret-key' with your actual secret key
    req.user = decoded.user;
    console.log("mmmmmmmmmmmmmm",req.user);
    next();
  } catch (err) {
    res.status(401).json({ message: 'Unauthorized - Invalid token' });
  }
};

export const authorizeAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden - Admin access required' });
  }
  next();
};
