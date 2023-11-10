import express from 'express';
import { body } from 'express-validator'; // Importer express-validator
import { getAll, addOnce, getOnce,
  putOnce, patchOnce, deleteOnce } from '../controllers/comment.js';
import multer from '../middlewares/multer-config.js'; // Importer la configuration de multer

const router = express.Router();
router
  .route('/')
  .get(getAll)
  .post(    
    addOnce
  );
  router
  .route('/:auteur')
  .get(getOnce)
  .put(putOnce)
  .patch(patchOnce)
  .delete(deleteOnce);
  export default router;