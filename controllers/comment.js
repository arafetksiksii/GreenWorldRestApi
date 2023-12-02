import { validationResult } from 'express-validator'; // Importer express-validator
import Comment from '../models/comment.js';
import Event from '../models/event.js'; // Assurez-vous que le chemin est correct

export function getAll(req, res) {
  Comment.find({})
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export function addOnce(req, res) {
  // Trouver les erreurs de validation dans cette requête et les envelopper dans un objet
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    // Invoquer la méthode create directement sur le modèle
    Comment.create({
      Contenu: req.body.Contenu,
      date: req.body.date,
      eventID: req.body.eventID,
      userID: req.body.userID,
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
  Comment.findOne({ "eventID": req.params.eventID })
    .then(doc => {
      res.status(200).json(doc);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export function putOnce(req, res) {
  res.status(200).json({ message: "Updated!", Contenu: req.params.Contenu });
}

/**
 * Mettre à jour un seul document
 */
/**
 * Mettre à jour un seul commentaire
 */
export function patchOnce(req, res) {
  console.log("Received PATCH request for comment ID:", req.params.commentID);
  console.log("Request body:", req.body);

  Comment.findByIdAndUpdate(req.params.commentID, {
    $set: {
      "date": req.body.date,
      "eventID": req.body.eventID,
      "Contenu": req.body.Contenu,
      "userID": req.body.userID
    }
  }, { new: true })
    .then(doc => {
      if (doc) {
        console.log("Comment updated successfully:", doc);
        res.status(200).json(doc);
      } else {
        console.log("Comment not found");
        res.status(404).json({ message: "Comment not found" });
      }
    })
    .catch(err => {
      console.error("Error updating comment:", err);
      res.status(500).json({ error: err });
    });
}


/**
 * Supprimer un seul commentaire
 */
export function deleteOnce(req, res) {
  Comment.findByIdAndDelete(req.params.commentID)
    .then(doc => {
      if (doc) {
        res.status(200).json(doc);
      } else {
        res.status(404).json({ message: "Comment not found" });
      }
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

export async function getCommentByID(req, res) {
  try {
    const commentID = req.params.commentID;

    // Utiliser le modèle Comment pour trouver le commentaire par ID
    const comment = await Comment.findById(commentID);

    if (!comment) {
      // Aucun commentaire trouvé, renvoyer une réponse appropriée
      return res.status(404).json({ message: "Comment not found" });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export async function getCommentsByEvent(req, res) {
  try {
    let eventID = req.params.eventID.trim();

    // Vérifier si l'événement existe dans la base de données
    const eventExists = await Event.findById(eventID);

    if (!eventExists) {
      // Si l'événement n'est pas trouvé, renvoyer une réponse appropriée
      return res.status(404).json({ error: "Événement non trouvé" });
    }

    // Utiliser le modèle Comment pour trouver les commentaires par événement
    const comments = await Comment.find({ eventID: eventID });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
export function trierparDateCom(req, res) {
  Comment
    .find()
    .sort('-date') // Tri descendant (enlever le '-' pour un tri ascendant)
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

 
