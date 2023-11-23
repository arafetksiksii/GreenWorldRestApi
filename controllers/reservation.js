import Event from '../models/event.js';
import Reservation from '../models/reservation.js';

export async function reserveEvent(req, res) {
    try {
        const { date_reservation, eventID, userID } = req.body;

        if (!date_reservation || !eventID || !userID) {
            return res.status(400).json({ error: "Tous les champs sont obligatoires." });
        }

        // Récupérez l'événement associé à l'ID
        const event = await Event.findById(eventID);

        if (!event) {
            return res.status(404).json({ error: "L'événement n'existe pas." });
        }

        // Vérifiez si des places sont disponibles
        if (event.places_disponibles <= 0) {
            return res.status(400).json({ error: "Plus de places disponibles." });
        }

        // Enregistrez la réservation dans la base de données
        const newReservation = await Reservation.create({
            date_reservation,
            eventID,
            userID,
        });

        // Mettez à jour l'événement
        event.nbparticipant += 1;
        event.nbPlace -= 1;
        await event.save();

        return res.status(201).json(newReservation);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erreur lors de la réservation de l'événement." });
    }
}
export function getAllReservation(req, res) {
    Reservation
    .find({})
   
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
} 
