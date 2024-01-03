import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const PointDeCollecteSchema = new Schema(
    {
        nom: {
            type: String,
            required: true
        },
        latitude: {
            type: Number,
            required: true
        },
        longitude: {
            type: Number,
            required: true
        },
        capacite: {
            type: Number,
            required: true
        },
      
    },
    {
        timestamps: true
    }
);

export default model('PointDeCollecte', PointDeCollecteSchema);