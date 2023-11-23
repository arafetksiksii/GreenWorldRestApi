
import jwt from 'jsonwebtoken';


export const authenticateUser = async (req, res, next) => {
  // Vérifier d'abord le header d'autorisation
  //const token = req.header('Authorization');
  const token = req.body.token;


  if (!token) {
    // Si aucun token n'est présent dans le header, essayez de le récupérer depuis l'utilisateur
    try {
      const user = await User.findById(req.user.id);
      if (!user || !user.token) {
        return res.status(401).json({ message: 'Unauthorized - No valid token found' });
      }
      token = user.token;
      console.log('Retrieved token from user:', token);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Vérifier la validité du token
  try {
    const decoded = jwt.verify(token, 'your-secret-key');
    req.user = decoded.user;
    console.log("User:", req.user);
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



