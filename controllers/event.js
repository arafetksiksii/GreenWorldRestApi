import { validationResult } from 'express-validator'; // Importer express-validator
import Event from '../models/event.js'
export function getAll(req, res) {
    Event
    .find({})
    .then(docs => {
        res.status(200).json(docs);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
} 
export function addOnce(req, res) {

  // Trouver les erreurs de validation dans cette requête et les envelopper dans un objet
  if(!validationResult(req).isEmpty()) {
      res.status(400).json({ errors: validationResult(req).array() });
  }
  else {
      // Invoquer la méthode create directement sur le modèle
      Event
      .create({
          titre: req.body.titre,
          dateDebut: req.body.dateDebut,
          dateFin: req.body.dateFin,
          lieu: req.body.lieu,
          description: req.body.description,
          nbparticipant: req.body.nbparticipant,
          nbPlace: req.body.nbPlace,
          // Récupérer l'URL de l'image pour l'insérer dans la BD
          image: `http://10.0.2.2:9090/img/${req.file.filename}`,
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

export function putOnce(req, res) {
    res.status(200).json({ message: "Updated !", titre: req.params.titre});
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
    Event
      .findOneAndDelete({ "titre": req.params.titre })
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

    
