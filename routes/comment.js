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
  getCommentsForEvent,
} from '../controllers/comment.js';

const router = express.Router();

router.route('/').get(getAll).post(addOnce);
// Route pour obtenir un commentaire par ID
router.route('/comment/:commentID').get(getCommentByID);

// Route pour mettre à jour un commentaire (utilisation de patchOnce)
router.route('/:commentID').patch(patchOnce);

// Route pour remplacer entièrement un commentaire (utilisation de putOnce)
router.route('/comment/:commentID').put(putOnce);

// Route pour supprimer un commentaire
router.route('/:commentID').delete(deleteOnce);
router.route('/event/:eventID').get(getCommentsByEvent);
router.route('/trierEvent').get(trierparDateCom);

// Définissez le gestionnaire de route
const getCommentsForEventRoute = async (req, res, next) => {
  try {
    const eventID = req.params.eventID;
    const comments = await getCommentsForEvent(eventID, req);
    res.json(comments);
  } catch (error) {
    console.error(error); // Affichez l'erreur pour le débogage
    next(error);
  }
};

// Utilisez le gestionnaire de route dans votre définition de route
router.route('/events/:eventID').get(getCommentsForEventRoute);

export default router;