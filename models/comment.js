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

            eventID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Event', 
                required: true,
              },
              userID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', 
                required: true,
              },
        

    },
        
);
    
export default model("Comment", commentSchema);