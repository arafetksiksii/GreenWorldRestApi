import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema(
    {
        email: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        nom: {
            type: String
        },
        prenom: {
            type: String
        },
        dateNaissance: {
            type: Date
        },
        adress: {
            type: String
        },
        cin: {
            type: String
        },
        
        resetCode: {
            type:  String
        },
        userName: {
            type: String
        },
        numTel: {
            type: String
        },
        lastPassword: {
            type: String
        },
        isValid: {
            type: Boolean,
            default: true
        },
        imageRes: {
            type: String
        },
        resetToken: {
            type: String
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    },
    {
        timestamps: true
    }
);

export default model('User', userSchema);
