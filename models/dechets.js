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
        adresse: {
            type: String,
            required: true
        },
        
        etat: {
            type: String,
            enum: ['en_attente', 'confirme', 'rejete', 'en_traitement'],
            default: 'en_attente',
          },
          latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        },
      
          userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
          },

    },
    {
        timestamps: true
    }
);

export default model('Dechets', DechetsSchema);