import express from 'express';
import multer from '../middlewares/multer-config.js';
import {
  getAll,
  addOnce,
  getCommentByID,
  getCommentsByEvent,
  trierparDateCom,
  putOnce,
  patchOnce,
  deleteOnce,
} from '../controllers/comment.js';

const router = express.Router();

router.route('/').get(getAll).post(addOnce);
// Route pour obtenir un commentaire par ID
router.route('/comment/:commentID').get(getCommentByID);

// Route pour mettre à jour un commentaire (utilisation de patchOnce)
router.route('/comment/:commentID').patch(patchOnce);

// Route pour remplacer entièrement un commentaire (utilisation de putOnce)
router.route('/comment/:commentID').put(putOnce);

// Route pour supprimer un commentaire
router.route('/comment/:commentID').delete(deleteOnce);
router.route('/event/:eventID').get(getCommentsByEvent);
router.route('/trierEvent').get(trierparDateCom);

export default router;
