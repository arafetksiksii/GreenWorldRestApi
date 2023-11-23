// fichier : models/resultatQuiz.js

import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const resultatQuizSchema = new Schema({
  id_user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  id_quiz: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Quiz'
  },
  score: {
    type: Number,
    required: true
  },
  reponses_user: [{
    question: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Question'
    },
    reponse: {
      type: Schema.Types.Mixed,
      required: true
    }
  }]
}, {
  timestamps: true
});

export default model('ResultatQuiz', resultatQuizSchema);
