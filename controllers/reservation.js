import Event from '../models/event.js';
import Reservation from '../models/reservation.js';
import * as nodemailer from 'nodemailer';
import User from '../models/user.js';
import twilio from 'twilio';

// Configurez votre compte Twilio SID et Auth Token
const accountSid = 'ACc9da9cbcce1c8322dc7a08f50d5aa825';
const authToken = 'de7baa4241936bec9804e9b6f58ee63c';

// Créez un client Twilio
const client = twilio(accountSid, authToken);

// Fonction pour envoyer un SMS
function sendSMS(eventName, reservationDate, eventLocation,eventDateDebut,evenDateFin) {
  const excitementEmoji = '🎉'; // Emoji d'excitation
  // Remplacez avec votre numéro de téléphone et le message souhaité
  const messageBody = `Thank you for reserving a spot at "${eventName}" on ${reservationDate}. ${excitementEmoji}${excitementEmoji}${excitementEmoji} Welcome! We're excited to see you at ${eventLocation}. The event kicks off at ${eventDateDebut} and concludes at ${evenDateFin}.`;

  const messageOptions = {
      to: '+21621318555', // Remplacez par le numéro de téléphone du destinataire
      from: '+16572207343', // Remplacez par votre numéro Twilio
      body: messageBody
  };

  // Utilisez le client Twilio pour envoyer le message
  client.messages.create(messageOptions)
      .then(message => console.log(`SMS sent: ${message.sid}`))
      .catch(error => console.error(`Error sending SMS: ${error.message}`));
}


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
      if (event.nbPlace <= 0) {
          return res.status(400).json({ error: "Plus de places disponibles." });
      }

      // Vérifiez si le nombre de places est égal à zéro
      if (event.nbPlace === 0) {
          return res.status(400).json({ error: "Nombre maximum de participants atteint." });
      }

      // Vérifiez que la date de réservation est entre la date de début et la date de fin de l'événement
      const reservationDate = new Date(date_reservation);
      const eventStartDate = new Date(event.dateDebut);
      const eventEndDate = new Date(event.dateFin);
    
    if (reservationDate.getTime() < eventStartDate.getTime() || reservationDate.getTime() > eventEndDate.getTime()) {
      return res.status(400).json({ error: "La date de réservation doit être entre la date de début et la date de fin de l'événement." });
  }
  
    

      // Enregistrez la réservation dans la base de données
      const newReservation = await Reservation.create({
          date_reservation,
          eventID,
          userID,
      });

      // Ajoutez la nouvelle réservation à la liste des réservations de l'événement
      event.reservations.push(newReservation._id);

      // Mettez à jour le nombre de participants en fonction des réservations
      const numberOfParticipants = await Reservation.countDocuments({ eventID });
      event.nbparticipant = numberOfParticipants;

      // Décrémentez nbPlace seulement si des places sont disponibles
      if (event.nbPlace > 0) {
          event.nbPlace -= 1;
      }

      // Avant la sauvegarde
      console.log("Avant la sauvegarde - Nombre de places:", event.nbPlace);
      await event.save();
      // Après la sauvegarde
      console.log("Après la sauvegarde - Nombre de places:", event.nbPlace);

      // Envoyez le SMS
      sendSMS(event.titre, date_reservation, event.lieu, event.dateDebut, event.dateFin);

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
export const getUsersWithMostReservations = async (req, res) => {
    try {
      const usersWithMostReservations = await Reservation.aggregate([
        {
          $group: {
            _id: "$userID",
            totalReservations: { $sum: 1 }
          }
        },
        {
          $lookup: {
            from: "users",  // Le nom de votre collection d'utilisateurs dans la base de données
            localField: "_id",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $unwind: "$user"
        },
        {
          $sort: { totalReservations: -1 }
        }
      ]);
  
      res.json(usersWithMostReservations);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  };
  export async function getUsersAndEvents(req, res) {
    try {
      const userReservations = await Reservation.aggregate([
        {
          $group: {
            _id: '$userID',
            reservations: {
              $push: {
                reservationID: '$_id',
                date_reservation: '$date_reservation',
                eventID: '$eventID',
                comments: '$comments', // Inclure les commentaires dans chaque réservation

              }
            }
          }
        }
      ]);
  
      const usersAndEvents = await Promise.all(
        userReservations.map(async (userReservation) => {
          const user = await User.findById(userReservation._id);
          const events = await Event.find({ _id: { $in: userReservation.reservations.map(res => res.eventID) } });
  
          // Mapper les réservations avec les détails de l'événement, y compris le titre
          const mappedReservations = userReservation.reservations.map(res => {
            const eventDetails = events.find(e => e._id.equals(res.eventID));
            
            return {
              reservationID: res.reservationID,
              date_reservation: res.date_reservation,
              eventID: res.eventID,
              title: eventDetails ? eventDetails.titre : 'Titre inconnu', // Utiliser le titre de l'événement s'il est disponible
            };
          });
  
          return {
            user,
            events: mappedReservations,
          };
        })
      );
  
      res.json(usersAndEvents);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
  