import express from "express";
import { body, query } from "express-validator";

import multer from "../middlewares/multer-config.js";
import Type from '../models/Type.js';

import { getAll, addOnce, getOnce, putOnce ,deleteOnce } from "../controllers/Type.js";

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    multer("image_type", 5 * 1024 * 1024),
    body("titre"),
    // body("description"),
    addOnce
  );

  router.get('/stats/total', async (req, res) => {
    try {
        const totaltype = await Type.countDocuments();
        res.json({ totaltype });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
  });

  router.get('/stats/bytitre', async (req, res) => {
    try {
        const statsByStatus = await Type.aggregate([
            { $group: { _id: '$titre', count: { $sum: 1 } } }
        ]);
        res.json(statsByStatus);
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
  });

router
  .route("/:titre")
  .get(getOnce)
  .delete(deleteOnce);
  router
  .route("/:id")
  .put(
    body("titre"),
    multer("image_type", 5 * 1024 * 1024),
    // body("description"),
    putOnce
  );

export default router;
