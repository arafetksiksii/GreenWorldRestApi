import mongoose from 'mongoose';
const  { Schema,model } =mongoose;
const commentSchema = new Schema(
    {
        Contenu: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        auteur: {
            type: String,
            required: true
        },
    },
        {
            timesStamps: true //date automatique
        }
);
    
export default model("Comment", commentSchema);