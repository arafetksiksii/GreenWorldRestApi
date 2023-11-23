// fichier : routes/resultatQuiz.js

import express from 'express';
import {
  getResultats,
  addResultat,
  getResultatById,
  updateResultatById,
  deleteResultatById,
} from '../controllers/resultatQuiz.js';

const router = express.Router();

router.get('/', getResultats);
router.post('/', addResultat);
router.get('/:id', getResultatById);
router.put('/:id', updateResultatById);
router.delete('/:id', deleteResultatById);

export default router;
