import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const questionSchema = new Schema(
  {
    id_quiz: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Quiz'
    },
    question: {
      type: String,
      required: true
    },
    choix: [{
      type: String,
      required: true
    }],
    reponse_correcte: {
      type: Number, // Peut être un String ou un Number selon votre cas d'usage
      required: true
    }
  },
  {
    timestamps: true
  }
);

export default model('Question', questionSchema);
