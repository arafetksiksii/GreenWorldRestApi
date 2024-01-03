import express from "express";
import { body } from "express-validator";

import { getAll, addOnce, getOnce, putOnce ,deleteOnce} from "../controllers/pointCollect.js";
const router = express.Router();

router
  .route("/")
  .get(getAll)
  .post(
    body("nom"),
    body("latitude"),
    body("longitude"),
    body("capacite"),
    addOnce
  );

router
  .route("/:id")
  .get(getOnce)
  .delete(deleteOnce)
  .put(
    body("nom"),
    body("latitude"),
    body("longitude"),
    body("capacite"),
    putOnce
  );


export default router;
