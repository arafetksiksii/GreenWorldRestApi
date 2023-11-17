import { validationResult } from 'express-validator'; // Importer express-validator
import Comment from '../models/comment.js'
export function getAll(req, res) {
    Comment
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
        Comment
        .create({
            Contenu: req.body.Contenu,
            date: req.body.date,
            auteur: req.body.auteur,
            
        })
        .then(newComment => {
            res.status(200).json(newComment);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
    }
}
export function getOnce(req, res) {
    Comment
    .findOne({ "auteur": req.params.auteur })
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
    Comment
    .updateMany({}, { "Contenu": String })
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
    Comment
      .findOneAndUpdate({ "Contenu": req.params.Contenu }, { "date": req.body.date },{ "auteur": req.body.auteur }, { new: true })
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
    Comment
      .findOneAndDelete({ "auteur": req.params.auteur })
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

