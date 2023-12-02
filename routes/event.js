import express from 'express';
import { body, query } from 'express-validator'; // Import the query function
import Event from '../models/event.js';

import {
  getAll,
  addOnce,
  putOnce,
  patchOnce,
  deleteOnce,
  modifierEvenement,
  getEventByname,
  trierparDate,
  getEventByID,
} from '../controllers/event.js';
import multer from '../middlewares/multer-config.js';

const router = express.Router();

router.route('/')
  .get(getAll)
  .post(
    multer("image",  10 * 1024 * 1024),
    addOnce
  );

router.get("/detail", [
  query("id").isMongoId().withMessage("Invalid event ID format"),
], async (req, res) => {
  const eventId = req.query.id;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/getEventByname', getEventByname);
router.get('/trierEvent', trierparDate);
router.get('/:eventID', getEventByID);

router.route('/:titre')
  .put(putOnce)
  .patch(patchOnce)
  .delete(deleteOnce);

router.put('/update/:eventId', multer, async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const newDetails = req.body;
    const result = await modifierEvenement(eventId, newDetails, req);

    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(404).json(result);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: 'Erreur serveur' });
  }
});

export default router;
