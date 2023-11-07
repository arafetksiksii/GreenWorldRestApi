import express from "express";
import { body } from "express-validator";

import { getAll, addOnce, getOnce, putOnce } from "../controllers/demande.js";

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    body("titre").isLength({ min: 10 }),
    body("date_demande"),
    body("type_materiel").isLength({ min: 10 }),
    body("adresse").isLength({ min: 50 }),
    body("est_valide"),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .put(
    body("titre").isLength({ min: 10 }),
    body("date_demande"),
    body("type_materiel").isLength({ min: 10 }),
    body("adresse").isLength({ min: 50 }),
    body("est_valide"),
    putOnce
  );

export default router;
