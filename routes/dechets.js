import express from "express";
import { body,query } from "express-validator";
import { getAll, addOnce, getOnce, putOnce ,deleteOnce,updateDechetState,getAllForUser
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


export default router;
