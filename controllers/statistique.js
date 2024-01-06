import User from '../models/user.js';

export async function getUserDechetsStats(req, res) {
  try {
    const userStats = await User.find({}, 'nombre_dechets_ajoutes');

    const stats = userStats.map(user => ({
      userID: user._id,
      nombre_dechets_ajoutes: user.nombre_dechets_ajoutes
    }));

    res.status(200).json(stats);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
