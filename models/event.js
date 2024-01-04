import mongoose from 'mongoose';
const  { Schema,model } =mongoose;
const eventSchema = new Schema(
    {

        titre: {
            type: String,
            required: true
        },
        dateDebut: {
            type: String,
            required: false
        },
        dateFin: {
            type: String,
            required: false
            
        },
        lieu: {
            type: String,
            required: false
        },
        description: {
            type: String,
            required: true
        },
        nbparticipant: {
            type: Number,
            required: false
        },
        nbPlace: {
            type: Number,
            required: false,
            min: 0, // Assurez-vous que cette contrainte permet une valeur de 0

        },
        image: {
            type: String ,
            required: false
        },
        latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        },
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
          }],
          reservations: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Reservation'
          }]
      
    },
        {
            timestamps: true // date automatique
        }
        
);
    
export default model("Event", eventSchema);