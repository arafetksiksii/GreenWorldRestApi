import express from "express";
import { body, query } from "express-validator";

import multer from "../middlewares/multer-config.js";

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
