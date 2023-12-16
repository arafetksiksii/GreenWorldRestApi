import { validationResult } from 'express-validator'; // Importer express-validator
import Comment from '../models/comment.js';
import Event from '../models/event.js'; // Assurez-vous que le chemin est correct
import mongoose from 'mongoose';

export function getAll(req, res) {
  Comment.find({})
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      res.status(500).json({ error: err });
    });
}

/*export function addOnce(req, res) {
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
*/
export function addOnce(req, res) {
  // Trouver les erreurs de validation dans cette requête et les envelopper dans un objet
  if (!validationResult(req).isEmpty()) {
    res.status(400).json({ errors: validationResult(req).array() });
  } else {
    let newComment; // Déclarer newComment en dehors du bloc try

    // Invoquer la méthode create directement sur le modèle
    Comment.create({
      Contenu: req.body.Contenu,
      date: req.body.date,
      eventID: req.body.eventID,
      userID: req.body.userID,
    })
      .then(comment => {
        newComment = comment; // Assigner la valeur à newComment
        // Mettre à jour le champ comments de l'événement
        return Event.findById(req.body.eventID).populate('comments');
      })
      .then(event => {
        if (event) {
          event.comments.push(newComment._id);
          return event.save();
        } else {
          throw new Error("Événement non trouvé");
        }
      })
      .then(() => {
        // Retourner le commentaire avec contenu et date
        res.status(200).json({
          message: 'Commentaire ajouté avec succès',
          comment: {
            _id: newComment._id,
            Contenu: newComment.Contenu,
            date: newComment.date,
          },
        });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
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
export async function getCommentsForEvent(eventID, req) {
  try {
    // Assurez-vous que eventID est une chaîne valide
    eventID = req.params.eventID.toString();
    console.log('ID avant conversion:', eventID);

    const event = await Event.findById(eventID).populate({
      path: 'comments',
      populate: {
        path: 'userID', // Remplacez 'userID' par le champ approprié dans votre modèle Comment
        select: 'email', // Sélectionnez les champs que vous souhaitez afficher
      },
    });

    if (event) {
      return event.comments.map(comment => ({
        _id: comment._id,
        Contenu: comment.Contenu,
        date: comment.date,
        userID: comment.userID._id,
      }));
    } else {
      console.log("Événement non trouvé");
      return [];
    }
  } catch (error) {
    console.error(error);
    // Gérer l'erreur
    return [];
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

/*export async function getCommentsByEvent(req, res) {
  try {
    let eventID = req.params.eventID.trim();

    // Vérifier si l'événement existe dans la base de données
    const isValidObjectId = mongoose.Types.ObjectId.isValid(eventID);

    if (!isValidObjectId) {
      // Si l'ID n'est pas valide, renvoyer une réponse appropriée
      return res.status(400).json({ error: "ID d'événement non valide" });
    }

    const event = await Event.findById(mongoose.Types.ObjectId(eventID));

    if (!event) {
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
 */


