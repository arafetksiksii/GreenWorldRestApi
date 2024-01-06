import express from "express";
import { body,query } from "express-validator";
import { getAll, 
  addOnce,
   getOnce,
    putOnce ,
    deleteOnce,
    updateDechetState,
    getAllForUser,

} from "../controllers/dechets.js";
import Dechets from '../models/dechets.js';

const router = express.Router();


router.get("/detaill", [
  query("id").isMongoId().withMessage("Invalid dechets ID format"),
], async (req, res) => {
  console.log(req.query); // Add this line for debugging
  const dechetId = req.query.id;
  try {
    const dechets = await Dechets.findById(dechetId);
    if (!dechets) {
      return res.status(404).json({ message: 'dechets not found' });
    }
    res.status(200).json(dechets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router
  .route("/")
  .get(getAll)
  .post(
    body("Type_dechets"),
    body("date_depot"),
    body("nombre_capacite"),
    body("adresse"),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .delete(deleteOnce)
  .put(
    body("Type_dechets"),
    body("date_depot"),
    body("nombre_capacite"),
    body("adresse"),
    putOnce
  );
  router
  .route("/api/dechets/:id")
  .put(updateDechetState);

  router.get('/user/:userId', getAllForUser);


  router.get('/api/statistics', async (req, res) => {
    try {
      const result = await Dechets.aggregate([
        {
          $lookup: {
            from: 'users',  // Update 'users' to the actual name of your User collection
            localField: 'userID',
            foreignField: '_id',
            as: 'user',
          },
        },
        {
          $unwind: '$user',
        },
        {
          $group: {
            _id: '$userID',
            userEmail: { $first: '$user.email' },
            count: { $sum: 1 },
          },
        },
      ]);
  
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
// Route pour obtenir le nombre total de déchets enregistrés
router.get('/stats/total', async (req, res) => {
  try {
      const totalDechets = await Dechets.countDocuments();
      res.json({ totalDechets });
  } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
  }
});
router.get('/statistiques', async (req, res) => {
  try {
      const stats = await Dechets.aggregate([
          {
              $group: {
                  _id: { $dateToString: { format: '%Y-%m-%d', date: '$date_depot' } },
                  count: { $sum: 1 }
              }
          },
          {
              $sort: { _id: 1 }
          }
      ]);
      res.json(stats);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Erreur lors de la récupération des statistiques temporelles' });
  }
});
// Route pour obtenir le nombre de déchets par état
router.get('/stats/byStatus', async (req, res) => {
  try {
      const statsByStatus = await Dechets.aggregate([
          { $group: { _id: '$etat', count: { $sum: 1 } } }
      ]);
      res.json(statsByStatus);
  } catch (error) {
      res.status(500).json({ error: 'Erreur serveur' });
  }
});


export default router;
