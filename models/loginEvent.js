// loginEvent.js

import mongoose from 'mongoose';

const loginEventSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const LoginEvent = mongoose.model('LoginEvent', loginEventSchema);

export default LoginEvent;
