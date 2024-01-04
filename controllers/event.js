import { validationResult } from 'express-validator'; // Importer express-validator
import Event from '../models/event.js'
export function getAll(req, res) {
    Event
    .find({})
    .populate('comments')  // Indique à Mongoose de remplir le champ 'comments'
    .populate('reservations')
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
} 
export function getAllEvents(req, res) {
  Event.find({})
  .then((docs) => {
    let list = [];
    for (let i = 0; i < docs.length; i++) {
      list.push({
        id: docs[i]._id,
        titre: docs[i].titre,
        lieu: docs[i].lieu,
        nbPlace: docs[i].nbPlace,
        image: docs[i].image,
        dateDebut: docs[i].dateDebut,

        dateFin: docs[i].dateFin,

        description: docs[i].description,

        Comment: docs[i].comments,

        


      });
    }
    res.status(200).json(list);
  })
  .catch((err) => {
    res.status(500).json({ error: err });
  });
}
export function getAllCountComments(req, res) {
  Event.aggregate([
    {
      $project: {
        eventName: 1,  // Ajouter les champs que vous souhaitez inclure
        commentCount: { $size: '$comments' }
      }
    }
  ])
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}


export function addOnce(req, res) {
  // Trouver les erreurs de validation dans cette requête et les envelopper dans un objet
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
  } else {
      const { dateDebut, dateFin } = req.body;

      // Vérifier que la date de début est avant la date de fin
      if (new Date(dateDebut) >= new Date(dateFin)) {
          return res.status(400).json({ error: "La date de début doit être avant la date de fin." });
      }

      // Vérifier que les dates sont à partir de 2023
      const currentYear = new Date().getFullYear();
      if (new Date(dateDebut).getFullYear() < 2023 || new Date(dateFin).getFullYear() < 2023) {
          return res.status(400).json({ error: "Les dates doivent être à partir de l'année 2023." });
      }
      console.log(req.file);
      // Invoquer la méthode create directement sur le modèle
      Event.create({
          titre: req.body.titre,
          dateDebut: req.body.dateDebut,
          dateFin: req.body.dateFin,
          lieu: req.body.lieu,
          description: req.body.description,
          nbPlace: req.body.nbPlace,
          // Récupérer l'URL de l'image pour l'insérer dans la BD
          image: req.file.filename,
          longitude: req.body.longitude,
          latitude: req.body.latitude
      })
      .then(newEvent => {
          res.status(200).json(newEvent);
      })
      .catch(err => {
          res.status(500).json({ error: err });
      });
  }
}

