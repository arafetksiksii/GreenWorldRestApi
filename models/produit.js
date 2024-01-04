import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const produitSchema = new Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        image2: {
            type: String,
            required: false
        },
        image3: {
            type: String,
            required: false
        },
        category: {
            type: String,
            required: false
        },
        price: {
            type: Number,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Produit', produitSchema);