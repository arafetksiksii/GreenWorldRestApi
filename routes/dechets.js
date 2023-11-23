import express from "express";
import { body } from "express-validator";

import multer from "../middlewares/multer-config.js";

import { getAll, addOnce, getOnce, putOnce } from "../controllers/dechets.js";

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    multer("image", 5 * 1024 * 1024),
    body("Type_dechets").isLength({ min: 10 }),
    body("date_depot"),
    body("nombre_capacite").isNumeric(),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .put(
    multer("image", 5 * 1024 * 1024),
    body("Type_dechets").isLength({ min: 10 }),
    body("date_depot"),
    body("nombre_capacite").isNumeric(),
    putOnce
  );

export default router;
