import mongoose from 'mongoose';
const  { Schema,model } =mongoose;
const commentSchema = new Schema(
    {
        Contenu: {
            type: String,
            required: true
        },
        date: { type: Date, 
            default: Date.now },

        auteur: {
            type: String,
            required: true
        },
        EventID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'comment',
            require: true,
        },
    },
        
);
    
export default model("Comment", commentSchema);