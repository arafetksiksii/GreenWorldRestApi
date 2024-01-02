import { validationResult } from "express-validator";

import Dechets from "../models/dechets.js";

export function getAll(req, res) {
    Dechets.find({})
    .then((docs) => {
      let list = [];
      for (let i = 0; i < docs.length; i++) {
        list.push({
          id: docs[i]._id,
          Type_dechets: docs[i].Type_dechets,
          date_depot: docs[i].date_depot,
          nombre_capacite: docs[i].nombre_capacite,
          adresse: docs[i].adresse,
          etat: docs[i].etat,

        });
      }
      res.status(200).json(list);
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export function getAllForUser(req, res) {
  const userId = req.params.userId;

  Dechets.find({ userID: userId })
      .then((docs) => {
          let list = [];
          for (let i = 0; i < docs.length; i++) {
              list.push({
                id: docs[i]._id, // Use the actual ID from MongoDB
                Type_dechets: docs[i].Type_dechets,
                date_depot: docs[i].date_depot,
                nombre_capacite: docs[i].nombre_capacite,
                adresse: docs[i].adresse,
                userID: docs[i].userID, // Use the actual userID from MongoDB
                createdAt: docs[i].createdAt, // Use the actual createdAt from MongoDB
                updatedAt: docs[i].updatedAt,

              });

          }
          res.status(200).json(list);
      })

      .catch((err) => {
          res.status(500).json({ error: err });
      });
  
}


// export function addOnce(req, res) {
//   if (!validationResult(req).isEmpty()) {
//     console.log(req.body);
//     return res.status(400).json({ errors: validationResult(req).array() });
// } else {
//   //const qrcodeDate = `${req.body.Type_dechets}\n${req.body.date_depo}\n${req.body.nombre_capacite}\n${ req.body.adresse}`;
//   const imageUrl = cloudinaryResponse.secure_url;

//     Dechets.create({
//         Type_dechets: req.body.Type_dechets,
//         date_depot: req.body.date_depot,
//         nombre_capacite: req.body.nombre_capacite,
//         adresse: req.body.adresse,
//         userID: req.body.userID,

//     })
//       .then((newDechets) => {
//         res.status(200).json({
//             Type_dechets: newDechets.Type_dechets,
//             date_depot: newDechets.date_depot,
//             nombre_capacite: newDechets.nombre_capacite,
//           adresse: newDechets.adresse,
//           etat: newDechets.etat, // Vous pouvez inclure l'état dans la réponse si nécessaire

//         //  qrCode: newDechets.qrCode,
//         });
//       })
//       .catch((err) => {
//         res.status(500).json({ error: err });
//       });
//   }
// }

export async function addOnce(req, res) {
  try {
    if (!validationResult(req).isEmpty()) {
      console.log(req.body);
      return res.status(400).json({ errors: validationResult(req).array() });
    } else {

      Dechets.create({
        Type_dechets: req.body.Type_dechets,
        date_depot: req.body.date_depot,
        nombre_capacite: req.body.nombre_capacite,
        adresse: req.body.adresse,
        userID: req.body.userID,

      })
        .then((newDechets) => {
          res.status(200).json({
           Type_dechets: newDechets.Type_dechets,
            date_depot: newDechets.date_depot,
            nombre_capacite: newDechets.nombre_capacite,
            adresse: newDechets.adresse,
            etat: newDechets.etat,
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  } catch (error) {
    console.error('Error in addOnce:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



export function getOnce(req, res) {
  Dechets.findById(req.params.id)
  .then((doc) => {
    res.status(200).json(doc);
  })
  .catch((err) => {
    res.status(500).json({ error: err });
  });
}
export function deleteOnce(req, res) {
  const { id } = req.params;

  Dechets.findOneAndDelete({ _id: id })
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
export function putOnce(req, res) {
  let newDechets = {};
  if(req.file == undefined) {
    newDechets = {
        Type_dechets: req.body.Type_dechets,
        date_depot: req.body.date_depot,
        nombre_capacite: req.body.nombre_capacite,
        adresse: req.body.adresse,

    }
  }
  else {
    newDechets = {
        Type_dechets: req.body.Type_dechets,
        date_depot: req.body.date_depot,
        nombre_capacite: req.body.nombre_capacite,
        adresse: req.body.adresse,
    }
  }
  Dechets.findByIdAndUpdate(req.params.id, newDechets)
    .then((doc1) => {
        Dechets.findById(req.params.id)
        .then((doc2) => {
          res.status(200).json(doc2);
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    })
    .catch((err) => {
      res.status(500).json({ error: err });
    });
}

export async function updateDechetsEtat(req, res) {
  const { id } = req.params;
  const { etat } = req.body;

  try {
    // Utilisez findByIdAndUpdate avec l'option { new: true } pour renvoyer le document mis à jour
    const updatedDechets = await Dechets.findByIdAndUpdate(id, { etat }, { new: true });

    if (!updatedDechets) {
      return res.status(404).json({ message: "Document non trouvé" });
    }

    res.status(200).json(updatedDechets);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'état du document :", error);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
}
export async function updateDechetState(req, res) {
  try {
    const { id } = req.params;
    const { etat } = req.body;

    // Vérifiez si l'état fourni est valide
    if (!['en_attente', 'confirme', 'rejete', 'en_traitement'].includes(etat)) {
      return res.status(400).json({ error: 'État invalide' });
    }

    // Mettez à jour l'état du déchet
    const updatedDechet = await Dechets.findByIdAndUpdate(
      id,
      { $set: { etat } },
      { new: true }
    );

    if (!updatedDechet) {
      return res.status(404).json({ error: 'Déchet non trouvé' });
    }

    return res.json(updatedDechet);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
