import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DechetsSchema = new Schema(
    {
        Type_dechets: {
            type: String,
            required: true
        },
        date_depot: {
            type: Date,
            required: true
        },
        nombre_capacite: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        }
       
    },
    {
        timestamps: true
    }
);

export default model('Dechets', DechetsSchema);