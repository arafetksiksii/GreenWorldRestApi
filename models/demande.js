import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DemandesSchema = new Schema(
    {
        titre: {
            type: String,
            required: true
        },
        date_demande: {
            type: Date,
            required: true
        },
        type_materiel: {
            type: String,
            required: true
        },
        adresse: {
            type: String,
            required: true
        },
        est_valide: {
            type: Boolean,
            required: true
        },
         idDechet: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Demande', DemandesSchema);