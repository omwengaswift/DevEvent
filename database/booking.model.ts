import mongoose, { Document, Model, Schema, Types } from 'mongoose';

// Booking attributes interface
export interface IBooking {
  eventId: Types.ObjectId;
  email: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IBookingDocument extends IBooking, Document {}

const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,}$/;

const bookingSchema = new Schema<IBookingDocument>(
  {
    eventId: { type: Schema.Types.ObjectId, required: true, ref: 'Event', index: true },
    email: { type: String, required: true, trim: true },
  },
  {
    timestamps: true,
    strict: true,
  }
);

// Pre-save: validate that the referenced event exists and that email is valid.
bookingSchema.pre<IBookingDocument>('save', async function (this: IBookingDocument) {
  // Validate email format
  if (typeof this.email !== 'string' || !emailRegex.test(this.email)) {
    throw new Error('Invalid email format');
  }

  // Ensure event exists. Use model lookup to avoid circular imports.
  const EventModel = mongoose.model('Event');
  const exists = await EventModel.exists({ _id: this.eventId });
  if (!exists) {
    throw new Error('Referenced event does not exist');
  }
});

// Avoid model overwrite in dev
const Booking: Model<IBookingDocument> = (mongoose.models.Booking as Model<IBookingDocument>) || mongoose.model<IBookingDocument>('Booking', bookingSchema);

export default Booking;
