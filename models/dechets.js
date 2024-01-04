import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const DechetsSchema = new Schema(
    {
        Type_dechets: {
            type: String,
            required: true
        },
        date_depot: {
            type: String,
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
      
          userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User', 
            required: false,
          },

    },
    {
        timestamps: true
    }
);

export default model('Dechets', DechetsSchema);