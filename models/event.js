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
            required: true
        },
        dateFin: {
            type: String,
            required: true
        },
        lieu: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        nbparticipant: {
            type: Number,
            required: true
        },
        nbPlace: {
            type: Number,
            required: true
        },
        image: {
            type: String ,
            required: true
        },
        latitude: {
            type: Number,
            required: false
        },
        longitude: {
            type: Number,
            required: false
        }
    },
        {
            timesStamps: true //date automatique
        }
        
);
    
export default model("Event", eventSchema);