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
    body("Type_dechets"),
    body("date_depot"),
    body("nombre_capacite"),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .put(
    multer("image", 5 * 1024 * 1024),
    body("Type_dechets"),
    body("date_depot"),
    body("nombre_capacite"),
    putOnce
  );

export default router;
