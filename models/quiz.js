import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const quizSchema = new Schema(
    {
        nom_quiz: {
            type: String,
            required: true
        },
        description_quiz: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export default model('Quiz', quizSchema);