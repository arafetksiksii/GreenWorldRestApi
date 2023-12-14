import { validationResult } from 'express-validator'; // Importer express-validator
import Event from '../models/event.js'
export function getAll(req, res) {
    Event
    .find({})
    // .where('onSale').equals(true) // Si 'OnSale' a la valeur true
    // .where('year').gt(2000).lt(2022) // Si 2000 < 'year' < 2022 
    // .where('name').in(['DMC5', 'RE8', 'NFS']) // Si 'name' a l'une des valeurs du tableau
    // .limit(10) // Récupérer les 10 premiers seulement
    // .sort('-year') // Tri descendant (enlever le '-' pour un tri ascendant)
    // .select('name') // Ne retourner que les attributs mentionnés (séparés par des espace si plusieurs)
    // .exec() // Executer la requête
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
            // Récupérer l'URL de l'image pour l'insérer dans la BD
            image: `${req.protocol}://${req.get('host')}/img/${req.file.filename}`
        })
        .then(newEvent => {
            res.status(200).json(newEvent);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }
}
export function getOnce(req, res) {
    Event
    .findOne({ "titre": req.params.titre })
    .then(doc => {
        res.status(200).json(doc);
    })
    .catch(err => {
        res.status(500).json({ error: err });
    });
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