export async function putOnce(req, res) {
  const eventId = req.params.id;

  try {
    // Retrieve the existing event from the database
    const existingEvent = await Event.findById(eventId);

    if (!existingEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Update the fields based on the request data
    existingEvent.titre = req.body.titre;
    existingEvent.dateDebut = req.body.dateDebut;
    existingEvent.dateFin = req.body.dateFin;
    existingEvent.lieu = req.body.lieu;
    existingEvent.description = req.body.description;
    existingEvent.nbPlace = req.body.nbPlace;

    // Check if a new image file is provided
    if (req.file !== undefined) {
      existingEvent.image = req.file.filename;
    }

    // Update other fields like latitude and longitude if needed
    existingEvent.longitude = req.body.longitude;
    existingEvent.latitude = req.body.latitude;

    // Save the updated event back to the database
    await existingEvent.save();

    // Send a response to the client
    res.status(200).json({ message: 'Event updated successfully' });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
/**
 * Mettre à jour plusieurs documents
 * Remarque : renommez putOnce par putAll
 */
export function putAll(req, res) {
    Event
    .updateMany({}, { "lieu": String })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
}

/**
 * Mettre à jour un seul document
 */
export function patchOnce(req, res) {
    Event
      .findOneAndUpdate({ "titre": req.params.titre }, { "description": req.body.description },{ "lieu": req.body.lieu },{ "nbparticipant": req.body.nbparticipant },{ "dateDebut": req.body.dateDebut },{ "dateFin": req.body.dateFin },{ "image": req.body.image }, { new: true })
      .then(doc => {
        if (doc) {
          res.status(200).json(doc);
        } else {
          res.status(404).json({ message: "Document not found" });
        }
      })
      .catch(err => {
        res.status(500).json({ error: err });
      });
  }
/**
 * Supprimer un seul document
 */
export function deleteOnce(req, res) {
  const { id } = req.params;

  Event.findOneAndDelete({ _id: id })
    .then((doc) => {
      if (doc) {
        res.status(200).json({ message: "Document deleted successfully", deletedDoc: doc });
      } else {
        res.status(404).json({ message: "Document not found" });
      }
    })
    .catch((err) => {
      console.error("Error deleting document:", err);
      res.status(500).json({ error: "Internal server error" });
    });
}
  //update un evennement:
  export async function modifierEvenement(eventId, newDetails,req) {
    try {
      // Vérifier si l'événement existe
      const event = await Event.findById(eventId);
  
      if (!event) {
        return { success: false, message: 'Événement non trouvé' };
      }
  
      // Mettre à jour les détails de l'événement avec les nouvelles informations
      event.titre = newDetails.titre || event.titre;
      event.dateDebut = newDetails.dateDebut || event.dateDebut;
      event.dateFin = newDetails.dateFin || event.dateFin;
      event.lieu = newDetails.lieu || event.lieu;
      event.description = newDetails.description || event.description;
      event.nbparticipant = newDetails.nbparticipant || event.nbparticipant;
      event.nbPlace = newDetails.nbPlace || event.nbPlace;
      event.image = `${req.protocol}://${req.get('host')}/img/${req.file.filename}`;
  
      // Sauvegarder les modifications
      const updatedEvent = await event.save();
  
      return { success: true, event: updatedEvent, message: 'Événement mis à jour avec succès' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  export function getEventByname(req, res) {
    const searchTerm = req.query.searchTerm;

    if (!searchTerm) {
        return res.status(400).json({ error: 'Le paramètre de recherche (searchTerm) est requis.' });
    }

    Event
        .find({ titre: { $regex: new RegExp(searchTerm, 'i') } })
        .then(docs => {
            res.status(200).json(docs);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
}

export function trierparDate(req, res) {
  Event
  .find({})
  .sort('-dateDebut') // Tri descendant (enlever le '-' pour un tri ascendant)
  .exec() // Executer la requête
  .then(docs => {
      res.status(200).json(docs);
  })
  .catch(err => {
      res.status(500).json({ error: err });
  });
} 
export async function getEventByID(req, res) {
  try {
    const eventID = req.params.eventID;

    // Utilisez la méthode findById de Mongoose pour trouver un événement par son ID
    const event = await Event.findById(eventID);

    if (!event) {
      // Si aucun événement n'est trouvé avec l'ID donné, retournez une réponse 404
      return res.status(404).json({ message: 'Event not found' });
    }

    // Retournez l'événement trouvé avec un statut 200
    res.status(200).json(event);
  } catch (error) {
    // S'il y a une erreur pendant le processus, retournez une réponse 500
    res.status(500).json({ error: error.message });
  }
}
export function getRandomEvent(req, res) {
  // Use the Event model to aggregate and get a random event
  Event.aggregate([{ $sample: { size: 1 } }])
    .exec((err, randomEvent) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }

      if (randomEvent.length === 0) {
        return res.status(404).json({ error: "No random event found" });
      }

      // If successful, return the random event
      res.status(200).json(randomEvent[0]);
    });
  }
  //getOnce bech nestaamalha fil details
  export function getOnce(req, res) {
    Event.findById(req.params.id)
      .then((doc) => {
        res.status(200).json(doc);
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  }

    
