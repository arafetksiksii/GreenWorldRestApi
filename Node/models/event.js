import mongoose from 'mongoose';
const  { Schema,model } =mongoose;
const eventSchema = new Schema(
    {
        titre: {
            type: String,
            required: true
        },
        dateDebut: {
            type: Date,
            required: true
        },
        dateFin: {
            type: Date,
            required: true
        },
        image: {
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
        }
    },
        {
            timesStamps: true //date automatique
        }
);
    
export default model("Event", eventSchema);