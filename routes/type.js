import express from "express";
import { body, query } from "express-validator";

import multer from "../middlewares/multer-config.js";

import { getAll, addOnce, getOnce, putOnce } from "../controllers/Type.js";

const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    body("titre"),
    multer("image_type", 5 * 1024 * 1024),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .put(
    body("titre"),
    multer("image_type", 5 * 1024 * 1024),
    putOnce
  );

export default router;
