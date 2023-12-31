// Importer express et le contrôleur de réservation
import express from 'express';
import { getAllReservation, getUsersAndEvents, getUsersWithMostReservations, reserveEvent } from '../controllers/reservation.js';
import Reservation from '../models/reservation.js';
const router = express.Router();
router.route('/')
.post(reserveEvent)
.get(getAllReservation);
router.get('/usersWithMostReservations', getUsersWithMostReservations);
router.get('/usersAndEvents', getUsersAndEvents);

export default router;
