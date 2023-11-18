import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DechetsSchema = new Schema(
    {
        Type_dechets: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Type',
            require: true,
        },
        date_depot: {
            type: Date,
            required: true
        },
        nombre_capacite: {
            type: Number,
            required: true
        },
        adresse: {
            type: String,
            required: true
        }
       
    },
    {
        timestamps: true
    }
);

export default model('Dechets', DechetsSchema);