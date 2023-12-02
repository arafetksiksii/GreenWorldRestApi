// Importer express et le contrôleur de réservation
import express from 'express';
import { getAllReservation, reserveEvent } from '../controllers/reservation.js';
const router = express.Router();
router.route('/')
.post(reserveEvent)
.get(getAllReservation);

export default router;
