import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const TypeSchema = new Schema(
    {
        titre: {
            type: String,
            required: true
        },
        image_type: {
            type: String,
            required: true
        },
        // description: {
        //     type: String,
        //     required: false
        // },
      
    },
    {
        timestamps: true
    }
);

export default model('Type', TypeSchema);