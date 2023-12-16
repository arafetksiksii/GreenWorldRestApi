import mongoose from 'mongoose';
const  { Schema,model } =mongoose;
const reservationSchema = new Schema(
    {
        
        date_reservation: {
            type: Date,
            required: true
        },
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
    
export default model("Reservation", reservationSchema);
