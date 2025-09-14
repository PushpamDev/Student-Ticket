import mongoose from "mongoose";

export interface IMessage extends mongoose.Document {
  ticketId: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: Date;
}

const MessageSchema = new mongoose.Schema<IMessage>({
  ticketId: { type: String, required: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  body: { type: String, required: true },
  createdAt: { type: Date, default: () => new Date() },
});

export const Message = mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
